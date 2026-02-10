const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
  projects?: Project[];
}

export interface TeamMember {
  userId: string;
  teamId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user?: User;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId?: string;
  creatorId: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
  team?: Team;
  creator?: User;
  members?: ProjectMember[];
}

export interface ProjectMember {
  userId: string;
  projectId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user?: User;
}

export interface Chat {
  id: string;
  teamId?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
}

export interface Memo {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

// API Client
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth APIs
  async register(data: { email: string; username: string; password: string }) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(userId: string, data: { oldPassword: string; newPassword: string }) {
    return this.request<{ message: string }>(`/auth/change-password/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Profile APIs
  async getProfile(userId: string) {
    return this.request<User>(`/profile/${userId}`);
  }

  async updateProfile(userId: string, data: Partial<User>) {
    return this.request<User>(`/profile/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Team APIs
  async createTeam(data: { name: string; description?: string; creatorId: string }) {
    return this.request<Team>('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTeams(userId: string) {
    return this.request<Team[]>(`/team/user/${userId}`);
  }

  async getTeam(teamId: string) {
    return this.request<Team>(`/team/${teamId}`);
  }

  async updateTeam(teamId: string, data: { name?: string; description?: string }) {
    return this.request<Team>(`/team/${teamId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTeam(teamId: string) {
    return this.request<{ message: string }>(`/team/${teamId}`, {
      method: 'DELETE',
    });
  }

  async addTeamMember(teamId: string, data: { userId: string; role?: string }) {
    return this.request<TeamMember>(`/team/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeamMemberRole(teamId: string, userId: string, data: { role: string }) {
    return this.request<TeamMember>(`/team/${teamId}/members/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeTeamMember(teamId: string, userId: string) {
    return this.request<{ message: string }>(`/team/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // Project APIs
  async createProject(data: { name: string; description?: string; teamId?: string; creatorId: string }) {
    return this.request<Project>('/project', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProjects(userId: string) {
    return this.request<Project[]>(`/project/user/${userId}`);
  }

  async getTeamProjects(teamId: string) {
    return this.request<Project[]>(`/project/team/${teamId}`);
  }

  async getProject(projectId: string) {
    return this.request<Project>(`/project/${projectId}`);
  }

  async updateProject(projectId: string, data: { name?: string; description?: string }) {
    return this.request<Project>(`/project/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(projectId: string) {
    return this.request<{ message: string }>(`/project/${projectId}`, {
      method: 'DELETE',
    });
  }

  async updateProjectAccess(projectId: string) {
    return this.request<Project>(`/project/${projectId}/access`, {
      method: 'PATCH',
    });
  }

  async addProjectMember(projectId: string, data: { userId: string; role?: string }) {
    return this.request<ProjectMember>(`/project/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProjectMemberRole(projectId: string, userId: string, data: { role: string }) {
    return this.request<ProjectMember>(`/project/${projectId}/members/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeProjectMember(projectId: string, userId: string) {
    return this.request<{ message: string }>(`/project/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // Chat APIs
  async createChat(data: { teamId?: string; projectId?: string }) {
    return this.request<Chat>('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTeamChats(teamId: string) {
    return this.request<Chat[]>(`/chat/team/${teamId}`);
  }

  async getProjectChats(projectId: string) {
    return this.request<Chat[]>(`/chat/project/${projectId}`);
  }

  async getChat(chatId: string) {
    return this.request<Chat>(`/chat/${chatId}`);
  }

  async deleteChat(chatId: string) {
    return this.request<{ message: string }>(`/chat/${chatId}`, {
      method: 'DELETE',
    });
  }

  async sendMessage(chatId: string, data: { senderId: string; content: string }) {
    return this.request<Message>(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(chatId: string) {
    return this.request<Message[]>(`/chat/${chatId}/messages`);
  }

  async updateMessage(messageId: string, data: { content: string }) {
    return this.request<Message>(`/chat/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMessage(messageId: string) {
    return this.request<{ message: string }>(`/chat/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Memo APIs
  async createMemo(data: { projectId: string; authorId: string; content: string }) {
    return this.request<Memo>('/memo', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProjectMemos(projectId: string) {
    return this.request<Memo[]>(`/memo/project/${projectId}`);
  }

  async getMemo(memoId: string) {
    return this.request<Memo>(`/memo/${memoId}`);
  }

  async updateMemo(memoId: string, data: { content: string }) {
    return this.request<Memo>(`/memo/${memoId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMemo(memoId: string) {
    return this.request<{ message: string }>(`/memo/${memoId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
