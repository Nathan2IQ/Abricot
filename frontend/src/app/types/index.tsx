// Types pour les requêtes et réponses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Types pour le contexte d'authentification
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Types pour les tâches
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    description?: string;
  };
  assignees: Array<{
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
  comments?: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
  commentsCount?: number;
}

export interface AssignedTasksResponse {
  tasks: Task[];
}

// Types pour les projets
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userRole?: "ADMIN" | "CONTRIBUTOR" | null;
  owner: {
    id: string;
    email: string;
    name: string | null;
  };
  members: Array<{
    id: string;
    role: "ADMIN" | "CONTRIBUTOR";
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }>;
  _count?: {
    tasks: number;
    completedTasks: number;
  };
}
