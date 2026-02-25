import { PubSub } from "graphql-subscriptions";
import type { IResolvers } from "@graphql-tools/utils";

import { getCompanyByID } from "../controllers/CompanyController.ts";

import {
  createJob,
  deleteJobByID,
  getAllJobById,
  getJobById,
  getJobs,
  getTotalJobCount,
  updateJobByID,
} from "../controllers/JobController.ts";

import {
  createMessage,
  getAllMessages,
} from "../controllers/MessageController.ts";

import { extractDate } from "../utils/convertion.js";

import {
  handleAuthError,
  handleCompanyError,
  handleJobError,
} from "../utils/errorHandler.ts";

interface User {
  id: string;
  companyId: string;
  email?: string;
}

interface GraphQLContext {
  user?: User;
  companyLoader: {
    load: (id: string) => Promise<any>;
  };
}

// interface ArgsMap {
//   jobs: JobsArgs;
//   job: JobArgs;
// }

type JobsArgs = {
  limit?: number;
  offset?: number;
};

type JobArgs = {
  id: string;
};

type CompanyArgs = {
  id: string;
};

type CreateJobInput = {
  title: string;
  description: string;
};

type UpdateJobInput = {
  id: string;
  title: string;
  description: string;
};
// --------------------------------------------------------------------------------------------------------------------------

const pubSub = new PubSub();

//IResolvers<TRoot, TContext, TArgs = any>
// TRoot → type of the parent/root object of the resolver (what _root refers to).
// TContext → type of the GraphQL context object passed to every resolver.
// TArgs → type of the args object that the resolver receives for that field.

//TRoot = unknown → _root can be anything.
// This is often used when you don’t care about the parent object type (or want to type it individually for each resolver).
//TArgs - didn’t specify, so it defaults to any. That’s why: we can explicitly type/provide args for each resolver

//const resolvers: IResolvers<unknown, GraphQLContext, MyArgsMap>
// _args is {} because the GraphQL schema does not define any arguments for date or company.
export const resolvers: IResolvers<unknown, GraphQLContext> = {
  Job: {
    date: (job: { createdAt: Date }): string => extractDate(job.createdAt),

    company: (job: { companyId: string }, _args, { companyLoader }) => {
      return companyLoader.load(job.companyId);
    },
  },

  Company: {
    jobs: (comp: { id: string }) => {
      return getAllJobById(comp.id);
    },
  },

  Query: {
    jobs: (_root, args: JobsArgs) => {
      const { limit, offset } = args;

      const totalCount = getTotalJobCount();
      const items = getJobs(limit, offset);

      return { items, totalCount };
    },

    job: async (_root, { id }: JobArgs) => {
      const jobFromDB = await getJobById(id);

      if (!jobFromDB) {
        handleJobError(jobFromDB, id);
      }

      return jobFromDB;
    },

    company: async (_root, { id }: CompanyArgs) => {
      const companyFromDB = await getCompanyByID(id);

      if (!companyFromDB) {
        handleCompanyError(companyFromDB, id);
      }

      return companyFromDB;
    },

    messages: async (_root, _args, context) => {
      requireAuth(context);
      return getAllMessages();
    },
  },

  Mutation: {
    createJob: (_root, { input }: { input: CreateJobInput }, context) => {
      const user = requireAuth(context);
      const { title, description } = input;

      return createJob({
        companyId: user.companyId,
        title,
        description,
      });
    },

    addMessage: async (_root, { text }: { text: string }, { user }) => {
      if (!user) {
        handleAuthError("Un-authorized Access");
      }

      const message = await createMessage(user, text);

      await pubSub.publish("NEW_MESSAGE_ADDED", {
        messageAdded: message,
      });

      return message;
    },

    deleteJob: (_root, { id }: JobArgs, context) => {
      const user = requireAuth(context);

      return deleteJobByID(id, user.companyId);
    },

    updateJob: (_root, { input }: { input: UpdateJobInput }, context) => {
      const user = requireAuth(context);
      const { id, title, description } = input;

      return updateJobByID(id, user.companyId, title, description);
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: (_root, _args, context) => {
        requireAuth(context);

        return pubSub.asyncIterableIterator("NEW_MESSAGE_ADDED");
      },
    },
  },
};

// --------------------------------------------------------------------------------------------------------------------------

const requireAuth = (context: GraphQLContext): User => {
  if (!context?.user) {
    handleAuthError("Un-authorized Access");
  }

  return context.user!;
};
