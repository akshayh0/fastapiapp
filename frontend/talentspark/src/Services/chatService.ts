import axios from "axios";
import type { ChatRequest, ChatResponse } from "../types/chat";

const API_URL = "http://127.0.0.1:8000/chat";

export const sendMessage = async (
  data: ChatRequest
): Promise<ChatResponse> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};