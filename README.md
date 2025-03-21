<!--
 * @Descripttion:
 * @version:
 * @Author: wangmin
 * @Date: 2025-03-20 14:39:11
 * @LastEditors: wangmin
 * @LastEditTime: 2025-03-21 14:13:40
-->

# ApiFox MCP Server

这是一个基于 Model Context Protocol (MCP) 的 ApiFox 接口服务器，用于获取和管理 ApiFox 的接口信息。

## 功能特点

- 支持通过 MCP 协议获取 ApiFox 接口信息
- 提供 HTTP 服务和 CLI 命令行两种使用方式
- 使用 TypeScript 开发，提供类型安全
- 支持环境变量配置

## 快速安装使用

```javascript

npx @wangmhaha/apifox-mcp-server --apifox-api-key=<your-apifox-api-key> --project=<your-project-id>

```

### 配置 cursor 通过 sse 连接到 MCP 服务器

服务器将在配置的端口上启动（默认 3000）。

```javascript
"apifox-mcp-server": {
    "url": "http://localhost:3000/sse",
  }
```

### 或则使用配置文件 JSON 配置

可以通过在 cursor mcp 配置文件中添加以下内容来配置 apifox-mcp-server 服务器：

```javascript
 "apifox-mcp-server": {
    "command": "npx",
    "args": ["-y", "@wangmhaha/apifox-mcp-server", "--local"],
    "env": {
      "APIFOX_API_KEY": "<your-apifox-api-key>",
      "PROJECT_ID": "<your-project-id>"
    }
  }
```

## 或者从本地源运行

拉取代码安装依赖

```bash
pnpm install
```

打包

```bash
pnpm build
```

运行

```bash
pnpm start:http
```

配置：

```javascript
"apifox-mcp-server": {
    "url": "http://localhost:3000/sse",
    "env": {
      "APIFOX_API_KEY": "<your-apifox-api-key>",
      "PROJECT_ID": "<your-project-id>"
    }
  }
```

也可通过 command 模式运行

```javascript
"apifox-mcp-server": {
    "command": "node",
    "args": [
      "<you-local-path>/build/index.js",
      "--local",
    ],
    "env": {
      "APIFOX_API_KEY": "<your-apifox-api-key>",
      "PROJECT_ID": "<your-project-id>"
    }
  },
```

## 如在不在 MCP 配置文件中配置 env 环境变量，请在本地环境变量配置

在项目根目录下修改`.evn.example` 文件为`.env` 文件，配置以下环境变量：

```env
APIFOX_API_KEY=your_api_key_here
PROJECT_ID=your_project-ID
PORT=3000  # 可选，默认为 3000
```

## 技术栈

- Node.js
- TypeScript
- Express.js
- Model Context Protocol SDK
- Zod（数据验证）

## 许可证

ISC License
