import api from "./api"
import type { Job } from "../types/job"

export async function getJobs(): Promise<Job[]> {
    const response = await api.get("/job/")
    return response.data
}

export async function getJob(id: number): Promise<Job> {
    const response = await api.get(`/job/${id}`)
    return response.data
}

export async function createJob(job: Job): Promise<Job> {
    const response = await api.post("/job/", job)
    return response.data
}

export async function updateJob(id: number, job: Job): Promise<Job> {
    const response = await api.put(`/job/${id}`, job)
    return response.data
}

export async function deleteJob(id: number): Promise<void> {
    const response = await api.delete(`/job/${id}`)
    return response.data
}

export async function applyForJob(jobId: number): Promise<any> {
    const response = await api.post(`/job/${jobId}/apply`)
    return response.data
}

export async function getJobApplications(): Promise<any[]> {
    const response = await api.get("/job/applications")
    return response.data
}

export async function approveJobApplication(applicationId: number): Promise<any> {
    const response = await api.post(`/job/applications/${applicationId}/approve`)
    return response.data
}