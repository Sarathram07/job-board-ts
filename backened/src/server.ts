import "./connection/propertyConfig.ts";
import { connectDataBase } from "./connection/conn.ts";
import { httpServer as mainServer } from "./app.ts";
import { Server } from "http"; // Node.js type for the server

// Connect to the database
connectDataBase();

// Start the server
const port: string | undefined = process.env.PORT;
const env: string | undefined = process.env.NODE_ENV;

if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

const server: Server = mainServer.listen(port, () => {
  console.log(`Server listening to the port: ${port} in ${env}`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
  console.log(
    "--------------------------------------------------------------------------",
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.log(`Error: ${err?.message}`);
  console.log("Shutting down the server due to unhandled rejection error");
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: any) => {
  console.log(`Error: ${err?.message}`);
  console.log("Shutting down the server due to uncaught exception error");
  server.close(() => {
    process.exit(1);
  });
});
