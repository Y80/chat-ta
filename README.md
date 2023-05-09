<div align="center">
 <img src="src/assets/images/bot-no-bg.png">
</div>

<div align="center" height="100">
Chat Ta，一款跨平台 Chat GPT 客户端。  
</div>


## 🌟 特性
- 跨平台
- 持久化本地保存对话记录
- 使用个人 API Key
- 配置 API Host 代理、Chat Model、对话风格
- 让 AI 理解上下文，并且可配置上下文消息数
- 指定 AI 人格，让 TA 成为编程大师、郭德纲、猫娘然后与你交流
- 更多功能持续开发中...

## 🔧 技术栈
- TAURI
- Vite
- React
- React Router
- ahooks
- TailwindCSS

## 🧑‍💻 本地开发

开始前，请确保本地已经安装 Node.js、Rust。Node.js 包管理工具推荐使用 pnpm。

1. 拉取代码
```bash
git clone git@github.com:y80/chat-ta.git
```

2. 安装依赖
```bash
pnpm i
```

3. 启动项目
```bash
pnpm dev
```

## 其他
用户配置文件、对话记录都保存在本地 **$APP_DATA/Chat Ta** 目录下。
