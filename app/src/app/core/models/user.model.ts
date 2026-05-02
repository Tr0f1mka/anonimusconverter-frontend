export interface User {
    id: string;
    name: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    jwtToken: string | null;
}

export interface LoginResponse {
    userId: string;
    username: string;
    email: string;
    jwtToken: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface BackendAuthResponse {
    id: string;
    username: string;
    email: string;
    jwtToken: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}