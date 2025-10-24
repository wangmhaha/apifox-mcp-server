/*
 * @Descripttion:
 * @version:
 * @Author: wangmin
 * @Date: 2025-03-20 14:39:11
 * @LastEditors: wangmin
 * @LastEditTime: 2025-04-03 09:33:34
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getServerConfig } from "./config.js";
import { ApiFoxServer } from "./server.js";
// // 创建 MCP 服务器

// 启动服务器
export async function startServer(): Promise<void> {
  const isLocalMode =
    process.env.NODE_ENV === "cli" || process.argv.includes("--local");
  const config = getServerConfig();

  const server = new ApiFoxServer(config.apifoxApiKey, config.projectId);

  if (isLocalMode) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    console.error(
      `初始化HTTP模式下的ApiFox MCP Server服务器在端口 ${config.port}`
    );
    await server.startHttpServer(config.port);
  }
}

startServer().catch((error) => {
  console.error("启动接口信息服务器失败:", error);
  process.exit(1);
});
