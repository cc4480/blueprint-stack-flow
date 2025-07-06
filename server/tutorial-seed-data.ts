import { storage } from "./storage";

export async function seedTutorialSystem() {
  try {
    console.log("🌱 Seeding tutorial system with comprehensive framework documentation...");

    // Create tutorial categories
    const categories = [
      {
        name: "Complete Beginner Learning Paths",
        description: "Structured learning paths designed specifically for beginners with no prior experience",
        icon: "🎯",
        slug: "beginner-paths",
        order: 1
      },
      {
        name: "Interactive Coding Tutorials",
        description: "Hands-on tutorials with live code examples and step-by-step guidance",
        icon: "💻",
        slug: "interactive-tutorials",
        order: 2
      },
      {
        name: "Framework Deep Dives",
        description: "Advanced tutorials focusing on specific frameworks and their ecosystems",
        icon: "🚀",
        slug: "framework-deep-dives",
        order: 3
      }
    ];

    const createdCategories = {};
    for (const category of categories) {
      const created = await storage.createTutorialCategory(category);
      createdCategories[category.slug] = created;
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create learning paths
    const learningPaths = [
      {
        title: "Web Development Fundamentals",
        description: "Start your journey with HTML, CSS, and JavaScript basics. Perfect for absolute beginners.",
        difficulty: "beginner",
        duration: "4-6 hours",
        moduleCount: 5,
        categoryId: createdCategories["beginner-paths"].id,
        slug: "web-fundamentals",
        order: 1,
        isActive: true,
        prerequisites: []
      },
      {
        title: "React Fundamentals",
        description: "Master React from scratch with components, state, props, and hooks. Build real projects.",
        difficulty: "beginner",
        duration: "6-8 hours",
        moduleCount: 7,
        categoryId: createdCategories["beginner-paths"].id,
        slug: "react-fundamentals",
        order: 2,
        isActive: true,
        prerequisites: []
      },
      {
        title: "Backend API Development",
        description: "Create robust APIs with Node.js, Express, and databases. From basics to deployment.",
        difficulty: "intermediate",
        duration: "8-10 hours",
        moduleCount: 9,
        categoryId: createdCategories["beginner-paths"].id,
        slug: "backend-api-development",
        order: 3,
        isActive: true,
        prerequisites: []
      }
    ];

    const createdPaths = {};
    for (const path of learningPaths) {
      const created = await storage.createLearningPath(path);
      createdPaths[path.slug] = created;
      console.log(`✅ Created learning path: ${path.title}`);
    }

    // Create interactive tutorials
    const tutorials = [
      {
        title: "Build a Todo App with React",
        description: "Create a complete todo application with state management, local storage, and modern React patterns.",
        type: "interactive",
        difficulty: "beginner",
        duration: "90 mins",
        content: `# Build a Todo App with React

## Overview
In this interactive tutorial, you'll build a complete todo application using React. You'll learn about state management, event handling, and local storage.

## What You'll Build
- Interactive todo list with add, edit, delete functionality
- Filter functionality (All, Active, Completed)
- Local storage persistence
- Modern React patterns with hooks

## Prerequisites
- Basic HTML, CSS, and JavaScript knowledge
- Understanding of React basics (components, JSX)

## Learning Objectives
By the end of this tutorial, you'll understand:
- How to manage state in React using useState
- How to handle form inputs and events
- How to implement CRUD operations
- How to use localStorage for data persistence
- How to structure a React application

## Tutorial Steps

### Step 1: Setting up the Project Structure
\`\`\`jsx
import React, { useState, useEffect } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      {/* We'll build this step by step */}
    </div>
  );
}

export default TodoApp;
\`\`\`

### Step 2: Adding Todo Items
Learn how to add new todos to your list...

### Step 3: Implementing Edit and Delete
Add the ability to modify and remove todos...

### Step 4: Adding Filters
Implement filtering functionality...

### Step 5: Local Storage Integration
Persist your todos across browser sessions...
`,
        codeExamples: [
          {
            title: "useState Hook Example",
            code: "const [todos, setTodos] = useState([]);",
            language: "javascript"
          },
          {
            title: "Todo Component",
            code: `function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  return (
    <div className="todo-item">
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}`,
            language: "jsx"
          }
        ],
        keyFeatures: ["useState Hook", "Event Handling", "Local Storage", "Component Composition"],
        learningObjectives: [
          "Master React state management",
          "Implement CRUD operations",
          "Use localStorage for persistence",
          "Structure React applications"
        ],
        technology: "React",
        categoryId: createdCategories["interactive-tutorials"].id,
        slug: "react-todo-app",
        order: 1,
        isActive: true,
        estimatedMinutes: 90
      },
      {
        title: "REST API with Express & PostgreSQL",
        description: "Build a complete backend API with authentication, validation, and database integration.",
        type: "interactive",
        difficulty: "intermediate",
        duration: "120 mins",
        content: `# REST API with Express & PostgreSQL

## Overview
Build a complete backend API with user authentication, data validation, and PostgreSQL database integration.

## What You'll Build
- User management API with secure authentication
- CRUD operations for user data
- JWT token-based authentication
- Input validation and error handling
- PostgreSQL database integration

## Prerequisites
- Basic Node.js knowledge
- Understanding of HTTP methods
- Basic database concepts

## Learning Objectives
- Express.js routing and middleware
- JWT authentication implementation
- Database integration with PostgreSQL
- API security best practices

## Tutorial Content
Learn to build production-ready APIs step by step...
`,
        codeExamples: [
          {
            title: "Express Server Setup",
            code: `const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ message: 'Users endpoint' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
            language: "javascript"
          }
        ],
        keyFeatures: ["Express Routing", "Database Models", "JWT Authentication", "Input Validation"],
        learningObjectives: [
          "Build REST APIs with Express",
          "Implement JWT authentication",
          "Integrate PostgreSQL database",
          "Handle errors and validation"
        ],
        technology: "Node.js",
        categoryId: createdCategories["interactive-tutorials"].id,
        slug: "express-postgresql-api",
        order: 2,
        isActive: true,
        estimatedMinutes: 120
      },
      {
        title: "Full-Stack Blog Platform",
        description: "Combine React frontend with Node.js backend to create a complete blogging platform.",
        type: "project_based",
        difficulty: "advanced",
        duration: "180 mins",
        content: `# Full-Stack Blog Platform

## Overview
Build a complete blogging platform combining React frontend with Node.js backend.

## What You'll Build
- Complete blog with user accounts
- Post creation and editing
- Comment system
- User authentication
- Rich text editor

## Prerequisites
- React fundamentals
- Node.js and Express basics
- Database knowledge

## Learning Objectives
- Full-stack application architecture
- Frontend-backend integration
- User authentication flows
- Content management systems
`,
        codeExamples: [],
        keyFeatures: ["React Router", "API Integration", "User Authentication", "Rich Text Editor"],
        learningObjectives: [
          "Build full-stack applications",
          "Integrate frontend and backend",
          "Implement user authentication",
          "Create content management features"
        ],
        technology: "React",
        categoryId: createdCategories["interactive-tutorials"].id,
        slug: "fullstack-blog-platform",
        order: 3,
        isActive: true,
        estimatedMinutes: 180
      },
      {
        title: "Next.js Full-Stack Development",
        description: "Master Next.js with SSR, API routes, and deployment strategies.",
        type: "deep_dive",
        difficulty: "advanced",
        duration: "4 hours",
        content: `# Next.js Full-Stack Development

## Overview
Comprehensive guide to Next.js covering SSR, SSG, API routes, and production deployment.

## Topics Covered
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- API Routes
- Authentication with NextAuth
- Performance optimization
- Deployment strategies

## Prerequisites
- React fundamentals
- JavaScript ES6+
- Basic Node.js knowledge

## Course Structure
Deep dive into Next.js ecosystem with hands-on projects...
`,
        codeExamples: [],
        keyFeatures: ["SSR/SSG", "API Routes", "Authentication", "Performance", "Deployment"],
        learningObjectives: [
          "Master Next.js framework",
          "Implement SSR and SSG",
          "Build API routes",
          "Deploy to production"
        ],
        technology: "Next.js",
        categoryId: createdCategories["framework-deep-dives"].id,
        slug: "nextjs-fullstack-development",
        order: 1,
        isActive: true,
        estimatedMinutes: 240
      }
    ];

    const createdTutorials = {};
    for (const tutorial of tutorials) {
      const created = await storage.createTutorial(tutorial);
      createdTutorials[tutorial.slug] = created;
      console.log(`✅ Created tutorial: ${tutorial.title}`);
    }

    // Create tutorial modules for Web Development Fundamentals
    const webFundamentalsModules = [
      {
        learningPathId: createdPaths["web-fundamentals"].id,
        title: "HTML Structure",
        description: "Learn the building blocks of web pages with HTML",
        content: `# HTML Structure Fundamentals

## What is HTML?
HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## Basic HTML Structure
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

## Common HTML Elements
- Headings: h1, h2, h3, h4, h5, h6
- Paragraphs: p
- Links: a
- Images: img
- Lists: ul, ol, li
- Divisions: div
- Spans: span

## Semantic HTML
Learn about semantic elements like header, nav, main, section, article, aside, footer.
`,
        codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Basics</title>
</head>
<body>
    <header>
        <h1>My Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section>
            <h2>Welcome</h2>
            <p>This is the main content area.</p>
        </section>
    </main>
</body>
</html>`,
        order: 1,
        duration: "45 minutes"
      },
      {
        learningPathId: createdPaths["web-fundamentals"].id,
        title: "CSS Styling",
        description: "Style your web pages with CSS",
        content: `# CSS Styling Fundamentals

## What is CSS?
CSS (Cascading Style Sheets) is used to style and layout web pages.

## CSS Syntax
\`\`\`css
selector {
    property: value;
}
\`\`\`

## Common CSS Properties
- color: Text color
- background-color: Background color
- font-size: Text size
- margin: Outer spacing
- padding: Inner spacing
- border: Element border
- display: Layout method
- position: Element positioning

## CSS Selectors
- Element selector: p
- Class selector: .class-name
- ID selector: #id-name
- Attribute selector: [attribute]
- Pseudo-class: :hover, :focus
`,
        codeExample: `/* CSS Example */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
}

.button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.button:hover {
    background-color: #0056b3;
}`,
        order: 2,
        duration: "60 minutes"
      },
      {
        learningPathId: createdPaths["web-fundamentals"].id,
        title: "JavaScript Basics",
        description: "Add interactivity with JavaScript",
        content: `# JavaScript Basics

## What is JavaScript?
JavaScript is a programming language that adds interactivity to web pages.

## Variables and Data Types
\`\`\`javascript
// Variables
let name = 'John';
const age = 25;
var isStudent = true;

// Data Types
let number = 42;
let string = 'Hello World';
let boolean = true;
let array = [1, 2, 3];
let object = { name: 'John', age: 25 };
\`\`\`

## Functions
\`\`\`javascript
// Function Declaration
function greet(name) {
    return 'Hello ' + name;
}

// Arrow Function
const greet = (name) => {
    return \`Hello \${name}\`;
}
\`\`\`

## Control Structures
- if/else statements
- for loops
- while loops
- switch statements
`,
        codeExample: `// JavaScript Example
function calculateTotal(price, tax) {
    return price + (price * tax);
}

const products = ['laptop', 'mouse', 'keyboard'];

for (let i = 0; i < products.length; i++) {
    console.log(products[i]);
}

// Event handling
document.getElementById('button').addEventListener('click', function() {
    alert('Button clicked!');
});

// DOM manipulation
const heading = document.querySelector('h1');
heading.textContent = 'JavaScript is Awesome!';
heading.style.color = 'blue';`,
        order: 3,
        duration: "75 minutes"
      }
    ];

    for (const module of webFundamentalsModules) {
      await storage.createTutorialModule(module);
      console.log(`✅ Created module: ${module.title}`);
    }

    // Create tutorial resources
    const resources = [
      {
        tutorialId: createdTutorials["react-todo-app"].id,
        title: "React Documentation",
        type: "link",
        url: "https://react.dev",
        description: "Official React documentation",
        order: 1
      },
      {
        tutorialId: createdTutorials["react-todo-app"].id,
        title: "GitHub Repository",
        type: "github",
        url: "https://github.com/example/react-todo-app",
        description: "Complete source code for the todo app",
        order: 2
      },
      {
        tutorialId: createdTutorials["express-postgresql-api"].id,
        title: "Express.js Guide",
        type: "link",
        url: "https://expressjs.com",
        description: "Official Express.js documentation",
        order: 1
      },
      {
        tutorialId: createdTutorials["express-postgresql-api"].id,
        title: "PostgreSQL Tutorial",
        type: "link",
        url: "https://www.postgresql.org/docs/",
        description: "PostgreSQL official documentation",
        order: 2
      }
    ];

    for (const resource of resources) {
      await storage.createTutorialResource(resource);
      console.log(`✅ Created resource: ${resource.title}`);
    }

    console.log("🎉 Tutorial system seeded successfully!");
    console.log(`📚 Created ${categories.length} categories`);
    console.log(`🛤️ Created ${learningPaths.length} learning paths`);
    console.log(`📖 Created ${tutorials.length} tutorials`);
    console.log(`📝 Created ${webFundamentalsModules.length} modules`);
    console.log(`🔗 Created ${resources.length} resources`);

    return {
      categories: createdCategories,
      paths: createdPaths,
      tutorials: createdTutorials
    };

  } catch (error) {
    console.error("❌ Error seeding tutorial system:", error);
    throw error;
  }
}