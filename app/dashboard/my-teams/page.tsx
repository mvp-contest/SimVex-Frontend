"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, Team, Message } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function MyTeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<"members" | "chat">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);

  const loadTeams = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getTeams(user.id);
      setTeams(data);
      if (data.length > 0) {
        setSelectedTeam(data[0]);
      }
    } catch (error) {
      console.error("Failed to load teams:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadTeamChat = useCallback(async () => {
    if (!selectedTeam) return;
    try {
      const chats = await api.getTeamChats(selectedTeam.id);
      if (chats.length > 0) {
        setChatId(chats[0].id);
        const chatMessages = await api.getMessages(chats[0].id);
        setMessages(chatMessages);
      } else {
        const newChat = await api.createChat({ teamId: selectedTeam.id });
        setChatId(newChat.id);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user, loadTeams]);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamChat();
    }
  }, [selectedTeam, loadTeamChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId || !user) return;

    try {
      const newMessage = await api.sendMessage(chatId, {
        senderId: user.id,
        content: message,
      });
      setMessages([...messages, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const filteredMembers = selectedTeam?.members?.filter((member) =>
    member.user?.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#787878] text-xl">Loading teams...</div>
      </div>
    );
  }

  if (!selectedTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-[#787878] text-xl mb-4">No teams found</p>
        <Link
          href="/dashboard"
          className="bg-[#64748B] hover:bg-[#526075] text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-8 overflow-hidden">
      <header className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold">{selectedTeam.name}</h1>
            <p className="text-[#787878] text-lg mt-2">
              {selectedTeam.description || "Team collaboration space"}
            </p>
          </div>
          {teams.length > 1 && (
            <select
              value={selectedTeam.id}
              onChange={(e) => {
                const team = teams.find((t) => t.id === e.target.value);
                if (team) setSelectedTeam(team);
              }}
              className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#64748B]"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-8 border-b border-[#333B45]">
          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-2 border-b-2 text-xl transition ${
              activeTab === "chat" ? "border-white" : "border-transparent text-zinc-500"
            }`}
          >
            Team Chat
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-2 border-b-2 text-xl transition ${
              activeTab === "members" ? "border-white" : "border-transparent text-zinc-500"
            }`}
          >
            Members ({filteredMembers.length})
          </button>
        </div>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* 채팅 영역 */}
        <div className="flex-1 bg-[#1E2127] border-2 border-[#333B45] rounded-lg flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-[#787878] py-12">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-[70%] ${
                        isMe ? "flex-row-reverse" : ""
                      }`}
                    >
                      {!isMe && (
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={msg.sender?.profileImage || "/profile-photo.jpg"}
                            alt="profile"
                            fill
                            className="rounded-full bg-[#C5D0E1] object-cover"
                          />
                        </div>
                      )}

                      <div className={isMe ? "w-full" : ""}>
                        {!isMe && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {msg.sender?.username}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                        <div
                          className={`${
                            isMe
                              ? "bg-[#2C303B] rounded-lg p-4"
                              : "bg-[#131620] rounded-lg p-4"
                          }`}
                        >
                          {isMe && (
                            <span className="block text-xs text-[#787878] mb-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                          )}
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 입력창 */}
          <div className="p-4 border-t border-[#333B45] flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-[#131620] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B]"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#64748B] hover:bg-[#526075] px-6 py-3 rounded-lg font-semibold transition"
            >
              Send
            </button>
          </div>
        </div>

        {/* 멤버 리스트 */}
        <div className="w-80 flex flex-col flex-shrink-0">
          <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-t-lg flex items-center px-4 py-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-white placeholder-zinc-500"
            />
            <Image src="/Search.svg" alt="Search" width={24} height={24} />
          </div>

          <div className="flex-1 bg-[#1E2127] border-2 border-[#333B45] border-t-0 rounded-b-lg flex flex-col overflow-hidden">
            <h3 className="px-5 py-3 font-medium border-b border-[#333B45]">
              Members ({filteredMembers.length})
            </h3>
            <div className="flex-1 overflow-y-auto">
              {filteredMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between px-5 py-3 border-b border-[#333B45] last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src={member.user?.profileImage || "/profile-photo.jpg"}
                        alt={member.user?.username || "User"}
                        fill
                        className="rounded-full bg-[#C5D0E1] object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {member.user?.username}
                      </p>
                      <p className="text-xs text-zinc-500">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
