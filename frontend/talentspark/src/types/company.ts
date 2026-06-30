import type { job } from './job';

interface company{
    id:number;
    name:string;
    email:string;
    phone:string;
    location:string;
    jobs:job[];
}
export type {company}