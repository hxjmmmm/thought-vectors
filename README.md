# 思维向量

> 每个想法都是一个向量，在思维的空间里找到自己的方向。

[**thought-vectors.pages.dev**](https://thought-vectors.pages.dev)

AI 知识库与技术教程网站，从零开始系统学习人工智能。30 页内容，包含代码示例、数学公式和流程图。

## 内容结构

### 🎓 教程（5 阶段 18 篇）

| 阶段 | 内容 |
|------|------|
| 🧱 第一阶段 | Python 工具链、数学基础、机器学习概念 |
| ⚙️ 第二阶段 | 经典算法、线性回归、特征工程、模型评估 |
| 🧠 第三阶段 | 深度学习入门、CNN、RNN/LSTM |
| 🚀 第四阶段 | Transformer 架构、预训练模型、大模型原理 |
| 🛠 第五阶段 | Prompt Engineering、RAG、Agent、模型部署 |

### 📚 知识库（9 篇）

- **核心概念**：Attention、Embedding、Tokenization、KV Cache
- **模型族谱**：GPT/BERT/Llama 发展脉络
- **论文笔记**：Transformer、BERT、InstructGPT 解读
- **工具生态**：PyTorch、HuggingFace、LangChain
- **资源汇总**：课程、书籍、数据集

## 技术栈

- [Astro](https://astro.build) 7 + [Starlight](https://starlight.astro.build) 主题
- [Tailwind CSS](https://tailwindcss.com) v4
- [Three.js](https://threejs.org) 3D 知识星系
- [KaTeX](https://katex.org) 数学公式渲染
- [Mermaid](https://mermaid.js.org) 流程图
- 部署于 [Cloudflare Pages](https://pages.cloudflare.com)

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:4321`。

## 构建部署

```bash
npm run build   # 输出到 dist/
npm run preview # 本地预览构建结果
```

推送代码后 Cloudflare Pages 自动部署。

## 许可

MIT