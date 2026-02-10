"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useParams } from "next/navigation";
import {
  projects as projectsApi,
  memos as memosApi,
  chats as chatsApi,
  type Project,
  type Memo,
  type Chat,
  type ChatMessage,
} from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import {
  Maximize2,
  Bot,
  Upload,
  X,
  Send,
  MessageCircle,
  Plus,
  Trash2,
  Box,
} from "lucide-react";
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

interface PartMetaData {
  name: string;
  description: string;
}

interface MetaDataJson {
  [fileName: string]: PartMetaData;
}

interface ModelFile {
  id: string;
  name: string;
  url: string;
  type: "gltf" | "obj" | "stl";
  displayName?: string;
  description?: string;
}

interface AIQuestion {
  id: string;
  partName: string;
  question: string;
  answer?: string;
  isLoading?: boolean;
  timestamp: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");

  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [currentMemo, setCurrentMemo] = useState<Memo | null>(null);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemoContent, setEditingMemoContent] = useState("");
  const [savingMemo, setSavingMemo] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);

  const [metaData, setMetaData] = useState<MetaDataJson>({});
  const [availableFiles, setAvailableFiles] = useState<ModelFile[]>([]);
  const [spawnedModels, setSpawnedModels] = useState<ModelFile[]>([]);
  const [showUpload, setShowUpload] = useState(true);
  const [selectedPart, setSelectedPart] = useState<ModelFile | null>(null);

  const [rightTab, setRightTab] = useState<"parts" | "info" | "memos">("parts");
  const [notes, setNotes] = useState("");
  const [selectedPartName, setSelectedPartName] = useState("");

  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const aiEndRef = useRef<HTMLDivElement>(null);

  const handleCollisionData = useCallback(
    (data: { count: number; collidingIds: Set<string> }) => {},
    [],
  );

  const [chat, setChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNewMessage = useCallback((message: ChatMessage) => {
    setChatMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const handleMessageEdited = useCallback((message: ChatMessage) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === message.id
          ? { ...m, content: message.content, editedAt: message.editedAt }
          : m,
      ),
    );
  }, []);

  const handleMessageDeleted = useCallback((data: { id: string }) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === data.id ? { ...m, deletedAt: new Date().toISOString() } : m,
      ),
    );
  }, []);

  const handleUserTyping = useCallback(
    (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === user?.id) return;
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (data.isTyping) {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    },
    [user?.id],
  );

  const { connected, sendMessage, sendTyping } = useSocket({
    chatId: chat?.id ?? null,
    onNewMessage: handleNewMessage,
    onMessageEdited: handleMessageEdited,
    onMessageDeleted: handleMessageDeleted,
    onUserTyping: handleUserTyping,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiQuestions]);

  useEffect(() => {
    loadProject();
    loadMemos();
  }, [projectId]);

  useEffect(() => {
    if (project?.teamId) {
      loadOrCreateChat();
    }
  }, [project?.teamId]);

  const loadMetaData = async (projectId: string) => {
    try {
      const metaUrl = projectsApi.getFileUrl(projectId, "meta_data.json");
      const response = await fetch(metaUrl);
      if (!response.ok) {
        console.warn("meta_data.json not found");
        return {};
      }
      const data = await response.json();
      return data as MetaDataJson;
    } catch (err) {
      console.warn("Failed to load meta_data.json:", err);
      return {};
    }
  };

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectsApi.get(projectId);
      setProject(data);
      setProjectName(data.name);

      try {
        const projectFiles = await projectsApi.getFiles(projectId);
        if (projectFiles?.files && Array.isArray(projectFiles.files)) {
          // Load meta_data.json first
          const meta = await loadMetaData(projectId);
          setMetaData(meta);

          const models: ModelFile[] = projectFiles.files
            .filter((fileName) => {
              const ext = fileName.split(".").pop()?.toLowerCase();
              return (
                ext === "glb" ||
                ext === "gltf" ||
                ext === "obj" ||
                ext === "stl"
              );
            })
            .map((fileName, index) => {
              const extension =
                fileName.split(".").pop()?.toLowerCase() || "glb";
              const type =
                extension === "obj"
                  ? "obj"
                  : extension === "stl"
                    ? "stl"
                    : "gltf";

              // Get metadata for this file
              const fileMetaData = meta[fileName];

              return {
                id: `available-${Date.now()}-${index}`,
                name: fileName,
                url: projectsApi.getFileUrl(projectId, fileName),
                type: type as "gltf" | "obj" | "stl",
                displayName: fileMetaData?.name || fileName,
                description: fileMetaData?.description || "",
              };
            });

          if (models.length > 0) {
            setAvailableFiles(models);
            setShowUpload(false);
          }
        }
      } catch (fileErr) {
        console.error("Failed to load files:", fileErr);
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
      setMemoList(data);
    } catch (err) {
      console.error("Failed to load memos:", err);
      setMemoList([]);
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
      alert(
        err instanceof Error ? err.message : "Failed to update project name",
      );
    }
  };

  const askAIAboutPart = async (partName: string, question: string) => {
    const questionId = `q-${Date.now()}`;
    const newQuestion: AIQuestion = {
      id: questionId,
      partName,
      question,
      isLoading: true,
      timestamp: new Date().toISOString(),
    };

    setAiQuestions((prev) => [...prev, newQuestion]);
    setShowAiAssistant(true);

    try {
      const nodeName = partName.replace(/\.(glb|gltf|obj|stl)$/i, "");
      const aiResponse = await projectsApi.askNodeQuestion(
        projectId,
        nodeName,
        question,
      );

      let answer = "";
      if (aiResponse.detail) {
        if (aiResponse.detail.includes("Metadata not found")) {
          throw new Error("Metadata not found for project");
        }
        throw new Error(aiResponse.detail);
      }

      if (typeof aiResponse === "string") {
        answer = aiResponse;
      } else if (aiResponse.answer) {
        answer = aiResponse.answer;
      } else if (aiResponse.response) {
        answer = aiResponse.response;
      } else if (aiResponse.message) {
        answer = aiResponse.message;
      } else {
        answer = JSON.stringify(aiResponse, null, 2);
      }

      setAiQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answer: answer || "답변을 가져올 수 없습니다.",
                isLoading: false,
              }
            : q,
        ),
      );
    } catch (err) {
      console.error("Failed to get AI answer:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);

      let fallbackAnswer = `부품 설명을 가져오는데 실패했습니다.\n\n에러: ${errorMessage}`;

      if (
        errorMessage.includes("Metadata not found") ||
        errorMessage.includes("Project or folder not found")
      ) {
        const nodeName = partName.replace(/\.(glb|gltf|obj|stl)$/i, "");
        const lowerName = nodeName.toLowerCase();

        let analysis = `부품 이름 분석: ${nodeName}\n\n`;

        if (lowerName.includes("gear")) {
          analysis += `기어 부품\n\n`;
          analysis += `이 부품은 기어(Gear) 구조를 포함하고 있습니다.\n\n`;
          analysis += `일반적인 기능:\n`;
          analysis += `• 회전 운동 전달\n`;
          analysis += `• 속도 및 토크 변환\n`;
          analysis += `• 동력 전달 시스템의 핵심 부품\n\n`;

          if (lowerName.includes("arm")) {
            analysis += `암(Arm) 연결 기어\n`;
            analysis += `• 로봇 팔이나 기계 암의 관절 부분에 사용\n`;
            analysis += `• 정밀한 각도 제어 가능\n`;
            analysis += `• 구동부와 암 구조를 연결\n`;
          }
        } else if (lowerName.includes("arm")) {
          analysis += `암(Arm) 구조 부품\n\n`;
          analysis += `• 로봇이나 기계의 팔 구조\n`;
          analysis += `• 물체를 잡거나 이동시키는 기능\n`;
          analysis += `• 여러 관절로 구성 가능\n`;
        } else if (lowerName.includes("motor")) {
          analysis += `모터 부품\n\n`;
          analysis += `• 전기 에너지를 회전 운동으로 변환\n`;
          analysis += `• 구동 장치의 핵심\n`;
        } else if (lowerName.includes("shaft")) {
          analysis += `샤프트(축) 부품\n\n`;
          analysis += `• 회전 운동 전달\n`;
          analysis += `• 베어링과 함께 사용\n`;
        } else {
          analysis += `기계 부품\n\n`;
          analysis += `부품 이름에서 구체적인 기능을 파악하기 어렵습니다.\n`;
        }

        fallbackAnswer = analysis;
      }

      setAiQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, answer: fallbackAnswer, isLoading: false }
            : q,
        ),
      );
    }
  };

  const handleCreateMemo = () => {
    setEditingMemoId(null);
    setEditingMemoContent("");
    setShowMemoModal(true);
  };

  const handleEditMemo = (memo: Memo) => {
    setEditingMemoId(memo.id);
    setEditingMemoContent(memo.content);
    setShowMemoModal(true);
  };

  const handleSaveMemo = async () => {
    if (!editingMemoContent.trim() || !user) return;
    try {
      setSavingMemo(true);
      const author = user.nickname || user.email || "Anonymous";
      if (editingMemoId) {
        await memosApi.update(editingMemoId, editingMemoContent);
      } else {
        await memosApi.create(projectId, editingMemoContent, author);
      }
      await loadMemos();
      setShowMemoModal(false);
      setEditingMemoContent("");
      setEditingMemoId(null);
    } catch (err) {
      console.error("Failed to save memo:", err);
      alert(err instanceof Error ? err.message : "Failed to save memo");
    } finally {
      setSavingMemo(false);
    }
  };

  const handleDeleteMemo = async (memoId: string) => {
    if (!confirm("Are you sure you want to delete this memo?")) return;
    try {
      await memosApi.remove(memoId);
      await loadMemos();
    } catch (err) {
      console.error("Failed to delete memo:", err);
      alert(err instanceof Error ? err.message : "Failed to delete memo");
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

    setChatMessages((prev) => [...prev, optimisticMessage]);

    if (connected) {
      sendMessage(user.id, newChatMessage);
      setNewChatMessage("");
      sendTyping(user.id, false);
    } else {
      chatsApi
        .sendMessage(chat.id, user.id, newChatMessage)
        .then(() => {
          setNewChatMessage("");
          loadChatMessages(chat.id);
        })
        .catch((err) => {
          console.error("Failed to send message:", err);
          setChatMessages((prev) =>
            prev.filter((m) => m.id !== optimisticMessage.id),
          );
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

  const handleFileSelect = async (
    files: Array<{
      file: File;
      url: string;
      type: "gltf" | "obj" | "stl" | "json";
    }>,
  ) => {
    try {
      const fileObjects = files.map((f) => f.file);
      await projectsApi.uploadFiles(projectId, fileObjects);

      await loadProject();

      setShowUpload(false);

      alert("Files uploaded successfully!");
    } catch (err) {
      console.error("Failed to upload files:", err);
      alert(err instanceof Error ? err.message : "Failed to upload files");
    }
  };

  const handleSpawnModel = (fileIndex: number) => {
    const file = availableFiles[fileIndex];
    if (!file) return;

    const newModel: ModelFile = {
      ...file,
      id: `spawned-${Date.now()}-${Math.random()}`,
    };

    setSpawnedModels((prev) => [...prev, newModel]);
    setSelectedPartName(file.name);
  };

  const handleRemoveModel = (index: number) => {
    setSpawnedModels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllModels = () => {
    setSpawnedModels([]);
  };

  const handlePartSelect = (partName: string) => {
    setSelectedPartName(partName);
    // Auto-add question when part is selected
    const defaultQuestion = `${partName} 부품에 대해 자세히 설명해주세요. 이 부품의 기능, 특징, 용도 등을 포함해서 설명해주세요.`;
    askAIAboutPart(partName, defaultQuestion);
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
        <p className="text-(--color-status-danger)">
          {error || "Project not found"}
        </p>
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
          Save
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: 3D Viewer */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-(--color-card-bg) m-4 rounded-lg border border-(--color-border-primary) relative overflow-hidden">
            {showUpload && spawnedModels.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                <div className="w-full max-w-md">
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
              </div>
            ) : (
              <div className="flex-1 relative h-full">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      <p className="text-(--color-text-muted)">
                        Loading 3D Viewer...
                      </p>
                    </div>
                  }
                >
                  <ThreeViewer
                    models={spawnedModels}
                    onCollisionData={handleCollisionData}
                    onPartSelect={handlePartSelect}
                  />
                </Suspense>
              </div>
            )}

            {/* Spawned Models List */}
            {spawnedModels.length > 0 && (
              <div className="absolute bottom-4 left-4 max-w-xs z-20">
                <div className="bg-[#12141b]/90 border border-(--color-border-primary) rounded-lg p-3 max-h-48 overflow-y-auto shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-(--color-text-light) text-xs font-semibold">
                      Spawned Models ({spawnedModels.length})
                    </h4>
                    <button
                      onClick={handleRemoveAllModels}
                      className="text-(--color-text-muted) hover:text-(--color-status-danger) text-xs transition-colors"
                      title="Remove all models"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1">
                    {spawnedModels.map((model, index) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-(--color-input-bg) transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-2 h-2 rounded-full flex-shrink-0 bg-(--color-accent-blue)" />
                          <span className="text-(--color-text-light) text-xs truncate">
                            {model.displayName || model.name}
                          </span>
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

            {/* Controls */}
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

            {/* Upload Modal */}
            {showUpload && spawnedModels.length > 0 && (
              <div className="absolute inset-0 bg-[#1e2127]/95 flex items-center justify-center p-8 z-30">
                <div className="w-full max-w-md bg-(--color-card-bg) p-6 rounded-lg border border-(--color-border-primary)">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-(--color-text-primary)">
                      Add Model
                    </h3>
                    <button
                      onClick={() => setShowUpload(false)}
                      className="text-(--color-text-muted) hover:text-(--color-text-primary)"
                    >
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
        </div>

        {/* Right Sidebar */}
        <div className="w-[340px] flex flex-col border-l border-(--color-border-primary) bg-(--color-sidebar-bg)">
          {/* Tabs */}
          <div className="flex border-b border-(--color-border-primary) bg-(--color-header-bg)">
            <button
              onClick={() => setRightTab("parts")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                rightTab === "parts"
                  ? "text-(--color-text-primary) border-b-2 border-(--color-accent-blue)"
                  : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
              }`}
            >
              Parts
            </button>
            <button
              onClick={() => setRightTab("info")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                rightTab === "info"
                  ? "text-(--color-text-primary) border-b-2 border-(--color-accent-blue)"
                  : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
              }`}
            >
              Info
            </button>
            <button
              onClick={() => setRightTab("memos")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                rightTab === "memos"
                  ? "text-(--color-text-primary) border-b-2 border-(--color-accent-blue)"
                  : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
              }`}
            >
              Memos
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {rightTab === "parts" && (
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <h3 className="text-(--color-text-primary) font-semibold text-sm mb-3">
                  Available Parts ({availableFiles.length})
                </h3>
                <div className="space-y-2">
                  {availableFiles.map((file, index) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-lg bg-(--color-card-bg) border border-(--color-border-primary) hover:border-(--color-accent-blue) transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-(--color-text-light) text-sm font-medium truncate">
                            {file.displayName}
                          </h4>
                          {file.description && (
                            <p className="text-(--color-text-muted) text-xs mt-1 line-clamp-2">
                              {file.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSpawnModel(index)}
                          className="flex-1 px-2 py-1 text-xs bg-(--color-input-bg) hover:bg-(--color-accent-blue) hover:text-white rounded transition-colors"
                        >
                          Spawn
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPart(file);
                            setRightTab("info");
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-(--color-input-bg) hover:bg-(--color-accent-blue) hover:text-white rounded transition-colors"
                        >
                          <Bot size={12} />
                          Info
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rightTab === "info" && (
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {selectedPart ? (
                  <div>
                    <h3 className="text-(--color-text-primary) font-semibold text-lg mb-2">
                      {selectedPart.displayName || selectedPart.name}
                    </h3>
                    {selectedPart.description && (
                      <p className="text-(--color-text-secondary) text-sm mb-4 leading-relaxed">
                        {selectedPart.description}
                      </p>
                    )}
                    <div className="mt-4 p-3 bg-(--color-input-bg) rounded-lg border border-(--color-border-primary)">
                      <p className="text-xs text-(--color-text-muted) mb-1">
                        File Name:
                      </p>
                      <p className="text-sm text-(--color-text-primary) font-mono">
                        {selectedPart.name}
                      </p>
                    </div>
                    <div className="mt-3 p-3 bg-(--color-input-bg) rounded-lg border border-(--color-border-primary)">
                      <p className="text-xs text-(--color-text-muted) mb-1">
                        File Type:
                      </p>
                      <p className="text-sm text-(--color-text-primary) uppercase">
                        {selectedPart.type}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        askAIAboutPart(
                          selectedPart.displayName || selectedPart.name,
                          `${selectedPart.displayName || selectedPart.name}에 대해 자세히 설명해주세요.`,
                        )
                      }
                      className="w-full mt-4"
                      size="sm"
                    >
                      <Bot size={16} className="mr-2" />
                      Ask AI about this part
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-(--color-text-muted)">
                    <Box size={48} className="mb-4 opacity-50" />
                    <p className="text-sm">Select a part to view details</p>
                  </div>
                )}
              </div>
            )}

            {rightTab === "memos" && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-(--color-border-primary)">
                  <Button
                    onClick={handleCreateMemo}
                    size="sm"
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    New Memo
                  </Button>
                </div>
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
                  <div
                    className="flex gap-4 pb-2"
                    style={{ minWidth: "min-content" }}
                  >
                    {memoList.map((memo) => (
                      <div
                        key={memo.id}
                        onClick={() => handleEditMemo(memo)}
                        className="relative flex-shrink-0 w-48 h-48 bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-yellow-400"
                        style={{
                          transform: "rotate(-1deg)",
                        }}
                      >
                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-6 whitespace-pre-wrap break-words">
                          {memo.content}
                        </p>
                        <div className="absolute bottom-2 right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMemo(memo.id);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {memoList.length === 0 && (
                      <div className="w-full flex items-center justify-center text-(--color-text-muted) text-sm">
                        No memos yet. Click "New Memo" to create one.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Memo Modal */}
      {showMemoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-card-bg) border-2 border-(--color-border-primary) rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-(--color-border-primary)">
              <h2 className="text-xl font-bold text-(--color-text-primary)">
                {editingMemoId ? "Edit Memo" : "New Memo"}
              </h2>
              <button
                onClick={() => {
                  setShowMemoModal(false);
                  setEditingMemoContent("");
                  setEditingMemoId(null);
                }}
                className="text-(--color-text-muted) hover:text-(--color-text-primary)"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <TextArea
                value={editingMemoContent}
                onChange={(e) => setEditingMemoContent(e.target.value)}
                placeholder="Write your memo here..."
                className="min-h-[300px] text-sm"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-(--color-border-primary)">
              <Button
                onClick={() => {
                  setShowMemoModal(false);
                  setEditingMemoContent("");
                  setEditingMemoId(null);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMemo}
                disabled={savingMemo || !editingMemoContent.trim()}
              >
                {savingMemo ? "Saving..." : "Save Memo"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom: AI Assistant */}
      {showAiAssistant && (
        <div className="h-[300px] border-t border-(--color-border-primary) bg-(--color-card-bg) flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border-primary)">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-(--color-accent-blue)" />
              <h3 className="text-(--color-text-primary) font-semibold text-sm">
                AI Assistant
              </h3>
            </div>
            <button
              onClick={() => setShowAiAssistant(false)}
              className="text-(--color-text-muted) hover:text-(--color-text-primary)"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiQuestions.length === 0 ? (
              <div className="flex items-center justify-center h-full text-(--color-text-muted)">
                <p className="text-sm">Select a part to ask AI</p>
              </div>
            ) : (
              aiQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  {/* Question */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-(--color-accent-blue) flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      U
                    </div>
                    <div className="flex-1 bg-(--color-input-bg) rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-(--color-text-light) text-xs font-medium">
                          You
                        </span>
                        <span className="text-(--color-text-muted) text-[10px]">
                          {new Date(q.timestamp).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-(--color-text-secondary) text-sm">
                        {q.question}
                      </p>
                      <div className="mt-2 px-2 py-1 bg-(--color-card-bg) rounded text-xs text-(--color-text-muted)">
                        Part: {q.partName}
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {q.isLoading ? (
                    <div className="flex items-start gap-2 ml-8">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-(--color-accent-blue) to-purple-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        AI
                      </div>
                      <div className="flex-1 bg-(--color-card-bg) border border-(--color-border-primary) rounded-lg p-3">
                        <p className="text-(--color-text-muted) text-sm animate-pulse">
                          Thinking...
                        </p>
                      </div>
                    </div>
                  ) : q.answer ? (
                    <div className="flex items-start gap-2 ml-8">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-(--color-accent-blue) to-purple-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        AI
                      </div>
                      <div className="flex-1 bg-(--color-card-bg) border border-(--color-border-primary) rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot
                            size={14}
                            className="text-(--color-accent-blue)"
                          />
                          <span className="text-(--color-text-light) text-xs font-medium">
                            SIMVEX AI
                          </span>
                        </div>
                        <p className="text-(--color-text-secondary) text-sm whitespace-pre-wrap leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            )}
            <div ref={aiEndRef} />
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowAiAssistant(!showAiAssistant)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-(--color-accent-blue) to-purple-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
        title="AI Assistant"
      >
        <MessageCircle size={24} />
        {connected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </button>
    </div>
  );
}
