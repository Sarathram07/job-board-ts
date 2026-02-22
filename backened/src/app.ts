// -----------------------------------------------------IMPORTS---------------------------------------------------------------
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { readFile } from "fs/promises";
import { WebSocketServer } from "ws";
import { createServer as createHttpServer, Server as HttpServer } from "http";
//import { useServer as useWsServer } from "graphql-ws";
import { useServer as useWsServer } from "graphql-ws/use/ws";
//import type { Server as GQLWebSocketServer } from "graphql-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { resolvers } from "./graphApi/resolvers.ts";
import {
  authMiddleware,
  decodeTokenForWebSocket,
  handleLogin,
} from "./middleware/authentication.ts";
import { getUserById } from "./controllers/UserController.ts";
import { createCompanyLoader } from "./controllers/CompanyController.ts";

// -----------------------------------------------------EXPRESS_CONFIG---------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "backend_config.env"),
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(authMiddleware);

app.use("/login", handleLogin);

// -----------------------------------------------------APOLLO_SERVER---------------------------------------------------------------
const typeDefs = await readFile("./graphApi/schema.graphql", "utf-8");

interface Context {
  user?: any;
  companyLoader: ReturnType<typeof createCompanyLoader>;
}

async function getContext({
  req,
  res,
}: {
  req: Request & { auth?: any };
  res: Response;
}): Promise<Context> {
  const companyLoader = createCompanyLoader();
  const context: Context = { companyLoader };
  if (req.auth) {
    context.user = await getUserById(req.auth.sub);
  }
  return context;
}

const apolloServer = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));

// -----------------------------------------------------WEBSOCKET_CONFIG-----------------------------------------------------------
interface WsContext {
  //user?: string;
  user?: any;
}

async function getWsContext(connInfo: any): Promise<WsContext> {
  const { connectionParams } = connInfo;
  const accessToken = connectionParams?.accessToken;
  if (accessToken) {
    const payload = decodeTokenForWebSocket(accessToken);
    return { user: payload.sub };
  }
  return {};
}

const httpServer: HttpServer = createHttpServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });

const schemaForWebSocket = makeExecutableSchema({ typeDefs, resolvers });
const configurationProperty = {
  schema: schemaForWebSocket,
  context: getWsContext,
};

useWsServer(configurationProperty, wsServer);

export { app, httpServer, wsServer };
