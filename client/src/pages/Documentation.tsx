import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Code, 
  Database, 
  Server, 
  Zap, 
  Shield, 
  Globe, 
  Cpu, 
  Layout, 
  Palette,
  Search,
  FileText,
  GitBranch,
  Monitor,
  Smartphone,
  Cloud,
  Lock,
  Rocket,
  Brain,
  Network,
  Users,
  BarChart3,
  ChevronRight,
  ExternalLink,
  Copy,
  Download,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Framework {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'fullstack' | 'database' | 'deployment' | 'styling' | 'testing';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  useCase: string;
  pros: string[];
  cons: string[];
  installation: string;
  basicExample: string;
  documentation: string;
  icon: any;
  color: string;
}

const frameworks: Framework[] = [
  // Frontend Frameworks
  {
    id: 'react',
    name: 'React',
    type: 'frontend',
    description: 'A JavaScript library for building user interfaces with component-based architecture and virtual DOM.',
    difficulty: 'Intermediate',
    popularity: 95,
    useCase: 'Single-page applications, dynamic UIs, interactive web apps',
    pros: ['Large ecosystem', 'Component reusability', 'Strong community', 'Flexible architecture'],
    cons: ['Steep learning curve', 'Requires additional libraries', 'Fast-paced updates'],
    installation: 'npm create react-app my-app',
    basicExample: `function Welcome() {
  return <h1>Hello, World!</h1>;
}`,
    documentation: 'https://react.dev/',
    icon: Code,
    color: 'blue'
  },
  {
    id: 'vue',
    name: 'Vue.js',
    type: 'frontend',
    description: 'Progressive JavaScript framework with gentle learning curve and excellent developer experience.',
    difficulty: 'Beginner',
    popularity: 85,
    useCase: 'Progressive web apps, prototyping, gradual adoption',
    pros: ['Easy to learn', 'Great documentation', 'Template syntax', 'Small bundle size'],
    cons: ['Smaller ecosystem', 'Less job market', 'Limited scalability'],
    installation: 'npm create vue@latest my-project',
    basicExample: `<template>
  <h1>{{ message }}</h1>
</template>

<script>
export default {
  data() {
    return { message: 'Hello Vue!' }
  }
}
</script>`,
    documentation: 'https://vuejs.org/',
    icon: Layout,
    color: 'green'
  },
  {
    id: 'svelte',
    name: 'Svelte',
    type: 'frontend',
    description: 'Compile-time framework that generates vanilla JavaScript with no runtime overhead.',
    difficulty: 'Intermediate',
    popularity: 75,
    useCase: 'Performance-critical apps, small bundles, modern web development',
    pros: ['No runtime', 'Small bundles', 'Great performance', 'Simple syntax'],
    cons: ['Smaller community', 'Fewer resources', 'Less tooling'],
    installation: 'npm create svelte@latest my-app',
    basicExample: `<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Clicks: {count}
</button>`,
    documentation: 'https://svelte.dev/',
    icon: Zap,
    color: 'orange'
  },
  {
    id: 'angular',
    name: 'Angular',
    type: 'frontend',
    description: 'Full-featured TypeScript framework with comprehensive tooling and enterprise-grade architecture.',
    difficulty: 'Advanced',
    popularity: 80,
    useCase: 'Enterprise applications, large-scale projects, TypeScript development',
    pros: ['Full framework', 'TypeScript first', 'Enterprise ready', 'Rich tooling'],
    cons: ['Complex', 'Steep learning curve', 'Verbose', 'Large bundle'],
    installation: 'npm install -g @angular/cli && ng new my-app',
    basicExample: `@Component({
  selector: 'app-hello',
  template: '<h1>{{title}}</h1>'
})
export class HelloComponent {
  title = 'Hello Angular!';
}`,
    documentation: 'https://angular.io/',
    icon: Shield,
    color: 'red'
  },

  // Backend Frameworks
  {
    id: 'express',
    name: 'Express.js',
    type: 'backend',
    description: 'Minimal and flexible Node.js web application framework with robust middleware system.',
    difficulty: 'Beginner',
    popularity: 90,
    useCase: 'REST APIs, web servers, microservices, middleware applications',
    pros: ['Lightweight', 'Flexible', 'Large ecosystem', 'Easy to learn'],
    cons: ['Minimal structure', 'Security concerns', 'Callback hell'],
    installation: 'npm install express',
    basicExample: `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);`,
    documentation: 'https://expressjs.com/',
    icon: Server,
    color: 'yellow'
  },
  {
    id: 'fastify',
    name: 'Fastify',
    type: 'backend',
    description: 'Fast and low overhead web framework with built-in validation and serialization.',
    difficulty: 'Intermediate',
    popularity: 70,
    useCase: 'High-performance APIs, microservices, JSON schema validation',
    pros: ['Very fast', 'Built-in validation', 'Plugin system', 'TypeScript support'],
    cons: ['Smaller community', 'Less middleware', 'Learning curve'],
    installation: 'npm install fastify',
    basicExample: `const fastify = require('fastify')();

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.listen({ port: 3000 });`,
    documentation: 'https://www.fastify.io/',
    icon: Rocket,
    color: 'purple'
  },
  {
    id: 'bun-elysia',
    name: 'Bun + Elysia',
    type: 'backend',
    description: 'Ultra-fast JavaScript runtime with Elysia framework for high-performance web applications.',
    difficulty: 'Advanced',
    popularity: 60,
    useCase: 'High-performance APIs, modern JavaScript, edge computing',
    pros: ['Extremely fast', 'Built-in bundler', 'TypeScript native', 'Modern APIs'],
    cons: ['New ecosystem', 'Limited resources', 'Beta stability'],
    installation: 'bun create elysia my-app',
    basicExample: `import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .listen(3000);`,
    documentation: 'https://elysiajs.com/',
    icon: Cpu,
    color: 'indigo'
  },

  // Database Solutions
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'database',
    description: 'Advanced open-source relational database with strong ACID compliance and extensibility.',
    difficulty: 'Intermediate',
    popularity: 85,
    useCase: 'Complex queries, data integrity, ACID transactions, enterprise applications',
    pros: ['ACID compliant', 'Advanced features', 'Extensible', 'Strong consistency'],
    cons: ['Complex setup', 'Resource intensive', 'Learning curve'],
    installation: 'Docker: docker run -d postgres:15',
    basicExample: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);`,
    documentation: 'https://postgresql.org/docs/',
    icon: Database,
    color: 'blue'
  },
  {
    id: 'neon',
    name: 'Neon',
    type: 'database',
    description: 'Serverless PostgreSQL with branching, autoscaling, and edge computing capabilities.',
    difficulty: 'Beginner',
    popularity: 75,
    useCase: 'Serverless apps, development workflows, autoscaling databases',
    pros: ['Serverless', 'Branching', 'Autoscaling', 'Edge ready'],
    cons: ['Vendor lock-in', 'Pricing model', 'Limited control'],
    installation: 'Sign up at neon.tech',
    basicExample: `import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const result = await sql\`SELECT * FROM users\`;`,
    documentation: 'https://neon.tech/docs',
    icon: Cloud,
    color: 'green'
  },

  // Styling Frameworks
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    type: 'styling',
    description: 'Utility-first CSS framework for rapid UI development with pre-defined classes.',
    difficulty: 'Beginner',
    popularity: 90,
    useCase: 'Rapid prototyping, utility-first design, responsive layouts',
    pros: ['Fast development', 'Small bundle', 'Customizable', 'Great DX'],
    cons: ['HTML clutter', 'Learning utilities', 'Design skills needed'],
    installation: 'npm install tailwindcss',
    basicExample: `<div class="bg-blue-500 text-white p-4 rounded-lg">
  <h1 class="text-2xl font-bold">Hello Tailwind!</h1>
</div>`,
    documentation: 'https://tailwindcss.com/',
    icon: Palette,
    color: 'teal'
  },

  // More Frontend Frameworks
  {
    id: 'next',
    name: 'Next.js',
    type: 'fullstack',
    description: 'React framework with server-side rendering, static generation, and full-stack capabilities.',
    difficulty: 'Intermediate',
    popularity: 90,
    useCase: 'Server-side rendering, static sites, full-stack applications, SEO-optimized apps',
    pros: ['SSR/SSG built-in', 'File-based routing', 'API routes', 'Image optimization', 'Great performance'],
    cons: ['Opinionated structure', 'Vendor lock-in', 'Complex configuration'],
    installation: 'npx create-next-app@latest my-app',
    basicExample: `// pages/index.js
export default function Home() {
  return <h1>Welcome to Next.js!</h1>;
}

// API route: pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js!' });
}`,
    documentation: 'https://nextjs.org/',
    icon: Globe,
    color: 'gray'
  },
  {
    id: 'nuxt',
    name: 'Nuxt.js',
    type: 'fullstack',
    description: 'Vue.js framework with universal application capabilities and automatic code splitting.',
    difficulty: 'Intermediate',
    popularity: 80,
    useCase: 'Vue SSR apps, static sites, universal applications, JAMstack',
    pros: ['Vue ecosystem', 'Auto code splitting', 'SEO friendly', 'Great developer experience'],
    cons: ['Vue dependency', 'Learning curve', 'Build complexity'],
    installation: 'npx nuxi@latest init my-app',
    basicExample: `<!-- pages/index.vue -->
<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
const title = 'Welcome to Nuxt 3!'
</script>`,
    documentation: 'https://nuxt.com/',
    icon: Layout,
    color: 'green'
  },
  {
    id: 'remix',
    name: 'Remix',
    type: 'fullstack',
    description: 'Full-stack React framework focused on web standards and progressive enhancement.',
    difficulty: 'Advanced',
    popularity: 70,
    useCase: 'Full-stack React apps, web standards compliance, progressive enhancement',
    pros: ['Web standards', 'Excellent UX', 'Server-side focus', 'Built-in error handling'],
    cons: ['Learning curve', 'Smaller ecosystem', 'Opinionated routing'],
    installation: 'npx create-remix@latest my-app',
    basicExample: `// app/routes/index.tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ message: "Hello from Remix!" });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return <h1>{data.message}</h1>;
}`,
    documentation: 'https://remix.run/',
    icon: Zap,
    color: 'blue'
  },
  {
    id: 'astro',
    name: 'Astro',
    type: 'frontend',
    description: 'Static site generator with component islands architecture and framework agnostic approach.',
    difficulty: 'Intermediate',
    popularity: 75,
    useCase: 'Static sites, content-focused sites, multi-framework projects, performance optimization',
    pros: ['Zero JS by default', 'Framework agnostic', 'Great performance', 'Component islands'],
    cons: ['Limited interactivity', 'New ecosystem', 'Learning curve'],
    installation: 'npm create astro@latest my-project',
    basicExample: `---
// Component script (runs at build time)
const greeting = "Hello";
---

<html>
  <body>
    <h1>{greeting} Astro!</h1>
    <script>
      // Client-side JS (optional)
      console.log('Hello from the browser!');
    </script>
  </body>
</html>`,
    documentation: 'https://astro.build/',
    icon: Rocket,
    color: 'orange'
  },
  {
    id: 'solid',
    name: 'SolidJS',
    type: 'frontend',
    description: 'Reactive JavaScript framework with fine-grained reactivity and no virtual DOM.',
    difficulty: 'Advanced',
    popularity: 65,
    useCase: 'High-performance apps, reactive programming, fine-grained updates',
    pros: ['No virtual DOM', 'Fine-grained reactivity', 'Small bundle size', 'Fast performance'],
    cons: ['Smaller community', 'Learning curve', 'Limited ecosystem'],
    installation: 'npx degit solidjs/templates/js my-app',
    basicExample: `import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);
  
  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count()}
    </button>
  );
}`,
    documentation: 'https://www.solidjs.com/',
    icon: Zap,
    color: 'blue'
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    type: 'fullstack',
    description: 'Full-stack Svelte framework with server-side rendering and adapter-based deployment.',
    difficulty: 'Intermediate',
    popularity: 70,
    useCase: 'Full-stack Svelte apps, SSR applications, static sites',
    pros: ['Svelte performance', 'Great DX', 'Adapter ecosystem', 'Built-in features'],
    cons: ['Smaller ecosystem', 'Learning curve', 'Limited resources'],
    installation: 'npm create svelte@latest my-app',
    basicExample: `<!-- src/routes/+page.svelte -->
<script>
  import { page } from '$app/stores';
  export let data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit count: {data.count}</p>

<!-- src/routes/+page.js -->
export async function load() {
  return {
    count: Math.floor(Math.random() * 100)
  };
}`,
    documentation: 'https://kit.svelte.dev/',
    icon: Zap,
    color: 'orange'
  },

  // More Backend Frameworks
  {
    id: 'nestjs',
    name: 'NestJS',
    type: 'backend',
    description: 'Progressive Node.js framework for building scalable server-side applications with TypeScript.',
    difficulty: 'Advanced',
    popularity: 80,
    useCase: 'Enterprise APIs, microservices, GraphQL servers, scalable backends',
    pros: ['TypeScript first', 'Decorator-based', 'Modular architecture', 'Great tooling'],
    cons: ['Complex setup', 'Learning curve', 'Opinionated structure'],
    installation: 'npm i -g @nestjs/cli && nest new my-project',
    basicExample: `import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello NestJS!';
  }
}`,
    documentation: 'https://nestjs.com/',
    icon: Shield,
    color: 'red'
  },
  {
    id: 'koa',
    name: 'Koa.js',
    type: 'backend',
    description: 'Next generation web framework for Node.js designed by the Express team with async/await.',
    difficulty: 'Intermediate',
    popularity: 70,
    useCase: 'Modern APIs, middleware-heavy apps, async-first applications',
    pros: ['Async/await native', 'Lightweight', 'Better error handling', 'Context object'],
    cons: ['Smaller ecosystem', 'Less middleware', 'Learning curve'],
    installation: 'npm install koa',
    basicExample: `const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = 'Hello Koa!';
  await next();
});

app.listen(3000);`,
    documentation: 'https://koajs.com/',
    icon: Server,
    color: 'green'
  },
  {
    id: 'deno-fresh',
    name: 'Deno Fresh',
    type: 'fullstack',
    description: 'Full-stack framework for Deno with islands architecture and edge-ready deployment.',
    difficulty: 'Advanced',
    popularity: 60,
    useCase: 'Deno applications, edge computing, secure server-side apps',
    pros: ['Deno runtime', 'TypeScript native', 'Security first', 'Edge ready'],
    cons: ['New ecosystem', 'Limited resources', 'Deno adoption'],
    installation: 'deno run -A -r https://fresh.deno.dev my-project',
    basicExample: `// routes/index.tsx
import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div>
        <h1>Welcome to Fresh!</h1>
      </div>
    </>
  );
}`,
    documentation: 'https://fresh.deno.dev/',
    icon: Cpu,
    color: 'cyan'
  },

  // More Database Solutions
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'database',
    description: 'NoSQL document database with flexible schema and horizontal scaling capabilities.',
    difficulty: 'Beginner',
    popularity: 85,
    useCase: 'Document storage, rapid prototyping, flexible schemas, real-time applications',
    pros: ['Flexible schema', 'Easy to start', 'Horizontal scaling', 'Rich query language'],
    cons: ['No ACID by default', 'Memory usage', 'Consistency issues'],
    installation: 'Docker: docker run -d mongo:latest',
    basicExample: `// Using Mongoose
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const User = model('User', userSchema);`,
    documentation: 'https://docs.mongodb.com/',
    icon: Database,
    color: 'green'
  },
  {
    id: 'redis',
    name: 'Redis',
    type: 'database',
    description: 'In-memory data structure store used as database, cache, and message broker.',
    difficulty: 'Intermediate',
    popularity: 80,
    useCase: 'Caching, session storage, real-time analytics, message queuing',
    pros: ['Very fast', 'Rich data types', 'Atomic operations', 'Pub/sub messaging'],
    cons: ['Memory only', 'Single threaded', 'Persistence limitations'],
    installation: 'Docker: docker run -d redis:latest',
    basicExample: `// Using ioredis
const Redis = require('ioredis');
const redis = new Redis();

await redis.set('key', 'value');
const value = await redis.get('key');`,
    documentation: 'https://redis.io/docs/',
    icon: Zap,
    color: 'red'
  },
  {
    id: 'planetscale',
    name: 'PlanetScale',
    type: 'database',
    description: 'Serverless MySQL platform with branching, scaling, and developer-friendly workflows.',
    difficulty: 'Beginner',
    popularity: 75,
    useCase: 'MySQL applications, database branching, serverless scaling',
    pros: ['Database branching', 'Serverless scaling', 'Schema management', 'Great DX'],
    cons: ['MySQL limitations', 'Vendor lock-in', 'Pricing at scale'],
    installation: 'Sign up at planetscale.com',
    basicExample: `import { connect } from '@planetscale/database';

const config = {
  url: process.env.DATABASE_URL
};

const conn = connect(config);
const results = await conn.execute('SELECT * FROM users');`,
    documentation: 'https://planetscale.com/docs',
    icon: Globe,
    color: 'purple'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    type: 'database',
    description: 'Open source Firebase alternative with PostgreSQL, real-time subscriptions, and auth.',
    difficulty: 'Beginner',
    popularity: 85,
    useCase: 'Real-time apps, authentication, file storage, PostgreSQL applications',
    pros: ['Real-time features', 'Built-in auth', 'PostgreSQL based', 'Easy setup'],
    cons: ['Vendor dependency', 'Limited customization', 'Pricing model'],
    installation: 'npm install @supabase/supabase-js',
    basicExample: `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

const { data, error } = await supabase
  .from('users')
  .select('*');`,
    documentation: 'https://supabase.com/docs',
    icon: Database,
    color: 'green'
  },

  // More Styling Options
  {
    id: 'chakra',
    name: 'Chakra UI',
    type: 'styling',
    description: 'Modular and accessible React component library with built-in theming support.',
    difficulty: 'Beginner',
    popularity: 80,
    useCase: 'React applications, rapid prototyping, accessible design systems',
    pros: ['Accessibility first', 'Great theming', 'Composable components', 'TypeScript support'],
    cons: ['React only', 'Bundle size', 'Opinionated design'],
    installation: 'npm install @chakra-ui/react @emotion/react',
    basicExample: `import { Button, Box } from '@chakra-ui/react';

function App() {
  return (
    <Box p={4}>
      <Button colorScheme="blue">
        Hello Chakra UI
      </Button>
    </Box>
  );
}`,
    documentation: 'https://chakra-ui.com/',
    icon: Palette,
    color: 'teal'
  },
  {
    id: 'mui',
    name: 'Material-UI (MUI)',
    type: 'styling',
    description: 'React component library implementing Google\'s Material Design principles.',
    difficulty: 'Intermediate',
    popularity: 85,
    useCase: 'Material Design apps, enterprise applications, rapid development',
    pros: ['Material Design', 'Comprehensive components', 'Great documentation', 'Theme system'],
    cons: ['Large bundle', 'Material Design lock-in', 'Customization complexity'],
    installation: 'npm install @mui/material @emotion/react',
    basicExample: `import { Button, Container } from '@mui/material';

function App() {
  return (
    <Container>
      <Button variant="contained" color="primary">
        Hello Material-UI
      </Button>
    </Container>
  );
}`,
    documentation: 'https://mui.com/',
    icon: Palette,
    color: 'blue'
  },
  {
    id: 'styled-components',
    name: 'styled-components',
    type: 'styling',
    description: 'CSS-in-JS library for styling React components with tagged template literals.',
    difficulty: 'Intermediate',
    popularity: 75,
    useCase: 'Component-scoped styling, dynamic styling, theme-driven design',
    pros: ['Component scoped CSS', 'Dynamic styling', 'No class name conflicts', 'Theming'],
    cons: ['Runtime overhead', 'Learning curve', 'Bundle size'],
    installation: 'npm install styled-components',
    basicExample: `import styled from 'styled-components';

const Button = styled.button\`
  background: \${props => props.primary ? 'blue' : 'white'};
  color: \${props => props.primary ? 'white' : 'blue'};
  padding: 10px 20px;
  border: 2px solid blue;
\`;`,
    documentation: 'https://styled-components.com/',
    icon: Palette,
    color: 'pink'
  },

  // Testing Frameworks
  {
    id: 'jest',
    name: 'Jest',
    type: 'testing',
    description: 'Comprehensive JavaScript testing framework with snapshot testing and mocking capabilities.',
    difficulty: 'Intermediate',
    popularity: 85,
    useCase: 'Unit testing, integration testing, snapshot testing, mocking',
    pros: ['Zero config', 'Snapshot testing', 'Built-in mocking', 'Code coverage'],
    cons: ['Can be slow', 'Large bundle', 'Configuration complexity'],
    installation: 'npm install --save-dev jest',
    basicExample: `test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});`,
    documentation: 'https://jestjs.io/',
    icon: Shield,
    color: 'orange'
  },
  {
    id: 'vitest',
    name: 'Vitest',
    type: 'testing',
    description: 'Vite-native testing framework with Jest compatibility and blazing fast performance.',
    difficulty: 'Beginner',
    popularity: 75,
    useCase: 'Vite projects, fast testing, modern JavaScript testing',
    pros: ['Very fast', 'Vite integration', 'Jest compatible', 'ESM support'],
    cons: ['Newer ecosystem', 'Vite dependency', 'Limited plugins'],
    installation: 'npm install --save-dev vitest',
    basicExample: `import { test, expect } from 'vitest';

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});`,
    documentation: 'https://vitest.dev/',
    icon: Zap,
    color: 'yellow'
  },
  {
    id: 'playwright',
    name: 'Playwright',
    type: 'testing',
    description: 'End-to-end testing framework for modern web apps with cross-browser support.',
    difficulty: 'Intermediate',
    popularity: 80,
    useCase: 'E2E testing, cross-browser testing, UI automation, API testing',
    pros: ['Cross-browser', 'Auto-wait', 'Parallel execution', 'Rich debugging'],
    cons: ['Learning curve', 'Setup complexity', 'Resource intensive'],
    installation: 'npm install --save-dev @playwright/test',
    basicExample: `import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});`,
    documentation: 'https://playwright.dev/',
    icon: Globe,
    color: 'green'
  },

  // Build Tools & Deployment
  {
    id: 'vite',
    name: 'Vite',
    type: 'frontend',
    description: 'Next generation build tool with instant server start and lightning fast HMR.',
    difficulty: 'Beginner',
    popularity: 85,
    useCase: 'Modern web development, fast builds, development server, bundling',
    pros: ['Very fast', 'Modern ESM', 'Plugin ecosystem', 'Great DX'],
    cons: ['Modern browsers only', 'ESM complexity', 'Production differences'],
    installation: 'npm create vite@latest my-app',
    basicExample: `// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
    documentation: 'https://vitejs.dev/',
    icon: Zap,
    color: 'purple'
  },
  {
    id: 'webpack',
    name: 'Webpack',
    type: 'frontend',
    description: 'Powerful module bundler with extensive plugin ecosystem and configuration options.',
    difficulty: 'Advanced',
    popularity: 80,
    useCase: 'Complex builds, legacy support, advanced optimization, micro-frontends',
    pros: ['Very configurable', 'Mature ecosystem', 'Code splitting', 'Tree shaking'],
    cons: ['Complex configuration', 'Slow builds', 'Learning curve'],
    installation: 'npm install --save-dev webpack webpack-cli',
    basicExample: `// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};`,
    documentation: 'https://webpack.js.org/',
    icon: Code,
    color: 'blue'
  }
];

