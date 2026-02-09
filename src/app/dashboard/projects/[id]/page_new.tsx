"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { projects as projectsApi, type Project } from "@/lib/api";
import { Settings, Maximize2, Bot } from "lucide-react";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");
  const [notes, setNotes] = useState("");
  
  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState("");
  
  // Project Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userId: "1",
      userName: "Lee gu bin",
      message: "I love min ji Kim, she is my life itself",
      timestamp: "2:15 PM",
      avatar: "#d4a087"
    },
    {
      id: "2",
      userId: "2",
      userName: "Lee gu bin",
      message: "Ah anyway, I just have to write one long sentence. No, it has to be longer than this",
      timestamp: "3:42 PM",
      avatar: "#d4a087"
    }
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectsApi.get(projectId);
      setProject(data);
      setProjectName(data.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
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

  const handleSendAiQuestion = () => {
    if (!aiQuestion.trim()) return;
    console.log("AI Question:", aiQuestion);
    setAiQuestion("");
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      message: newChatMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      avatar: "#4a9eff"
    };
    
    setChatMessages([...chatMessages, message]);
    setNewChatMessage("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-md">
        <p className="text-red-400">{error || "Project not found"}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#333b45]">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onBlur={handleSaveProjectName}
          className="text-lg font-medium text-slate-200 bg-transparent border-none outline-none"
        />
        <button className="px-4 py-1.5 rounded-md bg-[#4a9eff] text-white text-sm font-medium hover:opacity-90 transition-opacity">
          Save
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 3D Viewer + Notes */}
        <div className="flex-1 flex flex-col">
          {/* 3D Viewer */}
          <div className="flex-1 bg-[#1e2127] m-4 rounded-lg border border-[#333b45] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-[#12141b] flex items-center justify-center">
                  <Settings size={48} className="text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">3D Viewer</p>
              </div>
            </div>
            
            {/* 3D Viewer Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button className="p-2 rounded bg-[#12141b] border border-[#333b45] hover:bg-[#1e2127] transition-colors">
                <Settings size={18} className="text-slate-400" />
              </button>
              <button className="p-2 rounded bg-[#12141b] border border-[#333b45] hover:bg-[#1e2127] transition-colors">
                <Maximize2 size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Exploded View Button */}
            <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md bg-[#12141b] border border-[#333b45] text-slate-300 text-sm font-medium hover:bg-[#1e2127] transition-colors flex items-center gap-2">
              <Settings size={16} />
              Exploded View
            </button>
          </div>

          {/* Notes */}
          <div className="mx-4 mb-4">
            <h3 className="text-slate-200 font-semibold text-sm mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full h-24 px-4 py-3 rounded-lg bg-[#1e2127] border border-[#333b45] text-slate-300 text-sm outline-none resize-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Right: AI Assistant + Project Chat */}
        <div className="w-[320px] flex flex-col border-l border-[#333b45]">
          {/* AI Assistant */}
          <div className="flex-1 flex flex-col p-4 border-b border-[#333b45]">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={18} className="text-slate-400" />
              <h3 className="text-slate-200 font-semibold text-sm">AI Assistant</h3>
            </div>
            
            <div className="mb-3 p-3 rounded-lg bg-[#1e2127] border border-[#333b45]">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={16} className="text-[#4a9eff]" />
                <span className="text-slate-300 text-xs font-medium">SIMVEX AI coach</span>
              </div>
              <div className="h-32 bg-[#12141b] rounded mb-2"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-[#12141b] rounded"></div>
                <div className="w-8 h-8 bg-[#4a9eff] rounded-full"></div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendAiQuestion()}
                  placeholder="Ask any questions here..."
                  className="flex-1 px-3 py-2 rounded-md bg-[#12141b] border border-[#333b45] text-slate-300 text-xs outline-none placeholder:text-slate-500"
                />
                <button
                  onClick={handleSendAiQuestion}
                  className="px-4 py-2 rounded-md bg-[#4a9eff] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Project Chat */}
          <div className="flex-1 flex flex-col p-4">
            <h3 className="text-slate-200 font-semibold text-sm mb-3">Project Chat</h3>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: msg.avatar || '#d4a087' }}
                    >
                      {msg.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-300 text-xs font-medium">{msg.userName}</span>
                    <span className="text-slate-500 text-xs">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed ml-8">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-md bg-[#12141b] border border-[#333b45] text-slate-300 text-xs outline-none placeholder:text-slate-500"
              />
              <button
                onClick={handleSendChatMessage}
                className="px-4 py-2 rounded-md bg-[#4a9eff] text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
