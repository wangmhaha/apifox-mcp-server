/*
 * @Descripttion:
 * @version:
 * @Author: wangmin
 * @Date: 2025-03-20 17:26:55
 * @LastEditors: wangmin
 * @LastEditTime: 2025-03-21 09:16:43
 */
import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

config();

interface ServerConfig {
  port: number;
  apifoxApiKey: string;
  projectId: string;
}

interface CliArgs {
  "apifox-api-key"?: string;
  port?: number;
  "project-id"?: string;
}

export function getServerConfig(): ServerConfig {
  const argv = yargs(hideBin(process.argv))
    .options({
      "apifox-api-key": {
        type: "string",
        describe: "apifox api key",
      },
      "project-id": {
        type: "string",
        describe: "apifox project id",
      },
      port: {
        type: "number",
        describe: "Prot to run the server on",
      },
    })
    .help()
    .parseSync() as CliArgs;

  const config: ServerConfig = {
    apifoxApiKey: "",
    projectId: "",
    port: 3000,
  };

  if (argv["apifox-api-key"]) {
    config.apifoxApiKey = argv["apifox-api-key"];
  } else if (process.env.APIFOX_API_KEY) {
    config.apifoxApiKey = process.env.APIFOX_API_KEY;
  }

  if (argv["project-id"]) {
    config.projectId = argv["project-id"];
  } else if (process.env.PROJECT_ID) {
    config.projectId = process.env.PROJECT_ID;
  }

  if (argv.port) {
    config.port = argv.port;
  } else if (process.env.PORT) {
    config.port = parseInt(process.env.PORT, 10);
  }

  if (!config.apifoxApiKey) {
    console.error("请提供 apifox api key");
    process.exit(1);
  }

  if (!config.projectId) {
    console.error("请提供 apifox project id");
    process.exit(1);
  }

  return config;
}
