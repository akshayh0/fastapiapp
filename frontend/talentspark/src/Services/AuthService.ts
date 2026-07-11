import type {LoginRequest,LoginResponse,RegisterRequest,RegisterResponse} from "../types/user";
import axios from "axios";
import api from "./api";
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials:LoginRequest):Promise<LoginResponse>=>{
    // Backend expects OAuth2PasswordRequestForm (form-encoded with "username" field)
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    return response.data;
}

export const register = async (user:RegisterRequest):Promise<RegisterResponse>=>{
    const response = await axios.post<RegisterResponse>(`${API_URL}/auth/register`,user);
    return response.data;
}

export const forgotPassword = async (email: string): Promise<{ message: string; reset_token?: string; reset_link?: string }> => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, new_password: newPassword });
    return response.data;
};

export const getCurrentUser = async (): Promise<any> => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const getPendingUsers = async (): Promise<any[]> => {
    const response = await api.get("/auth/pending-users");
    return response.data;
};

export const approveUser = async (userId: number): Promise<any> => {
    const response = await api.post(`/auth/approve-user/${userId}`);
    return response.data;
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<any> => {
    const response = await api.post("/auth/change-password", { old_password: oldPassword, new_password: newPassword });
    return response.data;
};

export const resetPasswordDirect = async (name: string, email: string, newPassword: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/auth/reset-password-direct`, { name, email, new_password: newPassword });
    return response.data;
};



