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
      attendees: {
        Row: {
          created_at: string
          id: number
          name: string | null
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
      presentations: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          id: number
          qr_code: string | null
          speaker_id: number
          start_time: string
          title: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: number
          qr_code?: string | null
          speaker_id: number
          start_time?: string
          title: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: number
          qr_code?: string | null
          speaker_id?: number
          start_time?: string
          title?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentations_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      question_answer_hints: {
        Row: {
          content: string
          id: number
          question_id: number
          uuid: string
        }
        Insert: {
          content: string
          id?: number
          question_id: number
          uuid?: string
        }
        Update: {
          content?: string
          id?: number
          question_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_answer_hints_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answered: boolean | null
          attendee_id: number
          content: string
          created_at: string
          id: number
          presentation_id: number
          updated_at: string
          uuid: string
        }
        Insert: {
          answered?: boolean | null
          attendee_id: number
          content: string
          created_at?: string
          id?: number
          presentation_id: number
          updated_at?: string
          uuid?: string
        }
        Update: {
          answered?: boolean | null
          attendee_id?: number
          content?: string
          created_at?: string
          id?: number
          presentation_id?: number
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations"
            referencedColumns: ["id"]
          },
        ]
      }
      speakers: {
        Row: {
          created_at: string
          email: string
          id: number
          name: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          name: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          name?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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

