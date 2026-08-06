import colors from "colors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`.bgBlue.black);
});
