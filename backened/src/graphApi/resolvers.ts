import { PubSub } from "graphql-subscriptions";
import type { IResolvers } from "@graphql-tools/utils";

import {
  getCompanyByID,
} from "../controllers/CompanyController.js";

import {
  createJob,
  deleteJobByID,
  getAllJobById,
  getJobById,
  getJobs,
  getTotalJobCount,
  updateJobByID,
} from "../controllers/JobController.js";

import {
  createMessage,
  getAllMessages,
} from "../controllers/MessageController.js";

import { extractDate } from "../utils/convertion.js";

import {
  handleAuthError,
  handleCompanyError,
  handleJobError,
} from "../utils/errorHandler.ts";

/* ================================
   Types
================================ */

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

/* -------- Args Types -------- */

interface JobsArgs {
  limit?: number;
  offset?: number;
}

interface JobArgs {
  id: string;
}

interface CompanyArgs {
  id: string;
}

interface CreateJobInput {
  title: string;
  description: string;
}

interface UpdateJobInput {
  id: string;
  title: string;
  description: string;
}

/* ================================
   PubSub
================================ */

const pubSub = new PubSub();

/* ================================
   Resolvers
================================ */

export const resolvers: IResolvers<
  unknown,
  GraphQLContext
> = {
  Job: {
    date: (job: { createdAt: string }): string =>
      extractDate(job.createdAt),

    company: (
      job: { companyId: string },
      _args,
      { companyLoader }
    ) => {
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
    createJob: (
      _root,
      { input }: { input: CreateJobInput },
      context
    ) => {
      const user = requireAuth(context);
      const { title, description } = input;

      return createJob({
        companyId: user.companyId,
        title,
        description,
      });
    },

    addMessage: async (
      _root,
      { text }: { text: string },
      { user }
    ) => {
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

    updateJob: (
      _root,
      { input }: { input: UpdateJobInput },
      context
    ) => {
      const user = requireAuth(context);
      const { id, title, description } = input;

      return updateJobByID(
        id,
        user.companyId,
        title,
        description
      );
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: (_root, _args, context) => {
        requireAuth(context);

        return pubSub.asyncIterableIterator(
          "NEW_MESSAGE_ADDED"
        );
      },
    },
  },
};

/* ================================
   Auth Helper
================================ */

const requireAuth = (
  context: GraphQLContext
): User => {
  if (!context?.user) {
    handleAuthError("Un-authorized Access");
  }

  return context.user!;
};