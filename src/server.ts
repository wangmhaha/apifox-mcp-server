/*
 * @Descripttion:
 * @version:
 * @Author: wangmin
 * @Date: 2025-03-20 17:49:38
 * @LastEditors: wangmin
 * @LastEditTime: 2025-04-03 14:30:44
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { IncomingMessage, ServerResponse } from "http";
import express from "express";
import { Response, Request } from "express-serve-static-core";
import { z } from "zod";

export class ApiFoxServer {
  private readonly server: McpServer;
  private sseTransport: SSEServerTransport | null = null;

  constructor(apifoxApiKey: string, projectId: string) {
    this.server = new McpServer({
      name: "ApiFox MCP Server",
      version: "1.0.0",
      capabilities: {
        notifications: true,
      },
    });

    this.registerTools(apifoxApiKey, projectId);
  }

  // 注册工具
  private registerTools(key: string, projectId: string): void {
    this.server.tool(
      "get-interface",
      "获取apiFox接口信息",
      {
        moduleId: z.string().describe("要查询模块id"),
        moduleName: z.string().describe("要查询模块名称"),
      },
      async (args: { moduleId: string; moduleName?: string }) => {
        try {
          const response = await fetch(
            `https://api.apifox.com/v1/projects/${projectId}/export-openapi`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${key}`,
                "X-Apifox-Api-Version": "2024-03-28",
              },
              body: JSON.stringify({
                scope: {
                  type: "SELECTED_FOLDERS",
                  selectedFolderIds: [args.moduleId],
                  excludedByTags: ["pet"],
                },
                options: {
                  includeApifoxExtensionProperties: false,
                  addFoldersToTags: true,
                },
                oasVersion: "3.1",
                exportFormat: "JSON",
              }),
            }
          );

          // 检查响应状态
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // 解析响应数据
          const data = await response.json();

          if (!data) {
            return {
              content: [
                {
                  type: "text",
                  text: `无法找到${args.moduleName}的接口信息`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `基于openapi3.1.0的规范，${
                  args.moduleName
                }的接口信息如下: ${JSON.stringify(data)}`,
              },
            ],
          };
        } catch (error) {
          console.error("获取接口信息失败:", error);
          return {
            content: [
              {
                type: "text",
                text: `获取接口信息失败: ${error}`,
              },
            ],
          };
        }
      }
    );
  }

  async connect(transport: Transport): Promise<void> {
    await this.server.connect(transport);
    console.log("服务器已连接并准备处理请求");
  }

  async startHttpServer(port: number): Promise<void> {
    const app = express();

    app.get("/sse", async (req: Request, res: Response) => {
      console.log("SSE连接建立");
      this.sseTransport = new SSEServerTransport(
        "/messages",
        res as unknown as ServerResponse<IncomingMessage>
      );
      await this.connect(this.sseTransport);
    });

    app.post("/messages", async (req: Request, res: Response) => {
      if (!this.sseTransport) {
        res.status(400).send();
        return;
      }
      await this.sseTransport.handlePostMessage(
        req as unknown as IncomingMessage,
        res as unknown as ServerResponse<IncomingMessage>
      );
    });

    app.listen(port, () => {
      console.log(`HTTP服务器监听端口 ${port}`);
      console.log(`SSE 端点可用于 http://localhost:${port}/sse`);
      console.log(
        `消息端点可在以下位置访问： http://localhost:${port}/messages`
      );
    });
  }
}
