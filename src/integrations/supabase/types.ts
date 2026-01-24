export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          contact_number: string
          created_at: string
          email: string
          id: string
          membership: string | null
          message: string | null
          name: string
          preferred_date: string
          preferred_time: string
          status: string
          updated_at: string
        }
        Insert: {
          contact_number: string
          created_at?: string
          email: string
          id?: string
          membership?: string | null
          message?: string | null
          name: string
          preferred_date: string
          preferred_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          contact_number?: string
          created_at?: string
          email?: string
          id?: string
          membership?: string | null
          message?: string | null
          name?: string
          preferred_date?: string
          preferred_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          amount_paid: number | null
          created_at: string
          email: string
          id: string
          is_walk_in: boolean
          membership_expiry_date: string | null
          membership_start_date: string
          membership_type: string
          name: string
          payment_method: string | null
          payment_status: string
          phone: string | null
          referral_code: string | null
          referral_count: number
          referred_by: string | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_receipt_url: string | null
          updated_at: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          email: string
          id?: string
          is_walk_in?: boolean
          membership_expiry_date?: string | null
          membership_start_date?: string
          membership_type?: string
          name: string
          payment_method?: string | null
          payment_status?: string
          phone?: string | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          email?: string
          id?: string
          is_walk_in?: boolean
          membership_expiry_date?: string | null
          membership_start_date?: string
          membership_type?: string
          name?: string
          payment_method?: string | null
          payment_status?: string
          phone?: string | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patient_records: {
        Row: {
          age: number | null
          booking_id: string | null
          contact_number: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          gender: string | null
          id: string
          medical_records: Json | null
          membership: string | null
          membership_expiry_date: string | null
          membership_join_date: string | null
          membership_status: string | null
          message: string | null
          name: string
          notes: string | null
          preferred_date: string | null
          preferred_time: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          booking_id?: string | null
          contact_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          gender?: string | null
          id?: string
          medical_records?: Json | null
          membership?: string | null
          membership_expiry_date?: string | null
          membership_join_date?: string | null
          membership_status?: string | null
          message?: string | null
          name: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          booking_id?: string | null
          contact_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          gender?: string | null
          id?: string
          medical_records?: Json | null
          membership?: string | null
          membership_expiry_date?: string | null
          membership_join_date?: string | null
          membership_status?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          member_id: string | null
          payment_method: string | null
          status: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          member_id?: string | null
          payment_method?: string | null
          status?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          member_id?: string | null
          payment_method?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_member"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
