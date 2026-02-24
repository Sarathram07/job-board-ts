import type { Company } from "./companyType.ts";

export interface Job {
  __typename?: string;
  id: string;
  title: string;
  description?: string;
  company?: Company;
  date: string;
}

export interface JobSubList {
  __typename: string;
  totalCount: number;
  items: Job[];
}

export type GetAllJobsResponse = {
  jobs: JobSubList;
};

export type GetJobResponse = {
  job: Job;
};

export type JobInput = {
  title: string;
  description: string;
};


export type ParamType = {
  [key: string]: string;
};
