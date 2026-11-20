export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}
