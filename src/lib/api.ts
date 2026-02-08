const API_BASE = "http://simvex-backend.dokploy.byeolki.me";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// ── Auth ──
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

// 백엔드 실제 응답 구조
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

// ── Profile ──
export interface Profile {
  id: string;
  nickname: string;
  aboutUs?: string;
  avatar?: string;
}

export const profile = {
  get: (userId: string) => request<Profile>(`/profile/${userId}`),
  update: (userId: string, data: Partial<Pick<Profile, 'nickname' | 'aboutUs' | 'avatar'>>) =>
    request<Profile>(`/profile/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ── Teams ──
export interface TeamMember {
  id: string;
  role: number;
  user: {
    id: string;
    email: string;
    nickname: string;
    personalId: string;
    avatar?: string;
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
  create: (name: string) =>
    request<Team>("/teams", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  update: (id: string, name: string) =>
    request<Team>(`/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  remove: (id: string) =>
    request<void>(`/teams/${id}`, { method: "DELETE" }),
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

// ── Projects ──
export interface ProjectMember {
  id: string;
  role: number;
  user: {
    id: string;
    email: string;
    nickname: string;
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
  listByTeam: (teamId: string) => request<Project[]>(`/projects/team/${teamId}`),
  get: (id: string) => request<Project>(`/projects/${id}`),
  create: (teamId: string, name: string) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({ teamId, name }),
    }),
  update: (id: string, name: string) =>
    request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),
  remove: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),
  updateMemberRole: (projectId: string, userId: string, role: number) =>
    request<void>(`/projects/${projectId}/members/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  removeMember: (projectId: string, userId: string) =>
    request<void>(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    }),
};
