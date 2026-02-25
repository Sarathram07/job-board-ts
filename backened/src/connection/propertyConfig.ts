import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Moving up one level to /backend/src
const rootDir = path.join(__dirname, "..");

dotenv.config({
  path: path.join(rootDir, "backend_config.env"),
});

console.log(process.env.DB_LOCAL_URL);