const architecturePatterns = [
  {
    id: 'rag',
    name: 'RAG 2.0 (Retrieval-Augmented Generation)',
    description: 'Advanced AI architecture that combines large language models with external knowledge bases.',
    components: ['Vector Database', 'Embedding Models', 'Retrieval System', 'LLM Integration'],
    useCase: 'AI-powered search, knowledge management, intelligent document processing',
    implementation: 'Use vector embeddings to store and retrieve relevant context for AI responses',
    icon: Brain,
    color: 'purple'
  },
  {
    id: 'mcp',
    name: 'MCP (Model Context Protocol)',
    description: 'Standardized protocol for connecting AI models with external tools and data sources.',
    components: ['Protocol Definition', 'Tool Registry', 'Context Management', 'Security Layer'],
    useCase: 'AI tool integration, model communication, context sharing',
    implementation: 'Implement standardized interfaces for AI model communication and tool access',
    icon: Network,
    color: 'blue'
  },
  {
    id: 'a2a',
    name: 'A2A (Agent-to-Agent) Communication',
    description: 'Distributed system architecture enabling autonomous AI agents to collaborate.',
    components: ['Agent Framework', 'Message Passing', 'Task Coordination', 'State Synchronization'],
    useCase: 'Multi-agent systems, distributed AI, collaborative problem solving',
    implementation: 'Design agent communication protocols and coordination mechanisms',
    icon: Users,
    color: 'green'
  }
];

