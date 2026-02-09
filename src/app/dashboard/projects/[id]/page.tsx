"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { projects as projectsApi, memos as memosApi, chats as chatsApi, ai as aiApi, type Project, type Memo, type Chat, type ChatMessage } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { Maximize2, Bot, Upload, X, Trash2, Send } from "lucide-react";
import dynamic from "next/dynamic";
import FileUpload from "@/app/components/FileUpload";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

const ThreeViewer = dynamic(() => import("@/app/components/ThreeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <p className="text-(--color-text-muted)">Loading 3D Viewer...</p>
    </div>
  ),
});

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");
  const [, setMemos] = useState<Memo[]>([]);
  const [currentMemo, setCurrentMemo] = useState<Memo | null>(null);
  const [notes, setNotes] = useState("");
  const [savingMemo, setSavingMemo] = useState(false);
  
  // 3D Model state
  interface ModelFile {
    id: string;
    name: string;
    url: string;
    type: 'gltf' | 'obj' | 'stl';
  }
  const [modelFiles, setModelFiles] = useState<ModelFile[]>([]);
  const [currentModelIndex, setCurrentModelIndex] = useState<number>(0);
  const [showUpload, setShowUpload] = useState(true);
  
  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState("");
  interface AiMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Project Chat state
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    loadProject();
    loadMemos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (project?.teamId) {
      loadOrCreateChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.teamId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectsApi.get(projectId);
      setProject(data);
      setProjectName(data.name);
      await projectsApi.updateLastAccessed(projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const loadMemos = async () => {
    try {
      const data = await memosApi.listByProject(projectId);
      setMemos(data);
      if (data.length > 0) {
        setCurrentMemo(data[0]);
        setNotes(data[0].content);
      }
    } catch (err) {
      console.error("Failed to load memos:", err);
      setMemos([]);
    }
  };

  const loadOrCreateChat = async () => {
    if (!project?.teamId) return;
    try {
      setLoadingChat(true);
      const chats = await chatsApi.listByProject(projectId);
      if (chats.length > 0) {
        setChat(chats[0]);
        await loadChatMessages(chats[0].id);
      } else {
        const newChat = await chatsApi.create(project.teamId, projectId);
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

  const handleSaveProjectName = async () => {
    if (!projectName.trim()) return;
    try {
      await projectsApi.update(projectId, projectName);
      await loadProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update project name");
    }
  };

  const handleSaveMemo = async () => {
    if (!notes.trim() || !user) return;
    try {
      setSavingMemo(true);
      const author = user.nickname || user.email || 'Anonymous';
      if (currentMemo) {
        await memosApi.update(currentMemo.id, notes);
      } else {
        const newMemo = await memosApi.create(projectId, notes, author);
        setCurrentMemo(newMemo);
      }
      await loadMemos();
      alert("Memo saved successfully!");
    } catch (err) {
      console.error("Failed to save memo:", err);
      alert(err instanceof Error ? err.message : "Failed to save memo");
    } finally {
      setSavingMemo(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!newChatMessage.trim() || !chat || !user?.id) return;
    
    try {
      await chatsApi.sendMessage(chat.id, user.id, newChatMessage);
      setNewChatMessage("");
      await loadChatMessages(chat.id);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const handleSendAiQuestion = async () => {
    if (!aiQuestion.trim()) return;

    const userMessage: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: aiQuestion,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiQuestion("");
    setAiLoading(true);

    try {
      const response = await aiApi.ask(userMessage.content, `Project: ${project?.name || 'Unknown'}`);
      
      const aiResponse: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI API error:', error);
      const errorResponse: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, errorResponse]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileSelect = (files: Array<{file: File, url: string, type: 'gltf' | 'obj' | 'stl'}>) => {
    const newModels: ModelFile[] = files.map((fileData, index) => ({
      id: `${Date.now()}-${index}`,
      name: fileData.file.name,
      url: fileData.url,
      type: fileData.type,
    }));
    
    setModelFiles(prev => {
      const newFiles = [...prev, ...newModels];
      setCurrentModelIndex(newFiles.length - 1);
      return newFiles;
    });
    setShowUpload(false);
  };

  const handleRemoveModel = (index: number) => {
    const modelToRemove = modelFiles[index];
    if (modelToRemove) {
      URL.revokeObjectURL(modelToRemove.url);
    }
    const newFiles = modelFiles.filter((_, i) => i !== index);
    setModelFiles(newFiles);
    
    if (newFiles.length === 0) {
      setShowUpload(true);
      setCurrentModelIndex(0);
    } else if (currentModelIndex >= newFiles.length) {
      setCurrentModelIndex(newFiles.length - 1);
    }
  };

  const handleRemoveAllModels = () => {
    modelFiles.forEach(model => URL.revokeObjectURL(model.url));
    setModelFiles([]);
    setShowUpload(true);
    setCurrentModelIndex(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-(--color-text-muted)">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-4 bg-(--color-status-danger-bg) border border-(--color-status-danger-border) rounded-md">
        <p className="text-(--color-status-danger)">{error || "Project not found"}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-(--color-page-bg)">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-(--color-border-primary) bg-(--color-header-bg) shrink-0">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onBlur={handleSaveProjectName}
          className="text-lg font-medium text-(--color-text-primary) bg-transparent border-none outline-none focus:ring-1 focus:ring-(--color-accent-blue) rounded px-2"
        />
        <Button size="sm">
          Save Changes
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 3D Viewer + Notes */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 3D Viewer */}
          <div className="flex-1 bg-(--color-card-bg) m-4 rounded-lg border border-(--color-border-primary) relative overflow-hidden flex flex-col">
            {showUpload && modelFiles.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                <div className="w-full max-w-md">
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
              </div>
            ) : (
              <div className="flex-1 relative">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-(--color-text-muted)">Loading 3D Viewer...</p>
                  </div>
                }>
                  <ThreeViewer models={modelFiles} />
                </Suspense>
              </div>
            )}
            
            {/* File List - Bottom Left Overlay */}
            {modelFiles.length > 0 && (
              <div className="absolute bottom-4 left-4 max-w-xs z-20">
                <div className="bg-[#12141b]/90 border border-(--color-border-primary) rounded-lg p-3 max-h-48 overflow-y-auto shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-(--color-text-light) text-xs font-semibold">Models ({modelFiles.length})</h4>
                    <button
                      onClick={handleRemoveAllModels}
                      className="text-(--color-text-muted) hover:text-(--color-status-danger) text-xs transition-colors"
                      title="Remove all models"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1">
                    {modelFiles.map((model, index) => (
                      <div
                        key={model.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          index === currentModelIndex
                            ? 'bg-(--color-accent-blue)/20 border border-(--color-accent-blue)/50'
                            : 'hover:bg-(--color-input-bg)'
                        }`}
                        onClick={() => setCurrentModelIndex(index)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${index === currentModelIndex ? 'bg-(--color-accent-blue)' : 'bg-(--color-text-muted)'}`} />
                          <span className="text-(--color-text-light) text-xs truncate">{model.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveModel(index);
                          }}
                          className="text-(--color-text-muted) hover:text-(--color-status-danger) ml-2 flex-shrink-0"
                          title="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* 3D Viewer Controls - Top Right */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              <button 
                onClick={() => setShowUpload(!showUpload)}
                className="p-2 rounded bg-[#12141b]/90 border border-(--color-border-primary) hover:bg-(--color-input-bg) transition-colors text-(--color-text-muted) hover:text-(--color-text-light)"
                title="Upload new model"
              >
                <Upload size={18} />
              </button>
              <button className="p-2 rounded bg-[#12141b]/90 border border-(--color-border-primary) hover:bg-(--color-input-bg) transition-colors text-(--color-text-muted) hover:text-(--color-text-light)">
                <Maximize2 size={18} />
              </button>
            </div>
            
            {/* Upload overlay when showUpload is true but files exist */}
            {showUpload && modelFiles.length > 0 && (
              <div className="absolute inset-0 bg-[#1e2127]/95 flex items-center justify-center p-8 z-30">
                <div className="w-full max-w-md bg-(--color-card-bg) p-6 rounded-lg border border-(--color-border-primary)">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-(--color-text-primary)">Add Model</h3>
                    <button onClick={() => setShowUpload(false)} className="text-(--color-text-muted) hover:text-(--color-text-primary)">
                      <X size={20} />
                    </button>
                  </div>
                  <FileUpload onFileSelect={handleFileSelect} />
                  <Button
                    onClick={() => setShowUpload(false)}
                    variant="secondary"
                    className="mt-4 w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mx-4 mb-4 bg-(--color-card-bg) border border-(--color-border-primary) rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-(--color-text-primary) font-semibold text-sm">Project Notes</h3>
              <Button
                onClick={handleSaveMemo}
                disabled={savingMemo}
                size="sm"
                className="h-7 text-xs"
              >
                {savingMemo ? "Saving..." : "Save Note"}
              </Button>
            </div>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add project notes here..."
              className="min-h-[100px] text-sm"
            />
          </div>
        </div>

        {/* Right: AI Assistant + Project Chat */}
        <div className="w-[320px] flex flex-col border-l border-(--color-border-primary) bg-(--color-sidebar-bg)">
          {/* AI Assistant */}
          <div className="flex-1 flex flex-col p-4 border-b border-(--color-border-primary) min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={18} className="text-(--color-accent-blue)" />
              <h3 className="text-(--color-text-primary) font-semibold text-sm">AI Assistant</h3>
            </div>
            
            {/* AI Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1 custom-scrollbar">
              {aiMessages.length === 0 ? (
                <div className="p-3 rounded-lg bg-(--color-input-bg) border border-(--color-border-primary)">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={16} className="text-(--color-accent-blue)" />
                    <span className="text-(--color-text-light) text-xs font-medium">SIMVEX AI Coach</span>
                  </div>
                  <p className="text-(--color-text-muted) text-xs leading-relaxed">
                    Hello! I&apos;m your AI assistant. Ask me anything about 3D modeling, project management, or how to use SIMVEX.
                  </p>
                </div>
              ) : (
                aiMessages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg ${
                    msg.role === 'assistant' 
                      ? 'bg-(--color-input-bg) border border-(--color-border-primary)' 
                      : 'bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === 'assistant' ? (
                        <>
                          <Bot size={14} className="text-(--color-accent-blue)" />
                          <span className="text-(--color-text-light) text-xs font-medium">AI Coach</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 rounded-full bg-(--color-accent-blue) flex items-center justify-center text-white text-[10px] font-medium">
                            U
                          </div>
                          <span className="text-(--color-text-light) text-xs font-medium">You</span>
                        </>
                      )}
                      <span className="text-(--color-text-muted) text-[10px] ml-auto">
                        {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-(--color-text-secondary) text-xs leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="p-3 rounded-lg bg-(--color-input-bg) border border-(--color-border-primary)">
                  <div className="flex items-center gap-2">
                    <Bot size={14} className="text-(--color-accent-blue) animate-pulse" />
                    <span className="text-(--color-text-muted) text-xs">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendAiQuestion()}
                  placeholder="Ask AI..."
                  className="flex-1 px-3 py-2 rounded-md bg-(--color-input-bg) border border-(--color-input-border) text-(--color-text-primary) text-xs outline-none placeholder:text-(--color-text-muted) focus:border-(--color-accent-blue)"
                />
                <Button
                  onClick={handleSendAiQuestion}
                  size="sm"
                  className="px-3"
                  disabled={!aiQuestion.trim() || aiLoading}
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Project Chat */}
          <div className="flex-1 flex flex-col p-4 min-h-0">
            <h3 className="text-(--color-text-primary) font-semibold text-sm mb-3">Project Chat</h3>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1 custom-scrollbar">
              {loadingChat ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-(--color-text-muted) text-xs">Loading chat...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-(--color-text-muted)">
                  <p className="text-xs">No messages yet</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium bg-(--color-accent-blue)"
                      >
                        U
                      </div>
                      <span className="text-(--color-text-light) text-xs font-medium">User</span>
                      <span className="text-(--color-text-muted) text-[10px]">
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-(--color-text-secondary) text-xs leading-relaxed ml-8">
                      {msg.isDeleted ? "(deleted)" : msg.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-md bg-(--color-input-bg) border border-(--color-input-border) text-(--color-text-primary) text-xs outline-none placeholder:text-(--color-text-muted) focus:border-(--color-accent-blue)"
              />
              <Button
                onClick={handleSendChatMessage}
                size="sm"
                className="px-3"
                disabled={!newChatMessage.trim()}
              >
                <Send size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
