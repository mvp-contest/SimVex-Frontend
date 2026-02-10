export const API_BASE = "http://simvex-backend.dokploy.byeolki.me";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (process.env.NODE_ENV === "development") {
    console.log("API Request:", {
      url: `${API_BASE}${path}`,
      method: options?.method || "GET",
      body: options?.body,
      hasToken: !!token,
    });
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      let body: { message?: string; error?: string; rawError?: string } = {};

      if (contentType?.includes("application/json")) {
        body = await res.json().catch(() => ({}));
      } else {
        const text = await res.text().catch(() => "");
        body = { rawError: text };
      }

      if (process.env.NODE_ENV === "development") {
        console.error("API Error Details:", {
          status: res.status,
          statusText: res.statusText,
          contentType,
          body,
          bodyString: JSON.stringify(body, null, 2),
          url: `${API_BASE}${path}`,
          requestBody: options?.body,
        });
      }

      const errorMessage =
        body.message ||
        body.error ||
        body.rawError ||
        `API error ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      if (process.env.NODE_ENV === "development") {
        console.error("Network Error:", {
          url: `${API_BASE}${path}`,
          error: error.message,
          suggestion:
            "Check if the backend server is running or verify network connection.",
        });
      }
      throw new Error(`Network connection failed: ${API_BASE}${path}`);
    }
    throw error;
  }
}

export interface RegisterBody {
  personalId: string;
  email: string;
  password: string;
  nickname: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  personalId: string;
  email: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    nickname: string;
    aboutUs?: string;
    avatar?: string;
  };
}

export const auth = {
  register: (body: RegisterBody) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: LoginBody) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export interface Profile {
  id: string;
  nickname: string;
  aboutUs?: string;
  avatar?: string;
}

export const profile = {
  get: (userId: string) => request<Profile>(`/profile/${userId}`),
  update: (
    userId: string,
    data: Partial<Pick<Profile, "nickname" | "aboutUs" | "avatar">>,
  ) =>
    request<Profile>(`/profile/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export interface TeamMember {
  id: string;
  role: number;
  user: {
    id: string;
    email: string;
    personalId: string;
    profile: {
      id: string;
      nickname: string;
      aboutUs?: string;
      avatar?: string;
    };
  };
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  inviteCode?: string;
  members: TeamMember[];
}

export const teams = {
  list: (userId: string) => request<Team[]>(`/teams/user/${userId}`),
  get: (id: string) => request<Team>(`/teams/${id}`),
  create: (name: string, creatorId: string) =>
    request<Team>("/teams", {
      method: "POST",
      body: JSON.stringify({ name, creatorId }),
    }),
  update: (id: string, name: string) =>
    request<Team>(`/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  remove: (id: string) => request<void>(`/teams/${id}`, { method: "DELETE" }),
  addMember: (teamId: string, userId: string, role: number) =>
    request<void>(`/teams/${teamId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    }),
  updateMemberRole: (teamId: string, userId: string, role: number) =>
    request<void>(`/teams/${teamId}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  removeMember: (teamId: string, userId: string) =>
    request<void>(`/teams/${teamId}/members/${userId}`, {
      method: "DELETE",
    }),
};

export interface ProjectMember {
  id: string;
  role: number;
  user: {
    id: string;
    email: string;
    personalId: string;
    profile: {
      id: string;
      nickname: string;
      aboutUs?: string;
      avatar?: string;
    };
  };
}

export interface Project {
  id: string;
  name: string;
  teamId: string;
  members: ProjectMember[];
}

export const projects = {
  list: (userId: string) => request<Project[]>(`/projects/user/${userId}`),
  listByTeam: (teamId: string) =>
    request<Project[]>(`/projects/team/${teamId}`),
  get: (id: string) => request<Project>(`/projects/${id}`),
  create: async (teamId: string, name: string, creatorId: string) => {
    const formData = new FormData();
    formData.append("teamId", teamId);
    formData.append("name", name);
    formData.append("creatorId", creatorId);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to create project" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  },
  update: (id: string, name: string) =>
    request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  remove: (id: string) =>
    request<void>(`/projects/${id}`, { method: "DELETE" }),
  addMember: (projectId: string, userId: string, role: number) =>
    request<void>(`/projects/${projectId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    }),
  updateMemberRole: (projectId: string, userId: string, role: number) =>
    request<void>(`/projects/${projectId}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  removeMember: (projectId: string, userId: string) =>
    request<void>(`/projects/${projectId}/members/${userId}`, {
      method: "DELETE",
    }),
  updateLastAccessed: (id: string) =>
    request<void>(`/projects/${id}/access`, {
      method: "PATCH",
    }),
  getNodeData: (projectId: string, nodeName: string) =>
    request<any>(`/projects/${projectId}/${nodeName}`),
  askNodeQuestion: (projectId: string, nodeName: string, content: string) =>
    request<any>(`/projects/${projectId}/${nodeName}/question`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  uploadFiles: async (projectId: string, glbFiles: File[]) => {
    const formData = new FormData();
    glbFiles.forEach((file) => {
      formData.append("glbFiles", file);
    });

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch(`${API_BASE}/projects/${projectId}/files`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to upload files" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  },
  getFiles: (projectId: string) =>
    request<{ id: string; name: string; files: string[] }>(
      `/projects/${projectId}/files`,
    ),
  getFileUrl: (projectId: string, fileName: string) =>
    `${API_BASE}/projects/${projectId}/files/${fileName}`,
};

export interface ChatMessageUser {
  id: string;
  personalId: string;
  profile: {
    id: string;
    nickname: string;
    aboutUs?: string;
    avatar?: string;
  };
}

export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  targetId?: string;
  editedAt?: string;
  deletedAt?: string;
  isDeleted?: boolean;
  user?: ChatMessageUser;
  targetMessage?: ChatMessage | null;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  teamId: string;
  projectId?: string;
  messages?: ChatMessage[];
  createdAt: string;
}

export const chats = {
  create: (teamId: string, projectId?: string) =>
    request<Chat>("/chats", {
      method: "POST",
      body: JSON.stringify({ teamId, projectId }),
    }),
  listByTeam: (teamId: string) => request<Chat[]>(`/chats/team/${teamId}`),
  listByProject: (projectId: string) =>
    request<Chat[]>(`/chats/project/${projectId}`),
  get: (id: string) => request<Chat>(`/chats/${id}`),
  remove: (id: string) => request<void>(`/chats/${id}`, { method: "DELETE" }),
  sendMessage: (
    chatId: string,
    userId: string,
    content: string,
    targetId?: string,
  ) =>
    request<ChatMessage>(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ userId, content, targetId }),
    }),
  getMessages: (chatId: string) =>
    request<ChatMessage[]>(`/chats/${chatId}/messages`),
  updateMessage: (messageId: string, content: string) =>
    request<ChatMessage>(`/chats/messages/${messageId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),
  deleteMessage: (messageId: string) =>
    request<void>(`/chats/messages/${messageId}`, { method: "DELETE" }),
};

export interface Memo {
  id: string;
  projectId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export const memos = {
  create: (projectId: string, content: string, author: string) =>
    request<Memo>("/memos", {
      method: "POST",
      body: JSON.stringify({ projectId, content, author }),
    }),
  listByProject: (projectId: string) =>
    request<Memo[]>(`/memos/project/${projectId}`),
  get: (id: string) => request<Memo>(`/memos/${id}`),
  update: (id: string, content: string) =>
    request<Memo>(`/memos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),
  remove: (id: string) => request<void>(`/memos/${id}`, { method: "DELETE" }),
};

export interface AiResponse {
  response: string;
}

export const ai = {
  askNode: (projectId: string, nodeName: string, content: string) =>
    request<AiResponse>(`/projects/${projectId}/${nodeName}/question`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};
