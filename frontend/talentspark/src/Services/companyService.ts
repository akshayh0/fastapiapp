import axios from "axios";
import type { company } from "../types/company";
const API_BASE_URl ="http://localhost:8000";
export async function getCompanies():Promise<company[]>{
    const response = await axios.get(`${API_BASE_URl}/company`);
    return response.data;
}