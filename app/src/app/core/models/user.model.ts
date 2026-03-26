export interface User {
    id: string;
    name: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface BackendAuthResponse {
    userId: string;
    username: string;
    email: string;
    token: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}