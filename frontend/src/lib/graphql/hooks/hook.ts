import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
//import { ApolloCache } from "@apollo/client";
//import { DocumentNode } from "graphql";

import { GET_COMPANY_BY_ID } from "../query/companyQuery.js";
import {
  CREATE_NEW_JOB,
  GET_ALL_JOBS,
  GET_JOB_BY_ID,
} from "../query/jobQuery.js";
import {
  CREATE_NEW_MESSAGE,
  GET_ALL_MESSAGES,
  MESSAGE_ADDED_SUBSCRIPTION,
} from "../query/messageQuery.js";

import type {
  GetAllJobsResponse,
  GetJobResponse,
  JobInput,
} from "../dataTypes/jobType.js";

import type { GetCompanyResponse } from "../dataTypes/companyType.js";

import type {
  GetAllMsgResponse,
  GetMsgResponse,
} from "../dataTypes/messageType.js";

// -------------------- COMPANY HOOK --------------------
export function useCompany(companyId: string) {
  const { data, loading, error } = useQuery<GetCompanyResponse>(
    GET_COMPANY_BY_ID,
    {
      variables: { id: companyId },
    },
  );

  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}

// -------------------- JOB HOOKS --------------------
export function useJob(jobId: string) {
  const { data, loading, error } = useQuery<GetJobResponse>(GET_JOB_BY_ID, {
    variables: { id: jobId },
  });

  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}

export function useAllJobs(limit: number, offset: number) {
  const { data, loading, error } = useQuery<GetAllJobsResponse>(GET_ALL_JOBS, {
    variables: { limit, offset },
    fetchPolicy: "network-only",
  });

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}

export function useCreateJob() {
  const [createJobMutation, result] =
    useMutation<GetJobResponse>(CREATE_NEW_JOB);
  const { loading, error } = result;

  const createNewJob = async ({ title, description }: JobInput) => {
    const body = { data: { title, description } };

    const response = await createJobMutation({
      variables: body,
      update: (cache, { data }) => {
        if (!data) return;
        cache.writeQuery({
          query: GET_JOB_BY_ID,
          variables: { id: data.job.id },
          data,
        });
      },
    });

    return response.data?.job;
  };

  return { createNewJob, loading, error };
}

// -------------------- MESSAGE HOOKS --------------------
export function useMessages() {
  const { data } = useQuery<GetAllMsgResponse>(GET_ALL_MESSAGES);

  useSubscription<any>(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: ({ client, data: result }) => {
      const newMessage = result.data?.message;
      if (!newMessage) return;

      client.cache.updateQuery<any>({ query: GET_ALL_MESSAGES }, (oldData) => {
        return { messages: [...(oldData?.messages ?? []), newMessage] };
      });
    },
  });

  return {
    messages: data?.messages ?? [],
  };
}

export function useAddMessage() {
  const [newMessageMutation] = useMutation<GetMsgResponse>(CREATE_NEW_MESSAGE);

  const addMessage = async (text: string) => {
    const response = await newMessageMutation({
      variables: { text },
      // update: (cache, { data }) => {
      //   const msg = data.message;
      //   cache.updateQuery({ query: GET_ALL_MESSAGES }, (oldData) => {
      //     return { messages: [...oldData.messages, msg] };
      //   });
      // },
    });
    return response.data?.message;
  };

  return { addMessage };
}
