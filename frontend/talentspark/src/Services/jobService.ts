import axios from "axios";
import type { Job } from "../types/job";
const API_BASE_URl ="http://localhost:8000";
export async function getJobs():Promise<Job[]>{
    const response = await axios.get(`${API_BASE_URl}/job`);
    return response.data
}

export async function getJobById(id:number):Promise<Job>{
    const response = await axios.get(`${API_BASE_URl}/job/${id}`);
    return response.data
}

export async function createJob(job:Job):Promise<Job>{
    const response = await axios.post(`${API_BASE_URl}/job`,job);
    return response.data
}

export async function updateJob(id:number,job:Job):Promise<Job>{
    const response = await axios.put(`${API_BASE_URl}/job/${id}`,job);
    return response.data
}

export async function deleteJob(id:number):Promise<SecurityPolicyViolationEventDisposition>{
    const response = await axios.delete(`${API_BASE_URl}/job/${id}`);
    return response.data
}