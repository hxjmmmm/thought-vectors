// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://ai-site.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    starlight({
      title: '思维向量',
      description: 'AI 知识库与技术教程 — 思想的高维空间',
      defaultLocale: 'zh-CN',
      customCss: ['./src/styles/global.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/hxjmmmm',
        },
      ],
      // 侧边栏
      sidebar: [
        {
          label: '🏠 开始',
          items: [
            { label: '首页', link: '/' },
            { label: '学习路线图', slug: 'roadmap' },
          ],
        },
        {
          label: '🎓 教程',
          collapsed: false,
          items: [
            {
              label: '🧱 第一阶段：打好基础',
              collapsed: true,
              items: [
                { label: 'Python 工具链', slug: 'tutorials/ml-basics' },
                { label: '数学基础', slug: 'tutorials/ml-basics/02-math-basics' },
                { label: '机器学习概念', slug: 'tutorials/ml-basics/03-ml-concepts' },
              ],
            },
            {
              label: '⚙️ 第二阶段：机器学习入门',
              collapsed: true,
              items: [
                { label: '经典算法', slug: 'tutorials/ml-basics/04-classic-algorithms' },
                { label: '线性回归与梯度下降', slug: 'tutorials/ml-basics/05-linear-regression' },
                { label: '特征工程', slug: 'tutorials/ml-basics/06-feature-engineering' },
                { label: '模型评估', slug: 'tutorials/ml-basics/07-model-evaluation' },
              ],
            },
            {
              label: '🧠 第三阶段：深度学习',
              collapsed: true,
              items: [{ autogenerate: { directory: 'tutorials/deep-learning' } }],
            },
            {
              label: '🚀 第四阶段：现代大模型',
              collapsed: true,
              items: [
                { label: 'Transformer 教程', slug: 'tutorials/transformer' },
                { label: '预训练模型', slug: 'tutorials/llm/pretrained-models' },
                { label: '大模型原理', slug: 'tutorials/llm' },
              ],
            },
            {
              label: '🛠 第五阶段：工程实践',
              collapsed: true,
              items: [
                { label: 'Prompt Engineering', slug: 'tutorials/prompt-engineering' },
                { label: 'RAG 与 Agent 开发', slug: 'tutorials/rag-agent' },
                { label: '模型部署', slug: 'tutorials/rag-agent/deployment' },
              ],
            },
          ],
        },
        {
          label: '📚 知识库',
          collapsed: false,
          items: [
            {
              label: '核心概念',
              items: [{ autogenerate: { directory: 'notes/concepts' } }],
            },
            {
              label: '模型族谱',
              items: [{ autogenerate: { directory: 'notes/models' } }],
            },
            {
              label: '工具生态',
              items: [{ autogenerate: { directory: 'notes/tools' } }],
            },
            {
              label: '论文笔记',
              items: [{ autogenerate: { directory: 'notes/papers' } }],
            },
            {
              label: '资源汇总',
              items: [{ autogenerate: { directory: 'notes/resources' } }],
            },
          ],
        },
      ],
      // 目录（右侧）
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      lastUpdated: true,
    }),
  ],
});