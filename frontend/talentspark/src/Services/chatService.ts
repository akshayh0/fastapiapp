import axios from "axios";
import type { ChatRequest, ChatResponse } from "../types/chat";

const API_URL = import.meta.env.VITE_API_URL;

export const sendMessage = async (
  data: ChatRequest
): Promise<ChatResponse> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};