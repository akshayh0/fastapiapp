import axios from "axios";
import type { Company } from "../types/company";
const API_BASE_URl ="http://localhost:8000";

export async function getCompanies():Promise<Company[]>{
    const response = await axios.get(`${API_BASE_URl}/company`);
    return response.data
}

export async function getCompanyById(id:number):Promise<Company>{
    const response = await axios.get(`${API_BASE_URl}/company/${id}`);
    return response.data
}

export async function createCompany(company:Company):Promise<Company>{
    const response = await axios.post(`${API_BASE_URl}/company`,company);
    return response.data
}

export async function updateCompany(id:number,company:Company):Promise<Company>{
    const response = await axios.put(`${API_BASE_URl}/company/${id}`,company);
    return response.data
}

export async function deleteCompany(id:number):Promise<void>{
    const response = await axios.delete(`${API_BASE_URl}/company/${id}`);
    return response.data;
}