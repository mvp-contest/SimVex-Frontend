"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useParams } from "next/navigation";
import { projects as projectsApi, memos as memosApi, chats as chatsApi, type Project, type Memo, type Chat, type ChatMessage } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { Maximize2, Bot, Upload, X, Send } from "lucide-react";
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
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);
  const [partDescription, setPartDescription] = useState<string>("");
  const [loadingPartDescription, setLoadingPartDescription] = useState(false);

  // Collision detection callback (data from ThreeViewer)
  const handleCollisionData = useCallback((data: { count: number; collidingIds: Set<string> }) => {
    // Can be used for external UI or logging if needed
  }, []);


  // Project Chat state
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

      // Load project files from server
      try {
        const projectFiles = await projectsApi.getFiles(projectId);
        if (projectFiles.glbFiles && projectFiles.glbFiles.length > 0) {
          const serverModels: ModelFile[] = projectFiles.glbFiles.map((url, index) => {
            const fileName = url.split('/').pop() || `model-${index}`;
            const extension = fileName.split('.').pop()?.toLowerCase() || 'glb';
            const type = extension === 'obj' ? 'obj' : extension === 'stl' ? 'stl' : 'gltf';

            return {
              id: `server-${Date.now()}-${index}`,
              name: fileName,
              url: url,
              type: type as 'gltf' | 'obj' | 'stl',
            };
          });
          setModelFiles(serverModels);
        }
      } catch (fileErr) {
        // No files found for this project
      }

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

  const handleGetPartDescription = async () => {
    if (!selectedPartName || !projectId) return;
    
    try {
      setLoadingPartDescription(true);
      setPartDescription("");
      
      // Remove file extension from part name (e.g., "part.glb" -> "part")
      const nodeName = selectedPartName.replace(/\.(glb|gltf|obj|stl)$/i, '');
      
      // Ask AI for description (AI server will fetch metadata from R2 CDN)
      const aiResponse = await projectsApi.askNodeQuestion(
        projectId,
        nodeName,
        `${nodeName} 부품에 대해 자세히 설명해주세요. 이 부품의 기능, 특징, 용도 등을 포함해서 설명해주세요.`
      );
      
      // Handle different response formats
      let description = "";
      
      // Check for error responses first
      if (aiResponse.detail) {
        // This is an error response
        if (aiResponse.detail.includes("Metadata not found")) {
          throw new Error("Metadata not found for project");
        }
        throw new Error(aiResponse.detail);
      }
      
      // Handle success responses
      if (typeof aiResponse === 'string') {
        description = aiResponse;
      } else if (aiResponse.answer) {
        description = aiResponse.answer;
      } else if (aiResponse.response) {
        description = aiResponse.response;
      } else if (aiResponse.message) {
        description = aiResponse.message;
      } else {
        description = JSON.stringify(aiResponse, null, 2);
      }
      
      setPartDescription(description || "설명을 가져올 수 없습니다.");
    } catch (err) {
      console.error("Failed to get part description:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Handle metadata not found error - provide analysis based on part name
      if (errorMessage.includes("Metadata not found") || errorMessage.includes("Project or folder not found")) {
        const nodeName = selectedPartName.replace(/\.(glb|gltf|obj|stl)$/i, '');
        
        // Analyze part name and provide intelligent description
        let analysis = `🔍 부품 이름 분석: ${nodeName}\n\n`;
        
        const lowerName = nodeName.toLowerCase();
        
        if (lowerName.includes('gear')) {
          analysis += `⚙️ 기어 부품\n\n`;
          analysis += `이 부품은 기어(Gear) 구조를 포함하고 있습니다.\n\n`;
          analysis += `일반적인 기능:\n`;
          analysis += `• 회전 운동 전달\n`;
          analysis += `• 속도 및 토크 변환\n`;
          analysis += `• 동력 전달 시스템의 핵심 부품\n\n`;
          
          if (lowerName.includes('arm')) {
            analysis += `🦾 암(Arm) 연결 기어\n`;
            analysis += `• 로봇 팔이나 기계 암의 관절 부분에 사용\n`;
            analysis += `• 정밀한 각도 제어 가능\n`;
            analysis += `• 구동부와 암 구조를 연결\n`;
          }
        } else if (lowerName.includes('arm')) {
          analysis += `🦾 암(Arm) 구조 부품\n\n`;
          analysis += `• 로봇이나 기계의 팔 구조\n`;
          analysis += `• 물체를 잡거나 이동시키는 기능\n`;
          analysis += `• 여러 관절로 구성 가능\n`;
        } else if (lowerName.includes('motor')) {
          analysis += `⚡ 모터 부품\n\n`;
          analysis += `• 전기 에너지를 회전 운동으로 변환\n`;
          analysis += `• 구동 장치의 핵심\n`;
        } else if (lowerName.includes('shaft')) {
          analysis += `📏 샤프트(축) 부품\n\n`;
          analysis += `• 회전 운동 전달\n`;
          analysis += `• 베어링과 함께 사용\n`;
        } else {
          analysis += `📦 기계 부품\n\n`;
          analysis += `부품 이름에서 구체적인 기능을 파악하기 어렵습니다.\n`;
        }
        
        setPartDescription(analysis);
      } else if (errorMessage.includes("not found")) {
        setPartDescription(`"${selectedPartName}" 부품을 찾을 수 없습니다.\n\n프로젝트에 meta_data.json 파일이 업로드되어 있는지 확인해주세요.`);
      } else {
        setPartDescription(`부품 설명을 가져오는데 실패했습니다.\n\n에러: ${errorMessage}`);
      }
    } finally {
      setLoadingPartDescription(false);
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

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim() || !chat || !user?.id) return;

    // Create optimistic message for immediate display
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

    // Add message immediately to UI
    setChatMessages(prev => [...prev, optimisticMessage]);

    if (connected) {
      sendMessage(user.id, newChatMessage);
      setNewChatMessage("");
      // Stop typing indicator
      sendTyping(user.id, false);
    } else {
      // Fallback to REST if WebSocket is disconnected
      chatsApi.sendMessage(chat.id, user.id, newChatMessage).then(() => {
        setNewChatMessage("");
        loadChatMessages(chat.id);
      }).catch((err) => {
        console.error("Failed to send message:", err);
        // Remove optimistic message on error
        setChatMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      });
    }
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatMessage(e.target.value);
    if (!user?.id) return;

    // Send typing indicator
    sendTyping(user.id, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(user.id, false);
    }, 2000);
  };

  const handleFileSelect = async (files: Array<{file: File, url: string, type: 'gltf' | 'obj' | 'stl'}>) => {
    try {
      // Upload files to server
      const fileObjects = files.map(f => f.file);
      await projectsApi.uploadFiles(projectId, fileObjects);
      
      // Reload project files from server
      const projectFiles = await projectsApi.getFiles(projectId);
      
      // Convert server URLs to model files
      const serverModels: ModelFile[] = projectFiles.glbFiles.map((url, index) => {
        const fileName = url.split('/').pop() || `model-${index}`;
        const extension = fileName.split('.').pop()?.toLowerCase() || 'glb';
        const type = extension === 'obj' ? 'obj' : extension === 'stl' ? 'stl' : 'gltf';
        
        return {
          id: `server-${Date.now()}-${index}`,
          name: fileName,
          url: url,
          type: type as 'gltf' | 'obj' | 'stl',
        };
      });
      
      setModelFiles(serverModels);
      setCurrentModelIndex(serverModels.length - 1);
      setShowUpload(false);
      
      alert('파일이 성공적으로 업로드되었습니다!');
    } catch (err) {
      console.error('Failed to upload files:', err);
      alert(err instanceof Error ? err.message : '파일 업로드에 실패했습니다.');
      
      // Fallback: use local URLs
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
    }
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

  const getMessageDisplayName = (msg: ChatMessage) => {
    if (msg.user?.profile?.nickname) return msg.user.profile.nickname;
    if (msg.user?.personalId) return msg.user.personalId;
    return "User";
  };

  const getMessageInitial = (msg: ChatMessage) => {
    const name = getMessageDisplayName(msg);
    return name.charAt(0).toUpperCase();
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
        <Button size="sm" onClick={handleSaveProjectName}>
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
                  <ThreeViewer
                    models={modelFiles}
                    onCollisionData={handleCollisionData}
                    onPartSelect={(partName) => {
                      setSelectedPartName(partName);
                      setPartDescription("");
                    }}
                  />
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
              <h3 className="text-(--color-text-primary) font-semibold text-sm">Part Information</h3>
            </div>

            {/* Selected Part Display */}
            <div className="mb-3">
              <label className="text-(--color-text-muted) text-xs mb-1 block">Selected Part</label>
              <div className="px-3 py-2 rounded-md bg-(--color-input-bg) border border-(--color-input-border) text-(--color-text-primary) text-xs">
                {selectedPartName || "Click a part in 3D viewer"}
              </div>
            </div>

            {/* Get AI Description Button */}
            {selectedPartName && (
              <Button
                onClick={handleGetPartDescription}
                disabled={loadingPartDescription}
                size="sm"
                className="mb-3 w-full"
              >
                <Bot size={16} className="mr-2" />
                {loadingPartDescription ? "Loading..." : "Get AI Description"}
              </Button>
            )}

            {/* Part Description Display */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {partDescription ? (
                <div className="p-3 rounded-lg bg-(--color-input-bg) border border-(--color-border-primary)">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={16} className="text-(--color-accent-blue)" />
                    <span className="text-(--color-text-light) text-xs font-medium">AI Description</span>
                  </div>
                  <p className="text-(--color-text-secondary) text-xs leading-relaxed whitespace-pre-wrap">
                    {partDescription}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-(--color-input-bg) border border-(--color-border-primary)">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={16} className="text-(--color-accent-blue)" />
                    <span className="text-(--color-text-light) text-xs font-medium">SIMVEX AI</span>
                  </div>
                  <p className="text-(--color-text-muted) text-xs leading-relaxed">
                    3D 뷰어에서 부품을 클릭하고 "Get AI Description" 버튼을 눌러 부품 설명을 확인하세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Project Chat */}
          <div className="flex-1 flex flex-col p-4 min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-(--color-text-primary) font-semibold text-sm">Project Chat</h3>
              {connected ? (
                <span className="w-2 h-2 rounded-full bg-green-500" title="Connected" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-red-500" title="Disconnected" />
              )}
            </div>

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
                        {getMessageInitial(msg)}
                      </div>
                      <span className="text-(--color-text-light) text-xs font-medium">
                        {getMessageDisplayName(msg)}
                      </span>
                      <span className="text-(--color-text-muted) text-[10px]">
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      {msg.editedAt && (
                        <span className="text-(--color-text-muted) text-[10px]">(edited)</span>
                      )}
                    </div>
                    <p className="text-(--color-text-secondary) text-xs leading-relaxed ml-8">
                      {msg.deletedAt ? "(deleted)" : msg.content}
                    </p>
                  </div>
                ))
              )}
              {typingUsers.size > 0 && (
                <div className="flex items-center gap-2 ml-8">
                  <span className="text-(--color-text-muted) text-xs animate-pulse">
                    Someone is typing...
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={handleChatInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
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
