import type {LoginRequest,LoginResponse,RegisterRequest,RegisterResponse} from "../types/user";
import axios from "axios";
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

