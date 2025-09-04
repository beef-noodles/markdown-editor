<div align="center">
  <h1><code>markdown-editor</code></h1>
  <strong>一个基于 Rust + WASM + React + Vite + Tailwind v4 + shadcn/ui + Monaco Editor 的现代 Markdown 编辑器</strong>
  <br />
  <img src="https://img.shields.io/badge/wasm-bindgen-blue" alt="wasm-bindgen" />
  <img src="https://img.shields.io/badge/tailwindcss-v4-blue" alt="tailwindcss v4" />
  <img src="https://img.shields.io/badge/monaco--editor-0.52.2-blue" alt="monaco-editor" />
  <img src="https://img.shields.io/badge/shadcn--ui-3.1.0-blue" alt="shadcn-ui" />
</div>

## 项目简介

本项目是一个现代化的 Markdown 编辑器，支持实时预览、WASM 高性能渲染、邮件一键复制、丰富的样式和交互体验。

**主要技术栈：**
- Rust + wasm-bindgen + wasm-pack：核心 Markdown 渲染逻辑，极致性能
- React 19 + Vite 7：现代前端开发体验
- Tailwind CSS v4 + shadcn/ui：美观、可定制的 UI 体系
- Monaco Editor：专业级代码/Markdown 编辑体验

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm run dev
```

### 构建 WASM 包

```bash
pnpm run build:lib
```

### 生产环境构建

```bash
pnpm run build
```

### 预览生产环境

```bash
pnpm run preview
```

## 主要特性

- Markdown 实时编辑与预览，支持表格、任务列表、脚注等扩展
- Rust + WASM 高性能渲染，极致流畅
- 一键复制渲染结果到邮件，样式保持一致
- 支持 Tailwind v4 + shadcn/ui 主题美化
- Monaco Editor 编辑体验
- 代码高亮、表格、引用、列表等丰富 Markdown 语法

## 目录结构

```
├── app/                # 前端 React 代码
│   ├── components/     # 组件，包括 MarkdownEditor、MarkdownPreview 等
│   ├── App.tsx         # 应用入口
│   └── ...
├── src/                # Rust 源码，核心 Markdown 渲染逻辑
├── pkg/                # wasm-pack 生成的 WASM 包
├── public/             # 静态资源
├── tailwind.config.ts  # Tailwind 配置
├── package.json        # 项目依赖与脚本
└── ...
```

## 许可证

Apache License, Version 2.0 或 MIT License，任选其一。

---

如需二次开发或集成，欢迎提 issue 或 PR！
