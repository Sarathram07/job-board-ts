import type { Job } from "./jobType";

export interface Company {
  __typename: string;
  id: string;
  name: string;
  description?: string;
  jobs?: Job[];
}

export type GetCompanyResponse = {
  company: Company;
};

export type ParamType = {
  [key: string]: string;
};
