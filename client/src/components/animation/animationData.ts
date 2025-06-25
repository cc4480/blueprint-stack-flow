
export const animationSteps = [
  { 
    name: 'Project Initialization', 
    description: 'Setting up React + TypeScript foundation',
    elementId: 'project-setup',
    code: `🚀 Initializing Lovable AI Project...

npx create-lovable-app my-app --template typescript
✓ Installing React 18 + TypeScript
✓ Configuring Tailwind CSS
✓ Setting up shadcn/ui components
✓ Installing development tools

📦 Dependencies installed successfully!`,
    duration: 3500
  },
  { 
    name: 'Component Architecture', 
    description: 'Building reusable UI component library',
    elementId: 'components',
    code: `🎨 Generating UI Components...

// Button.tsx
export const Button = ({ variant, children, ...props }) => {
  return (
    <button 
      className={cn(buttonVariants({ variant }))}
      {...props}
    >
      {children}
    </button>
  );
};

// Card.tsx  
export const Card = ({ children, className }) => {
  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      {children}
    </div>
  );
};

✅ Component library ready!`,
    duration: 4000
  },
  { 
    name: 'Authentication System', 
    description: 'Implementing secure user authentication',
    elementId: 'auth',
    code: `🔐 Building Authentication Flow...

// AuthProvider.tsx
const AuthContext = createContext();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await auth.signInWithEmailAndPassword(email, password);
      setUser(response.user);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return { user, signIn, loading };
};

🔒 Authentication system deployed!`,
    duration: 4500
  },
  { 
    name: 'Database Integration', 
    description: 'Connecting to Supabase backend',
    elementId: 'database',
    code: `🗄️ Configuring Database Connection...

// api.ts
import { api } from '@/lib/api'

// Now using our server-side PostgreSQL API
// with secure database connections

// Database schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

📊 Database connection established!`,
    duration: 4000
  },
  { 
    name: 'API Layer', 
    description: 'Creating RESTful API endpoints',
    elementId: 'api',
    code: `⚡ Building API Layer...

// api/users.ts
export const userAPI = {
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
const subscription = supabase
  .channel('users')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'users' 
  }, handleRealtimeUpdate)
  .subscribe();

🔄 Real-time API ready!`,
    duration: 3800
  },
  { 
    name: 'State Management', 
    description: 'Implementing React Query for data fetching',
    elementId: 'state',
    code: `🎯 Setting up State Management...

// hooks/useUsers.ts
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create user");
    }
  });
};

🏪 Global state management configured!`,
    duration: 3600
  },
  { 
    name: 'Production Optimization', 
    description: 'Building and deploying to production',
    elementId: 'production',
    code: `🚀 Optimizing for Production...

npm run build
✓ Creating optimized production build...
✓ Analyzing bundle size...
✓ Generating source maps...
✓ Compressing assets...

Bundle Analysis:
📦 Main bundle: 245KB (gzipped: 78KB)
📦 Vendor bundle: 156KB (gzipped: 52KB)
📦 CSS bundle: 23KB (gzipped: 6KB)

🌐 Deploying to production...
✓ Uploading assets to CDN
✓ Configuring SSL certificates  
✓ Setting up domain routing
✓ Enabling performance monitoring

🎉 Application successfully deployed!
🔗 Live at: https://my-lovable-app.vercel.app

Performance Score: 98/100
Accessibility Score: 100/100
Best Practices Score: 95/100
SEO Score: 92/100`,
    duration: 4200
  }
];