const Documentation = () => {
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const downloadGuide = (framework: Framework) => {
    const content = `# ${framework.name} Quick Start Guide

## Overview
${framework.description}

## Difficulty Level
${framework.difficulty}

## Use Cases
${framework.useCase}

## Pros
${framework.pros.map(pro => `- ${pro}`).join('\n')}

## Cons
${framework.cons.map(con => `- ${con}`).join('\n')}

## Installation
\`\`\`bash
${framework.installation}
\`\`\`

## Basic Example
\`\`\`javascript
${framework.basicExample}
\`\`\`

## Documentation
${framework.documentation}

---
Generated by NoCodeLos Blueprint Stack Documentation
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${framework.name.toLowerCase()}-guide.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Guide Downloaded",
      description: `${framework.name} quick start guide has been downloaded.`,
    });
  };

  const getFrameworksByType = (type: string) => {
    return frameworks.filter(f => f.type === type);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-logo-text mb-6">
            Complete Framework Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Your one-stop educational resource for modern web development. Learn every framework, 
            understand architectural patterns, and master the complete NoCodeLos Blueprint Stack.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-blue-400/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="frameworks" className="data-[state=active]:bg-blue-600">
              <Code className="w-4 h-4 mr-2" />
              Frameworks
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-blue-600">
              <Network className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Tutorials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid gap-8">
              {/* Technology Stack Overview */}
              <Card className="bg-gray-900 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-blue-400" />
                    NoCodeLos Blueprint Stack Architecture
                  </CardTitle>
                  <CardDescription>
                    Complete technology stack powering modern AI-enabled web applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                        <Layout className="w-4 h-4" />
                        Frontend Layer
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• React 18 with TypeScript</li>
                        <li>• Tailwind CSS + shadcn/ui</li>
                        <li>• Vite build system</li>
                        <li>• React Query for state management</li>
                        <li>• Responsive design patterns</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-400 flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Backend Layer
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Express.js with TypeScript</li>
                        <li>• PostgreSQL database</li>
                        <li>• Drizzle ORM</li>
                        <li>• RESTful API design</li>
                        <li>• Authentication & authorization</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-400 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Integration
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• DeepSeek API integration</li>
                        <li>• RAG 2.0 implementation</li>
                        <li>• MCP protocol support</li>
                        <li>• A2A agent coordination</li>
                        <li>• Real-time AI responses</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Start Guide */}
              <Card className="bg-gray-900 border-green-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-green-400" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription>
                    Get started with the NoCodeLos Blueprint Stack in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                          <h4 className="font-semibold">Setup Environment</h4>
                        </div>
                        <p className="text-sm text-gray-300">Install Node.js, set up your database, and configure environment variables.</p>
                      </div>
                      <div className="p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                          <h4 className="font-semibold">Clone & Install</h4>
                        </div>
                        <p className="text-sm text-gray-300">Clone the repository and install dependencies for both frontend and backend.</p>
                      </div>
                      <div className="p-4 bg-purple-900/20 border border-purple-400/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                          <h4 className="font-semibold">Configure & Run</h4>
                        </div>
                        <p className="text-sm text-gray-300">Set up your API keys, run database migrations, and start the development server.</p>
                      </div>
                    </div>
                    
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                      <h4 className="font-semibold mb-2 text-gray-200">Installation Commands</h4>
                      <pre className="text-sm text-green-400 font-mono">
{`# Clone the repository
git clone https://github.com/your-repo/nocodelos-stack.git

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run database migrations
npm run db:push

# Start development server
npm run dev`}
                      </pre>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => copyToClipboard(`git clone https://github.com/your-repo/nocodelos-stack.git
npm install
cp .env.example .env
npm run db:push
npm run dev`, 'Installation commands')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Commands
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frameworks" className="mt-8">
            <div className="grid gap-8">
              {/* Framework Categories */}
              {['frontend', 'backend', 'database', 'styling', 'testing'].map(type => (
                <Card key={type} className="bg-gray-900 border-blue-400/30">
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-3">
                      {type === 'frontend' && <Layout className="w-6 h-6 text-blue-400" />}
                      {type === 'backend' && <Server className="w-6 h-6 text-green-400" />}
                      {type === 'database' && <Database className="w-6 h-6 text-purple-400" />}
                      {type === 'styling' && <Palette className="w-6 h-6 text-pink-400" />}
                      {type === 'testing' && <Shield className="w-6 h-6 text-orange-400" />}
                      {type} Frameworks
                    </CardTitle>
                    <CardDescription>
                      Learn about {type} technologies used in modern web development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFrameworksByType(type).map(framework => (
                        <div 
                          key={framework.id}
                          className="p-4 bg-black/30 border border-gray-600 rounded-lg hover:border-blue-400/50 transition-all cursor-pointer"
                          onClick={() => setSelectedFramework(framework)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <framework.icon className={`w-5 h-5 text-${framework.color}-400`} />
                              <h4 className="font-semibold">{framework.name}</h4>
                            </div>
                            <Badge className={getDifficultyColor(framework.difficulty)}>
                              {framework.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{framework.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 bg-${framework.color}-400 rounded-full`}
                                  style={{ width: `${framework.popularity}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{framework.popularity}%</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="mt-8">
            <div className="grid gap-8">
              <Card className="bg-gray-900 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Network className="w-6 h-6 text-blue-400" />
                    Advanced AI Architecture Patterns
                  </CardTitle>
                  <CardDescription>
                    Learn about cutting-edge AI integration patterns used in the NoCodeLos Stack
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                    {architecturePatterns.map(pattern => (
                      <div 
                        key={pattern.id}
                        className="p-6 bg-black/30 border border-gray-600 rounded-lg hover:border-blue-400/50 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <pattern.icon className={`w-8 h-8 text-${pattern.color}-400`} />
                          <h3 className="text-xl font-semibold">{pattern.name}</h3>
                        </div>
                        <p className="text-gray-300 mb-4">{pattern.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-blue-400 mb-2">Key Components:</h4>
                          <ul className="space-y-1">
                            {pattern.components.map((component, index) => (
                              <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                {component}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-green-400 mb-2">Use Case:</h4>
                          <p className="text-sm text-gray-300">{pattern.useCase}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-purple-400 mb-2">Implementation:</h4>
                          <p className="text-sm text-gray-300">{pattern.implementation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="mt-8">
            <div className="grid gap-8">
              {/* Beginner Learning Paths */}
              <Card className="bg-gray-900 border-green-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-green-400" />
                    Complete Beginner Learning Paths
                  </CardTitle>
                  <CardDescription>
                    Structured learning paths designed specifically for beginners with no prior experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Web Development Fundamentals',
                        description: 'Start your journey with HTML, CSS, and JavaScript basics. Perfect for absolute beginners.',
                        difficulty: 'Absolute Beginner',
                        duration: '4-6 hours',
                        modules: 5,
                        topics: ['HTML Structure', 'CSS Styling', 'JavaScript Basics', 'DOM Manipulation', 'Development Tools'],
                        color: 'green'
                      },
                      {
                        title: 'React Fundamentals',
                        description: 'Master React from scratch with components, state, props, and hooks. Build real projects.',
                        difficulty: 'Beginner',
                        duration: '6-8 hours',
                        modules: 7,
                        topics: ['Components & JSX', 'Props & State', 'Event Handling', 'Hooks', 'Project Structure'],
                        color: 'blue'
                      },
                      {
                        title: 'Backend API Development',
                        description: 'Create robust APIs with Node.js, Express, and databases. From basics to deployment.',
                        difficulty: 'Getting Comfortable',
                        duration: '8-10 hours',
                        modules: 9,
                        topics: ['Express Setup', 'Database Integration', 'Authentication', 'API Design', 'Deployment'],
                        color: 'purple'
                      }
                    ].map((path, index) => (
                      <div key={index} className={`p-6 bg-black/30 border border-${path.color}-400/30 rounded-lg hover:border-${path.color}-400/60 transition-all`}>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{path.title}</h3>
                            <Badge className={`${path.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' : path.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'}`}>
                              {path.difficulty}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">{path.description}</p>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{path.duration}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Modules:</span>
                            <span className="text-white">{path.modules} modules</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className={`font-medium text-${path.color}-400 mb-2 text-sm`}>Learning Path:</h4>
                          <div className="space-y-1">
                            {path.topics.map((topic, topicIndex) => (
                              <div key={topicIndex} className="flex items-center gap-2">
                                <div className={`w-2 h-2 bg-${path.color}-400 rounded-full`} />
                                <span className="text-xs text-gray-300">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className={`w-full bg-${path.color}-600 hover:bg-${path.color}-700`}>
                          Start Learning Path
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Tutorials */}
              <Card className="bg-gray-900 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-blue-400" />
                    Interactive Coding Tutorials
                  </CardTitle>
                  <CardDescription>
                    Hands-on tutorials with live code examples and step-by-step guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Build a Todo App with React',
                        description: 'Create a complete todo application with state management, local storage, and modern React patterns.',
                        difficulty: 'Beginner',
                        duration: '90 mins',
                        features: ['useState Hook', 'Event Handling', 'Local Storage', 'Component Composition'],
                        preview: 'Interactive todo list with add, edit, delete, and filter functionality'
                      },
                      {
                        title: 'REST API with Express & PostgreSQL',
                        description: 'Build a complete backend API with authentication, validation, and database integration.',
                        difficulty: 'Intermediate',
                        duration: '120 mins',
                        features: ['Express Routing', 'Database Models', 'JWT Authentication', 'Input Validation'],
                        preview: 'User management API with secure authentication and CRUD operations'
                      },
                      {
                        title: 'Full-Stack Blog Platform',
                        description: 'Combine React frontend with Node.js backend to create a complete blogging platform.',
                        difficulty: 'Advanced',
                        duration: '180 mins',
                        features: ['React Router', 'API Integration', 'User Authentication', 'Rich Text Editor'],
                        preview: 'Complete blog with user accounts, post creation, and comment system'
                      },
                      {
                        title: 'Real-time Chat Application',
                        description: 'Learn WebSockets by building a real-time chat app with rooms and user presence.',
                        difficulty: 'Advanced',
                        duration: '150 mins',
                        features: ['Socket.io', 'Real-time Updates', 'Chat Rooms', 'User Presence'],
                        preview: 'Live chat with multiple rooms, typing indicators, and online users'
                      },
                      {
                        title: 'E-commerce Product Catalog',
                        description: 'Create a product listing with search, filters, and shopping cart functionality.',
                        difficulty: 'Intermediate',
                        duration: '135 mins',
                        features: ['Search & Filter', 'Shopping Cart', 'Product Details', 'Responsive Design'],
                        preview: 'Product catalog with advanced search and shopping cart features'
                      },
                      {
                        title: 'Weather Dashboard with APIs',
                        description: 'Build a weather dashboard consuming external APIs with data visualization.',
                        difficulty: 'Beginner',
                        duration: '75 mins',
                        features: ['API Integration', 'Data Visualization', 'Geolocation', 'Error Handling'],
                        preview: 'Weather dashboard with current conditions and 5-day forecast'
                      }
                    ].map((tutorial, index) => (
                      <div key={index} className="p-6 bg-black/30 border border-gray-600 rounded-lg hover:border-blue-400/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">{tutorial.title}</h3>
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-4">{tutorial.description}</p>
                        
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded">
                          <p className="text-sm text-blue-200">
                            <strong>What you'll build:</strong> {tutorial.preview}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">{tutorial.duration}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-blue-400 mb-2">Key Features:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {tutorial.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                <span className="text-xs text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" variant="outline">
                          Start Interactive Tutorial
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Framework Deep Dives */}
              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-purple-400" />
                    Framework Deep Dives
                  </CardTitle>
                  <CardDescription>
                    Advanced tutorials focusing on specific frameworks and their ecosystems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Next.js Full-Stack Development',
                        description: 'Master Next.js with SSR, API routes, and deployment strategies.',
                        topics: ['SSR/SSG', 'API Routes', 'Authentication', 'Performance', 'Deployment'],
                        duration: '4 hours',
                        level: 'Advanced'
                      },
                      {
                        title: 'Vue.js Ecosystem Mastery',
                        description: 'Complete Vue.js development with Vuex, Vue Router, and Nuxt.js.',
                        topics: ['Vue 3 Composition API', 'Vuex State Management', 'Vue Router', 'Nuxt.js', 'Testing'],
                        duration: '3.5 hours',
                        level: 'Intermediate'
                      },
                      {
                        title: 'Angular Enterprise Development',
                        description: 'Build large-scale applications with Angular, RxJS, and NgRx.',
                        topics: ['Angular Architecture', 'RxJS Observables', 'NgRx State Management', 'Testing', 'Performance'],
                        duration: '5 hours',
                        level: 'Advanced'
                      }
                    ].map((deepDive, index) => (
                      <div key={index} className="p-5 bg-black/30 border border-purple-400/30 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">{deepDive.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{deepDive.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={getDifficultyColor(deepDive.level)}>
                            {deepDive.level}
                          </Badge>
                          <span className="text-sm text-gray-400">{deepDive.duration}</span>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-purple-400 mb-2 text-sm">Topics Covered:</h4>
                          <div className="space-y-1">
                            {deepDive.topics.map((topic, topicIndex) => (
                              <div key={topicIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                <span className="text-xs text-gray-300">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                          Start Deep Dive
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Framework Detail Modal */}
        {selectedFramework && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-gray-900 border-blue-400/30 max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedFramework.icon className={`w-8 h-8 text-${selectedFramework.color}-400`} />
                    <div>
                      <CardTitle className="text-2xl">{selectedFramework.name}</CardTitle>
                      <CardDescription className="text-lg">{selectedFramework.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedFramework(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2">Difficulty</h4>
                        <Badge className={getDifficultyColor(selectedFramework.difficulty)}>
                          {selectedFramework.difficulty}
                        </Badge>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2">Popularity</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 bg-${selectedFramework.color}-400 rounded-full`}
                              style={{ width: `${selectedFramework.popularity}%` }}
                            />
                          </div>
                          <span className="text-sm">{selectedFramework.popularity}%</span>
                        </div>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2">Type</h4>
                        <Badge variant="outline" className="capitalize">
                          {selectedFramework.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Use Cases</h4>
                      <p className="text-gray-300">{selectedFramework.useCase}</p>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-3">Pros</h4>
                        <ul className="space-y-2">
                          {selectedFramework.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-3">Cons</h4>
                        <ul className="space-y-2">
                          {selectedFramework.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Installation */}
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3">Installation</h4>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                        <pre className="text-sm text-green-400 font-mono">{selectedFramework.installation}</pre>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => copyToClipboard(selectedFramework.installation, 'Installation command')}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Basic Example */}
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3">Basic Example</h4>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{selectedFramework.basicExample}</pre>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => copyToClipboard(selectedFramework.basicExample, 'Code example')}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-600">
                      <Button 
                        className="flex-1"
                        onClick={() => downloadGuide(selectedFramework)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Guide
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(selectedFramework.documentation, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Official Docs
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation;