// // import { useMutation, useQuery, useSubscription, ApolloCache } from "@apollo/client/react";
// // import { DocumentNode } from "graphql";

// // import { GET_COMPANY_BY_ID } from "../query/companyQuery.js";
// // import {
// //   CREATE_NEW_JOB,
// //   GET_ALL_JOBS,
// //   GET_JOB_BY_ID,
// // } from "../query/jobQuery.js";
// // import {
// //   CREATE_NEW_MESSAGE,
// //   GET_ALL_MESSAGES,
// //   MESSAGE_ADDED_SUBSCRIPTION,
// // } from "../query/messageQuery.js";

// // -------------------- Type Definitions --------------------
// interface Company {
//   id: string;
//   name: string;
//   // add other fields as needed
// }

// interface Job {
//   id: string;
//   title: string;
//   description: string;
//   // add other fields as needed
// }

// interface Message {
//   id: string;
//   text: string;
//   // add other fields as needed
// }

// // -------------------- COMPANY HOOK --------------------
// export function useCompany(companyId: string) {
//   const { data, loading, error } = useQuery<{ company: Company }>(GET_COMPANY_BY_ID, {
//     variables: { id: companyId },
//   });

//   return {
//     company: data?.company,
//     loading,
//     error: Boolean(error),
//   };
// }

// // -------------------- JOB HOOKS --------------------
// export function useJob(jobId: string) {
//   const { data, loading, error } = useQuery<{ job: Job }>(GET_JOB_BY_ID, {
//     variables: { id: jobId },
//   });

//   return {
//     job: data?.job,
//     loading,
//     error: Boolean(error),
//   };
// }

// export function useAllJobs(limit: number, offset: number) {
//   const { data, loading, error } = useQuery<{ jobs: Job[] }>(GET_ALL_JOBS, {
//     variables: { limit, offset },
//     fetchPolicy: "network-only",
//   });

//   return {
//     jobs: data?.jobs ?? [],
//     loading,
//     error: Boolean(error),
//   };
// }

// export function useCreateJob() {
//   const [createJobMutation, result] = useMutation<{ job: Job }, { data: { title: string; description: string } }>(
//     CREATE_NEW_JOB
//   );
//   const { loading, error } = result;

//   const createNewJob = async ({ title, description }: { title: string; description: string }) => {
//     const body = { data: { title, description } };

//     const response = await createJobMutation({
//       variables: body,
//       update: (cache: ApolloCache<any>, { data }) => {
//         if (!data) return;
//         cache.writeQuery({
//           query: GET_JOB_BY_ID,
//           variables: { id: data.job.id },
//           data,
//         });
//       },
//     });

//     return response.data?.job;
//   };

//   return { createNewJob, loading, error };
// }

// // -------------------- MESSAGE HOOKS --------------------
// export function useMessages() {
//   const { data } = useQuery<{ messages: Message[] }>(GET_ALL_MESSAGES);

//   useSubscription<{ message: Message }>(MESSAGE_ADDED_SUBSCRIPTION, {
//     onData: ({ client, data: result }) => {
//       const newMessage = result.data?.message;
//       if (!newMessage) return;

//       client.cache.updateQuery<{ messages: Message[] }>({ query: GET_ALL_MESSAGES }, (oldData) => {
//         return { messages: [...(oldData?.messages ?? []), newMessage] };
//       });
//     },
//   });

//   return {
//     messages: data?.messages ?? [],
//   };
// }

// export function useAddMessage() {
//   const [newMessageMutation] = useMutation<{ message: Message }, { text: string }>(CREATE_NEW_MESSAGE);

//   const addMessage = async (text: string) => {
//     const response = await newMessageMutation({ variables: { text } });
//     return response.data?.message;
//   };

//   return { addMessage };
// }
