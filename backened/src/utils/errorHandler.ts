import { GraphQLError } from "graphql";

export const handleCompanyError = (data: any, id: string): void => {
  if (!data) {
    throw new GraphQLError(`No company found with id:${id}`, {
      extensions: {
        code: "NOT_FOUND",
      },
    });
  }
};

export const handleJobError = (data: any, id: string): void => {
  if (!data) {
    throw new GraphQLError(`No Job found with id:${id}`, {
      extensions: {
        code: "NOT_FOUND",
      },
    });
  }
};

export const handleAuthError = (msg: string): void => {
  throw new GraphQLError(msg, {
    extensions: {
      code: "UNAUTHORIZED",
    },
  });
};
