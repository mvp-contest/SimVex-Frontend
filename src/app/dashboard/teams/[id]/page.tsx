"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { teams as teamsApi, projects as projectsApi, chats as chatsApi, type Team, type Project, type Chat, type ChatMessage } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { Search, Plus, Trash2, Copy, RefreshCw, ChevronDown, UserX, Box, Send } from "lucide-react";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"members" | "projects" | "chat">("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [team, setTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Team Chat state
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // WebSocket event handlers
  const handleNewMessage = useCallback((message: ChatMessage) => {
    setChatMessages(prev => {
      if (prev.some(m => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const handleMessageEdited = useCallback((message: ChatMessage) => {
    setChatMessages(prev =>
      prev.map(m => m.id === message.id ? { ...m, content: message.content, editedAt: message.editedAt } : m)
    );
  }, []);

  const handleMessageDeleted = useCallback((data: { id: string }) => {
    setChatMessages(prev =>
      prev.map(m => m.id === data.id ? { ...m, deletedAt: new Date().toISOString() } : m)
    );
  }, []);

  const handleUserTyping = useCallback((data: { userId: string; isTyping: boolean }) => {
    if (data.userId === user?.id) return;
    setTypingUsers(prev => {
      const next = new Set(prev);
      if (data.isTyping) {
        next.add(data.userId);
      } else {
        next.delete(data.userId);
      }
      return next;
    });
  }, [user?.id]);

  // Socket connection
  const { connected, sendMessage, sendTyping } = useSocket({
    chatId: chat?.id ?? null,
    onNewMessage: handleNewMessage,
    onMessageEdited: handleMessageEdited,
    onMessageDeleted: handleMessageDeleted,
    onUserTyping: handleUserTyping,
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  useEffect(() => {
    if (teamId && activeTab === 'chat') {
      loadOrCreateChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, activeTab]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError("");
      const [teamData, projectsData] = await Promise.all([
        teamsApi.get(teamId),
        projectsApi.listByTeam(teamId),
      ]);
      setTeam(teamData);
      setProjects(projectsData);
      setTeamName(teamData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  const loadOrCreateChat = async () => {
    if (!teamId) return;
    try {
      setLoadingChat(true);
      const chats = await chatsApi.listByTeam(teamId);
      if (chats.length > 0) {
        setChat(chats[0]);
        await loadChatMessages(chats[0].id);
      } else {
        const newChat = await chatsApi.create(teamId);
        setChat(newChat);
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
      setChat(null);
      setChatMessages([]);
    } finally {
      setLoadingChat(false);
    }
  };

  const loadChatMessages = async (chatId: string) => {
    try {
      const messages = await chatsApi.getMessages(chatId);
      setChatMessages(messages);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setChatMessages([]);
    }
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim() || !chat || !user?.id) return;

    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      chatId: chat.id,
      userId: user.id,
      content: newChatMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: user.id,
        personalId: user.personalId,
        profile: {
          id: user.id,
          nickname: user.nickname,
        },
      },
    };

    setChatMessages(prev => [...prev, optimisticMessage]);

    if (connected) {
      sendMessage(user.id, newChatMessage);
      setNewChatMessage("");
      sendTyping(user.id, false);
    } else {
      chatsApi.sendMessage(chat.id, user.id, newChatMessage).then(() => {
        setNewChatMessage("");
        loadChatMessages(chat.id);
      }).catch((err) => {
        console.error("Failed to send message:", err);
        setChatMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      });
    }
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatMessage(e.target.value);
    if (!user?.id) return;

    sendTyping(user.id, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(user.id, false);
    }, 2000);
  };

  const getMessageDisplayName = (msg: ChatMessage) => {
    if (msg.user?.profile?.nickname) return msg.user.profile.nickname;
    if (msg.user?.personalId) return msg.user.personalId;
    return "User";
  };

  const getMessageInitial = (msg: ChatMessage) => {
    const name = getMessageDisplayName(msg);
    return name.charAt(0).toUpperCase();
  };

  const handleCreateProject = async () => {
    const name = prompt("Enter project name:");
    if (!name || !user?.id) return;

    try {
      setIsCreatingProject(true);
      await projectsApi.create(teamId, name, user.id);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectsApi.remove(projectId);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleSaveName = async () => {
    if (!teamName.trim()) return;
    try {
      setIsSaving(true);
      await teamsApi.update(teamId, teamName);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update team name");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await teamsApi.removeMember(teamId, userId);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove member");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: number) => {
    try {
      await teamsApi.updateMemberRole(teamId, userId, newRole);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm("Are you sure you want to disband this team? This action is irreversible.")) return;
    try {
      await teamsApi.remove(teamId);
      window.location.href = "/dashboard/teams";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete team");
    }
  };

  const handleCopyInviteCode = () => {
    if (team?.inviteCode) {
      navigator.clipboard.writeText(team.inviteCode);
      alert("Invite code copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-(--color-text-muted)">Loading team...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="p-4 bg-(--color-status-danger-bg) border border-(--color-status-danger-border) rounded-md">
        <p className="text-(--color-status-danger)">{error || "Team not found"}</p>
      </div>
    );
  }

  const filteredMembers = team.members.filter(
    (m) =>
      m.user.profile.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-8">
      {/* Team Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-(--color-text-primary) mb-2">
          {team.name}
        </h2>
        {team.description && (
          <p className="text-(--color-text-secondary)">
            {team.description}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-6 border-b border-(--color-border-primary)">
        <button
          onClick={() => setActiveTab("members")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "members"
              ? "text-(--color-text-primary) border-b-2 border-(--color-accent-blue)"
              : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
          }`}
        >
          Team Members
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "projects"
              ? "text-(--color-text-primary) border-b-2 border-(--color-accent-blue)"
              : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "chat"
              ? "text-(--color-text-primary) border-b-2 border-(--color-accent-blue)"
              : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
          }`}
        >
          Chat
        </button>
      </div>

      {activeTab === "members" ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Members Table */}
          <div className="flex-1">
            {/* Subtitle + Search */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-(--color-text-secondary)">
                Manage the members of your team below.
              </p>
              <div className="w-[250px] relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
                  <Search size={14} />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="w-full pl-9 pr-4 py-1.5 bg-(--color-input-bg) border border-(--color-input-border) rounded-md text-sm text-(--color-text-primary) outline-none focus:border-(--color-accent-blue) transition-colors"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-(--color-card-bg) border border-(--color-border-primary) rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[48px_1fr_120px_48px] items-center px-4 py-2 bg-[#12141b] border-b border-(--color-border-primary)">
                <span className="text-xs font-medium text-(--color-text-muted)">Profile</span>
                <span className="text-xs font-medium text-(--color-text-muted)">Name / Email</span>
                <span className="text-xs font-medium text-(--color-text-muted)">Role</span>
                <span />
              </div>

              {/* Table Rows */}
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-[48px_1fr_120px_48px] items-center px-4 py-3 border-b border-(--color-border-primary) last:border-0 hover:bg-(--color-card-bg)/80 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-(--color-input-bg) text-(--color-text-muted) overflow-hidden"
                  >
                    {member.user.profile.avatar ? (
                      <Image src={member.user.profile.avatar} alt={member.user.profile.nickname} width={32} height={32} />
                    ) : (
                      member.user.profile.nickname.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Name + Email */}
                  <div>
                    <p className="text-sm font-medium text-(--color-text-primary)">
                      {member.user.profile.nickname}
                    </p>
                    <p className="text-xs text-(--color-text-muted)">
                      {member.user.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div>
                    <button
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        member.role === 0 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : 'bg-(--color-input-bg) text-(--color-text-secondary) border border-(--color-input-border) hover:border-(--color-text-muted)'
                      } ${member.role !== 0 ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={() => member.role !== 0 && handleUpdateRole(member.user.id, member.role === 1 ? 2 : 1)}
                      disabled={member.role === 0}
                    >
                      {member.role === 0 ? 'Owner' : member.role === 1 ? 'Admin' : 'Member'}
                      {member.role !== 0 && <ChevronDown size={12} />}
                    </button>
                  </div>

                  {/* Action Icon */}
                  <div className="flex justify-center">
                    {member.role !== 0 && (
                      <button 
                        onClick={() => handleRemoveMember(member.user.id)}
                        className="text-(--color-text-muted) hover:text-(--color-status-danger) transition-colors p-1"
                      >
                        <UserX size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty rows to fill space if needed */}
              {filteredMembers.length === 0 && (
                <div className="p-8 text-center text-(--color-text-muted)">
                  No members found matching your search.
                </div>
              )}
            </div>
          </div>

          {/* Right: Team Settings Panel */}
          <div className="w-full lg:w-[320px] bg-(--color-card-bg) border border-(--color-border-primary) rounded-lg p-5 flex-shrink-0 self-start h-fit">
            <h3 className="font-semibold text-(--color-text-primary) mb-4">
              Team Settings
            </h3>

            {/* Team Name */}
            <div className="mb-6">
              <TextInput
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <Button
                onClick={handleSaveName}
                disabled={isSaving}
                size="sm"
                variant="secondary"
                className="w-full mt-3"
              >
                {isSaving ? 'Saving...' : 'Save Name'}
              </Button>
            </div>

            {/* Invite Code */}
            <div className="mb-6 pb-6 border-b border-(--color-border-primary)">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-(--color-text-secondary)">Invite Code</label>
                <p className="text-xs text-(--color-text-muted) mb-2">
                  Share this code with new members to join the team.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-(--color-input-bg) border border-(--color-input-border) rounded-md text-sm text-center font-mono text-(--color-text-primary)">
                    {team.inviteCode || 'No code'}
                  </div>
                  <Button
                    onClick={handleCopyInviteCode}
                    disabled={!team.inviteCode}
                    variant="secondary"
                    size="sm"
                    className="px-3"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs"
                >
                  <RefreshCw size={12} className="mr-1" /> Generate New Code
                </Button>
              </div>
            </div>

            {/* Disband Section */}
            <div>
              <h4 className="font-medium text-(--color-text-primary) text-sm mb-1">
                Danger Zone
              </h4>
              <p className="text-xs text-(--color-text-muted) mb-3">
                This action cannot be undone.
              </p>
              <Button
                onClick={handleDeleteTeam}
                variant="danger"
                size="sm"
                className="w-full"
              >
                Disband Team
              </Button>
            </div>
          </div>
        </div>
      ) : activeTab === "projects" ? (
        <div>
          {/* Projects Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-(--color-text-secondary)">
              Manage projects within this team.
            </p>
            <Button onClick={handleCreateProject} disabled={isCreatingProject} size="sm">
              <Plus size={16} />
              {isCreatingProject ? "Creating..." : "New Project"}
            </Button>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-(--color-border-primary) rounded-xl bg-(--color-card-bg)/30">
              <Box size={48} className="text-(--color-text-muted) mb-4 opacity-50" />
              <p className="text-lg font-medium text-(--color-text-secondary) mb-2">No Projects Yet</p>
              <p className="text-sm text-(--color-text-muted)">Create your first project to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="bg-(--color-card-bg) border border-(--color-card-border) rounded-xl overflow-hidden hover:border-(--color-accent-blue) transition-colors"
                >
                  <div className="relative h-[120px] bg-[#12141b] flex items-center justify-center border-b border-(--color-card-border)">
                    <Image
                      src="/SIMVEX_logo_2.svg"
                      alt="Project"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-(--color-text-primary) mb-1">
                      {project.name}
                    </h4>
                    <span className="text-xs text-(--color-text-muted)">
                      {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          Open
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDeleteProject(project.id)}
                        variant="danger"
                        size="sm"
                        className="px-3"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-(--color-card-bg) border border-(--color-border-primary) rounded-xl overflow-hidden flex flex-col" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border-primary) bg-(--color-header-bg)">
              <h3 className="text-(--color-text-primary) font-semibold">Team Chat</h3>
              {connected ? (
                <span className="flex items-center gap-2 text-xs text-(--color-text-muted)">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-2 text-xs text-(--color-text-muted)">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Disconnected
                </span>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {loadingChat ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-(--color-text-muted) text-sm">Loading chat...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-(--color-text-muted)">
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Start a conversation with your team</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-(--color-accent-blue)">
                        {getMessageInitial(msg)}
                      </div>
                      <span className="text-(--color-text-light) text-sm font-medium">
                        {getMessageDisplayName(msg)}
                      </span>
                      <span className="text-(--color-text-muted) text-xs">
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      {msg.editedAt && (
                        <span className="text-(--color-text-muted) text-xs">(edited)</span>
                      )}
                    </div>
                    <p className="text-(--color-text-secondary) text-sm leading-relaxed ml-10">
                      {msg.deletedAt ? "(deleted)" : msg.content}
                    </p>
                  </div>
                ))
              )}
              {typingUsers.size > 0 && (
                <div className="flex items-center gap-2 ml-10">
                  <span className="text-(--color-text-muted) text-xs animate-pulse">
                    Someone is typing...
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="px-6 py-4 border-t border-(--color-border-primary) bg-(--color-header-bg)">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={handleChatInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-(--color-input-bg) border border-(--color-input-border) text-(--color-text-primary) text-sm outline-none placeholder:text-(--color-text-muted) focus:border-(--color-accent-blue)"
                />
                <Button
                  onClick={handleSendChatMessage}
                  disabled={!newChatMessage.trim()}
                  className="px-4"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
