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
              label: '机器学习基础',
              collapsed: true,
              items: [{ autogenerate: { directory: 'tutorials/ml-basics' } }],
            },
            {
              label: '深度学习入门',
              collapsed: true,
              items: [{ autogenerate: { directory: 'tutorials/deep-learning' } }],
            },
            {
              label: 'Transformer 与注意力机制',
              collapsed: true,
              items: [{ autogenerate: { directory: 'tutorials/transformer' } }],
            },
            {
              label: '大模型原理与实践',
              collapsed: true,
              items: [{ autogenerate: { directory: 'tutorials/llm' } }],
            },
            {
              label: 'Prompt Engineering',
              collapsed: true,
              items: [{ autogenerate: { directory: 'tutorials/prompt-engineering' } }],
            },
            {
              label: 'RAG 与 Agent 开发',
              collapsed: true,
              items: [{ autogenerate: { directory: 'tutorials/rag-agent' } }],
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