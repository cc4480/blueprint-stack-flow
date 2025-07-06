
import { AppType, DataSource, Feature } from './types';

export const APP_TYPES: AppType[] = [
  {
    id: "dashboard",
    label: "Business Dashboard",
    icon: "📊",
    description: "Analytics and data visualization"
  },
  {
    id: "ecommerce",
    label: "E-commerce Store",
    icon: "🛒",
    description: "Online shopping platform"
  },
  {
    id: "social",
    label: "Social Platform",
    icon: "👥",
    description: "Community and networking"
  },
  {
    id: "productivity",
    label: "Productivity Tool",
    icon: "⚡",
    description: "Task and project management"
  },
  {
    id: "portfolio",
    label: "Portfolio Site",
    icon: "🎨",
    description: "Professional showcase"
  },
  {
    id: "saas",
    label: "SaaS Application",
    icon: "🚀",
    description: "Software as a Service"
  }
];

export const DATA_SOURCES: DataSource[] = [
  {
    id: "supabase",
    label: "Supabase",
    icon: "🗄️",
    description: "Real-time database"
  },
  {
    id: "api",
    label: "External API",
    icon: "🔌",
    description: "Third-party integrations"
  },
  {
    id: "static",
    label: "Static Data",
    icon: "📝",
    description: "JSON or hardcoded data"
  },
  {
    id: "ai",
    label: "AI-Generated",
    icon: "🤖",
    description: "Dynamic AI content"
  }
];

export const FEATURES: Feature[] = [
  {
    id: "auth",
    label: "User Authentication",
    category: "Security"
  },
  {
    id: "payments",
    label: "Payment Processing",
    category: "Commerce"
  },
  {
    id: "realtime",
    label: "Real-time Updates",
    category: "Communication"
  },
  {
    id: "mobile",
    label: "Mobile Responsive",
    category: "Design"
  },
  {
    id: "search",
    label: "Search Functionality",
    category: "Features"
  },
  {
    id: "analytics",
    label: "Analytics Dashboard",
    category: "Business"
  },
  {
    id: "notifications",
    label: "Push Notifications",
    category: "Communication"
  },
  {
    id: "file-upload",
    label: "File Upload/Storage",
    category: "Features"
  }
];
