export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          university: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          university?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          university?: string | null;
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          difficulty: number;
          weekly_hours: number;
          created_at: string;
          grading_weights: Json | null;
          exam_date: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          difficulty: number;
          weekly_hours: number;
          created_at?: string;
          grading_weights?: Json | null;
          exam_date?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          difficulty?: number;
          weekly_hours?: number;
          created_at?: string;
          grading_weights?: Json | null;
          exam_date?: string | null;
        };
      };
      assignments: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          due_date: string;
          weight: number;
          estimated_hours: number;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          due_date: string;
          weight: number;
          estimated_hours: number;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          due_date?: string;
          weight?: number;
          estimated_hours?: number;
          completed?: boolean;
          created_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          course_id: string | null;
          date: string;
          duration: number;
          topic: string | null;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string | null;
          date: string;
          duration: number;
          topic?: string | null;
          completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string | null;
          date?: string;
          duration?: number;
          topic?: string | null;
          completed?: boolean;
        };
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          question: string;
          answer: string;
          mastery_level: number;
          next_review: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question: string;
          answer: string;
          mastery_level?: number;
          next_review: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question?: string;
          answer?: string;
          mastery_level?: number;
          next_review?: string;
          created_at?: string;
        };
      };
      ai_usage: {
        Row: {
          id: string;
          user_id: string;
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tokens_used: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tokens_used?: number;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          status: string;
          plan: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          status: string;
          plan: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          status?: string;
          plan?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
