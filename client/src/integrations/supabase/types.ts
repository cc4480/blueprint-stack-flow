export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      a2a_agents: {
        Row: {
          agent_card: Json | null
          capabilities: Json | null
          created_at: string
          description: string | null
          endpoint: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_card?: Json | null
          capabilities?: Json | null
          created_at?: string
          description?: string | null
          endpoint?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_card?: Json | null
          capabilities?: Json | null
          created_at?: string
          description?: string | null
          endpoint?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      a2a_messages: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          parts: Json
          role: string
          task_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          parts: Json
          role: string
          task_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          parts?: Json
          role?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "a2a_messages_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "a2a_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      a2a_tasks: {
        Row: {
          artifacts: Json | null
          client_agent_id: string | null
          created_at: string
          id: string
          messages: Json | null
          metadata: Json | null
          remote_agent_id: string | null
          session_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          artifacts?: Json | null
          client_agent_id?: string | null
          created_at?: string
          id?: string
          messages?: Json | null
          metadata?: Json | null
          remote_agent_id?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          artifacts?: Json | null
          client_agent_id?: string | null
          created_at?: string
          id?: string
          messages?: Json | null
          metadata?: Json | null
          remote_agent_id?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "a2a_tasks_client_agent_id_fkey"
            columns: ["client_agent_id"]
            isOneToOne: false
            referencedRelation: "a2a_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "a2a_tasks_remote_agent_id_fkey"
            columns: ["remote_agent_id"]
            isOneToOne: false
            referencedRelation: "a2a_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison_sessions: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          is_public: boolean | null
          platform_ids: string[]
          session_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          is_public?: boolean | null
          platform_ids: string[]
          session_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          is_public?: boolean | null
          platform_ids?: string[]
          session_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      deepseek_conversations: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          max_steps: number | null
          messages: Json
          model: string | null
          processing_time_ms: number | null
          reasoning_steps: Json | null
          session_id: string
          temperature: number | null
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          max_steps?: number | null
          messages?: Json
          model?: string | null
          processing_time_ms?: number | null
          reasoning_steps?: Json | null
          session_id: string
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          max_steps?: number | null
          messages?: Json
          model?: string | null
          processing_time_ms?: number | null
          reasoning_steps?: Json | null
          session_id?: string
          temperature?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          category: Database["public"]["Enums"]["feature_category"]
          created_at: string | null
          description: string | null
          id: string
          is_core_feature: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["feature_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_core_feature?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["feature_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_core_feature?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          created_at: string | null
          description: string | null
          documentation_url: string | null
          has_api: boolean | null
          id: string
          is_native: boolean | null
          is_supported: boolean | null
          name: string
          platform_id: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          has_api?: boolean | null
          id?: string
          is_native?: boolean | null
          is_supported?: boolean | null
          name: string
          platform_id: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          has_api?: boolean | null
          id?: string
          is_native?: boolean | null
          is_supported?: boolean | null
          name?: string
          platform_id?: string
          type?: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_servers: {
        Row: {
          capabilities: Json | null
          command: string | null
          created_at: string
          endpoint: string | null
          id: string
          name: string
          protocol_version: string | null
          status: string
          transport: string
          updated_at: string
        }
        Insert: {
          capabilities?: Json | null
          command?: string | null
          created_at?: string
          endpoint?: string | null
          id?: string
          name: string
          protocol_version?: string | null
          status?: string
          transport: string
          updated_at?: string
        }
        Update: {
          capabilities?: Json | null
          command?: string | null
          created_at?: string
          endpoint?: string | null
          id?: string
          name?: string
          protocol_version?: string | null
          status?: string
          transport?: string
          updated_at?: string
        }
        Relationships: []
      }
      mcp_tool_executions: {
        Row: {
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          parameters: Json | null
          result: Json | null
          server_id: string | null
          status: string
          tool_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          parameters?: Json | null
          result?: Json | null
          server_id?: string | null
          status?: string
          tool_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          parameters?: Json | null
          result?: Json | null
          server_id?: string | null
          status?: string
          tool_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcp_tool_executions_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "mcp_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_features: {
        Row: {
          created_at: string | null
          details: string | null
          documentation_url: string | null
          feature_id: string
          id: string
          is_beta: boolean | null
          is_coming_soon: boolean | null
          last_verified: string | null
          limitations: string[] | null
          platform_id: string
          support_level: Database["public"]["Enums"]["support_level"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          documentation_url?: string | null
          feature_id: string
          id?: string
          is_beta?: boolean | null
          is_coming_soon?: boolean | null
          last_verified?: string | null
          limitations?: string[] | null
          platform_id: string
          support_level: Database["public"]["Enums"]["support_level"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          documentation_url?: string | null
          feature_id?: string
          id?: string
          is_beta?: boolean | null
          is_coming_soon?: boolean | null
          last_verified?: string | null
          limitations?: string[] | null
          platform_id?: string
          support_level?: Database["public"]["Enums"]["support_level"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_features_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          category: Database["public"]["Enums"]["platform_category"]
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_updated: string | null
          logo_url: string | null
          metadata: Json | null
          name: string
          popularity: number | null
          rating: number | null
          slug: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["platform_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          popularity?: number | null
          rating?: number | null
          slug: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["platform_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          popularity?: number | null
          rating?: number | null
          slug?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          created_at: string | null
          features: string[] | null
          id: string
          is_free: boolean | null
          is_popular: boolean | null
          limitations: string[] | null
          name: string
          period: Database["public"]["Enums"]["billing_period"]
          platform_id: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          is_free?: boolean | null
          is_popular?: boolean | null
          limitations?: string[] | null
          name: string
          period: Database["public"]["Enums"]["billing_period"]
          platform_id: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: string[] | null
          id?: string
          is_free?: boolean | null
          is_popular?: boolean | null
          limitations?: string[] | null
          name?: string
          period?: Database["public"]["Enums"]["billing_period"]
          platform_id?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_tiers_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_documents: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
          source: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      rag_queries: {
        Row: {
          created_at: string
          id: string
          max_results: number | null
          processing_time_ms: number | null
          query: string
          results: Json | null
          threshold: number | null
          total_found: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          max_results?: number | null
          processing_time_ms?: number | null
          query: string
          results?: Json | null
          threshold?: number | null
          total_found?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          max_results?: number | null
          processing_time_ms?: number | null
          query?: string
          results?: Json | null
          threshold?: number | null
          total_found?: number | null
        }
        Relationships: []
      }
      system_integrations: {
        Row: {
          component: string
          config: Json | null
          created_at: string
          health_check: Json | null
          id: string
          last_ping: string | null
          status: string
          updated_at: string
        }
        Insert: {
          component: string
          config?: Json | null
          created_at?: string
          health_check?: Json | null
          id?: string
          last_ping?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          component?: string
          config?: Json | null
          created_at?: string
          health_check?: Json | null
          id?: string
          last_ping?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tech_stack: {
        Row: {
          category: Database["public"]["Enums"]["tech_category"]
          created_at: string | null
          id: string
          is_supported: boolean | null
          name: string
          notes: string | null
          platform_id: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["tech_category"]
          created_at?: string | null
          id?: string
          is_supported?: boolean | null
          name: string
          notes?: string | null
          platform_id: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["tech_category"]
          created_at?: string | null
          id?: string
          is_supported?: boolean | null
          name?: string
          notes?: string | null
          platform_id?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_stack_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          platform_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      billing_period: "month" | "year" | "one-time" | "free"
      feature_category:
        | "Core Features"
        | "AI & ML"
        | "Collaboration"
        | "Deployment"
        | "Database"
        | "Authentication"
        | "Frameworks"
        | "Languages"
        | "Version Control"
        | "Testing"
        | "Performance"
        | "Security"
        | "Mobile"
        | "Analytics"
        | "Hosting"
      integration_type:
        | "Database"
        | "Authentication"
        | "Payment"
        | "Analytics"
        | "Deployment"
        | "Communication"
        | "Storage"
        | "API"
        | "Third Party"
      platform_category:
        | "Code Editor"
        | "Cloud IDE"
        | "AI Coding"
        | "No Code"
        | "Full Stack"
        | "Mobile Development"
      support_level:
        | "Full"
        | "Partial"
        | "Limited"
        | "Beta"
        | "Coming Soon"
        | "Not Supported"
      tech_category:
        | "Frontend"
        | "Backend"
        | "Database"
        | "Mobile"
        | "DevOps"
        | "AI/ML"
        | "Testing"
        | "Design"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_period: ["month", "year", "one-time", "free"],
      feature_category: [
        "Core Features",
        "AI & ML",
        "Collaboration",
        "Deployment",
        "Database",
        "Authentication",
        "Frameworks",
        "Languages",
        "Version Control",
        "Testing",
        "Performance",
        "Security",
        "Mobile",
        "Analytics",
        "Hosting",
      ],
      integration_type: [
        "Database",
        "Authentication",
        "Payment",
        "Analytics",
        "Deployment",
        "Communication",
        "Storage",
        "API",
        "Third Party",
      ],
      platform_category: [
        "Code Editor",
        "Cloud IDE",
        "AI Coding",
        "No Code",
        "Full Stack",
        "Mobile Development",
      ],
      support_level: [
        "Full",
        "Partial",
        "Limited",
        "Beta",
        "Coming Soon",
        "Not Supported",
      ],
      tech_category: [
        "Frontend",
        "Backend",
        "Database",
        "Mobile",
        "DevOps",
        "AI/ML",
        "Testing",
        "Design",
      ],
    },
  },
} as const
