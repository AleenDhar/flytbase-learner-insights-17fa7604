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
      assessment_attempts: {
        Row: {
          assessment_id: string | null
          attempt_number: number
          finished_at: string | null
          id: string
          score: number | null
          started_at: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          attempt_number: number
          finished_at?: string | null
          id?: string
          score?: number | null
          started_at?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          attempt_number?: number
          finished_at?: string | null
          id?: string
          score?: number | null
          started_at?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          category: string | null
          course_id: string
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          thumbnail: string | null
          time_limit: number | null
          title: string
        }
        Insert: {
          category?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          thumbnail?: string | null
          time_limit?: number | null
          title: string
        }
        Update: {
          category?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          thumbnail?: string | null
          time_limit?: number | null
          title?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          playlist_id: string | null
          thumbnail: string | null
          title: string
          video_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          playlist_id?: string | null
          thumbnail?: string | null
          title: string
          video_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          playlist_id?: string | null
          thumbnail?: string | null
          title?: string
          video_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          id: string
          is_correct: boolean
          option_text: string
          question_id: string | null
        }
        Insert: {
          id?: string
          is_correct: boolean
          option_text: string
          question_id?: string | null
        }
        Update: {
          id?: string
          is_correct?: boolean
          option_text?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          after_videoend: boolean | null
          assessment_id: string | null
          created_at: string
          difficulty: string | null
          id: string
          question_text: string
          question_type: string
          video_id: string | null
        }
        Insert: {
          after_videoend?: boolean | null
          assessment_id?: string | null
          created_at?: string
          difficulty?: string | null
          id?: string
          question_text: string
          question_type: string
          video_id?: string | null
        }
        Update: {
          after_videoend?: boolean | null
          assessment_id?: string | null
          created_at?: string
          difficulty?: string | null
          id?: string
          question_text?: string
          question_type?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          name: string
          quote: string
          rating: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          name: string
          quote: string
          rating?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          name?: string
          quote?: string
          rating?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          attempt_id: string | null
          created_at: string
          essay_text: string | null
          id: string
          question_id: string | null
          selected_option_id: string | null
        }
        Insert: {
          attempt_id?: string | null
          created_at?: string
          essay_text?: string | null
          id?: string
          question_id?: string | null
          selected_option_id?: string | null
        }
        Update: {
          attempt_id?: string | null
          created_at?: string
          essay_text?: string | null
          id?: string
          question_id?: string | null
          selected_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "assessment_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      user_courses: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          last_accessed_at: string | null
          progress: number
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          progress?: number
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          progress?: number
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_video_answers: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          question_id: string | null
          selected_option_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct: boolean
          question_id?: string | null
          selected_option_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string | null
          selected_option_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_video_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "video_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_video_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "video_question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      user_watchlist: {
        Row: {
          added_at: string
          course_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          course_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string
          course_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      video_question_options: {
        Row: {
          id: string
          is_correct: boolean
          option_text: string
          question_id: string | null
        }
        Insert: {
          id?: string
          is_correct: boolean
          option_text: string
          question_id?: string | null
        }
        Update: {
          id?: string
          is_correct?: boolean
          option_text?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "video_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      video_questions: {
        Row: {
          created_at: string
          id: string
          question_text: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_text: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_text?: string
          video_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          about: string | null
          course_id: string
          created_at: string
          for_whom: string | null
          id: string
          thumbnail: string | null
          title: string
          youtube_video_id: string | null
        }
        Insert: {
          about?: string | null
          course_id: string
          created_at?: string
          for_whom?: string | null
          id?: string
          thumbnail?: string | null
          title: string
          youtube_video_id?: string | null
        }
        Update: {
          about?: string | null
          course_id?: string
          created_at?: string
          for_whom?: string | null
          id?: string
          thumbnail?: string | null
          title?: string
          youtube_video_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
