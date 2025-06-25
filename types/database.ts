export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          bio: string | null
          useful_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          useful_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          useful_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          owner_id: string
          url: string
          title: string
          why_useful: string
          tag: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          url: string
          title: string
          why_useful: string
          tag: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          url?: string
          title?: string
          why_useful?: string
          tag?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      useful_votes: {
        Row: {
          user_id: string
          asset_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          asset_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          asset_id?: string
          created_at?: string
        }
      }
      stacks: {
        Row: {
          id: string
          owner_id: string
          name: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      stack_items: {
        Row: {
          stack_id: string
          asset_id: string
          added_at: string
        }
        Insert: {
          stack_id: string
          asset_id: string
          added_at?: string
        }
        Update: {
          stack_id?: string
          asset_id?: string
          added_at?: string
        }
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      badges: {
        Row: {
          user_id: string
          type: 'asset_hunter' | 'asset_guru' | 'master_stacker'
          awarded_at: string
        }
        Insert: {
          user_id: string
          type: 'asset_hunter' | 'asset_guru' | 'master_stacker'
          awarded_at?: string
        }
        Update: {
          user_id?: string
          type?: 'asset_hunter' | 'asset_guru' | 'master_stacker'
          awarded_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          asset_id: string
          user_id: string
          body: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          user_id: string
          body: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          user_id?: string
          body?: string
          created_at?: string
          updated_at?: string
        }
      }
      forum_posts: {
        Row: {
          id: string
          asset_id: string | null
          stack_id: string | null
          user_id: string
          title: string
          body: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          asset_id?: string | null
          stack_id?: string | null
          user_id: string
          title: string
          body: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          asset_id?: string | null
          stack_id?: string | null
          user_id?: string
          title?: string
          body?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 