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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admissions: {
        Row: {
          admission_code: string
          admission_date: string
          admission_reason: string
          advance_payment: number | null
          bed_id: string
          created_at: string
          discharge_date: string | null
          discharge_summary: string | null
          doctor_id: string
          id: string
          patient_id: string
          status: Database["public"]["Enums"]["admission_status"]
          updated_at: string
          ward_id: string
        }
        Insert: {
          admission_code: string
          admission_date?: string
          admission_reason: string
          advance_payment?: number | null
          bed_id: string
          created_at?: string
          discharge_date?: string | null
          discharge_summary?: string | null
          doctor_id: string
          id?: string
          patient_id: string
          status?: Database["public"]["Enums"]["admission_status"]
          updated_at?: string
          ward_id: string
        }
        Update: {
          admission_code?: string
          admission_date?: string
          admission_reason?: string
          advance_payment?: number | null
          bed_id?: string
          created_at?: string
          discharge_date?: string | null
          discharge_summary?: string | null
          doctor_id?: string
          id?: string
          patient_id?: string
          status?: Database["public"]["Enums"]["admission_status"]
          updated_at?: string
          ward_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admissions_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      beds: {
        Row: {
          bed_number: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["bed_status"]
          updated_at: string
          ward_id: string
        }
        Insert: {
          bed_number: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
          ward_id: string
        }
        Update: {
          bed_number?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
          ward_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "beds_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_items: {
        Row: {
          admission_id: string
          category: Database["public"]["Enums"]["billing_category"]
          created_at: string
          description: string
          id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          admission_id: string
          category: Database["public"]["Enums"]["billing_category"]
          created_at?: string
          description: string
          id?: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          admission_id?: string
          category?: Database["public"]["Enums"]["billing_category"]
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_items_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_assignments: {
        Row: {
          admission_id: string
          assigned_at: string
          doctor_id: string
          id: string
          notes: string | null
          unassigned_at: string | null
        }
        Insert: {
          admission_id: string
          assigned_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          unassigned_at?: string | null
        }
        Update: {
          admission_id?: string
          assigned_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          unassigned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_assignments_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_assignments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          doctor_code: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          specialization: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          doctor_code: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          specialization: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          doctor_code?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          specialization?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lab_orders: {
        Row: {
          admission_id: string
          created_at: string
          id: string
          lab_test_id: string
          notes: string | null
          ordered_by: string
          result: string | null
          result_date: string | null
          status: Database["public"]["Enums"]["lab_order_status"]
          updated_at: string
        }
        Insert: {
          admission_id: string
          created_at?: string
          id?: string
          lab_test_id: string
          notes?: string | null
          ordered_by: string
          result?: string | null
          result_date?: string | null
          status?: Database["public"]["Enums"]["lab_order_status"]
          updated_at?: string
        }
        Update: {
          admission_id?: string
          created_at?: string
          id?: string
          lab_test_id?: string
          notes?: string | null
          ordered_by?: string
          result?: string | null
          result_date?: string | null
          status?: Database["public"]["Enums"]["lab_order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_lab_test_id_fkey"
            columns: ["lab_test_id"]
            isOneToOne: false
            referencedRelation: "lab_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_tests: {
        Row: {
          category: string | null
          created_at: string
          id: string
          test_code: string
          test_name: string
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          test_code: string
          test_name: string
          unit_price?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          test_code?: string
          test_name?: string
          unit_price?: number
        }
        Relationships: []
      }
      medication_orders: {
        Row: {
          admission_id: string
          created_at: string
          dosage: string
          duration: string
          frequency: string
          id: string
          medication_id: string
          notes: string | null
          ordered_by: string
          status: Database["public"]["Enums"]["medication_order_status"]
          updated_at: string
        }
        Insert: {
          admission_id: string
          created_at?: string
          dosage: string
          duration: string
          frequency: string
          id?: string
          medication_id: string
          notes?: string | null
          ordered_by: string
          status?: Database["public"]["Enums"]["medication_order_status"]
          updated_at?: string
        }
        Update: {
          admission_id?: string
          created_at?: string
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          medication_id?: string
          notes?: string | null
          ordered_by?: string
          status?: Database["public"]["Enums"]["medication_order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_orders_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_orders_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          category: string | null
          created_at: string
          generic_name: string | null
          id: string
          name: string
          unit: string
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          generic_name?: string | null
          id?: string
          name: string
          unit?: string
          unit_price?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          generic_name?: string | null
          id?: string
          name?: string
          unit?: string
          unit_price?: number
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          patient_code: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          patient_code: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          patient_code?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          admission_id: string
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          receipt_number: string | null
        }
        Insert: {
          admission_id: string
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          receipt_number?: string | null
        }
        Update: {
          admission_id?: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          receipt_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress_notes: {
        Row: {
          admission_id: string
          author_id: string
          author_name: string
          author_role: string
          created_at: string
          id: string
          note: string
        }
        Insert: {
          admission_id: string
          author_id: string
          author_name: string
          author_role: string
          created_at?: string
          id?: string
          note: string
        }
        Update: {
          admission_id?: string
          author_id?: string
          author_name?: string
          author_role?: string
          created_at?: string
          id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_notes_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wards: {
        Row: {
          created_at: string
          floor: number
          id: string
          is_active: boolean
          name: string
          rate_per_day: number
          total_beds: number
          updated_at: string
          ward_type: string
        }
        Insert: {
          created_at?: string
          floor?: number
          id?: string
          is_active?: boolean
          name: string
          rate_per_day?: number
          total_beds?: number
          updated_at?: string
          ward_type: string
        }
        Update: {
          created_at?: string
          floor?: number
          id?: string
          is_active?: boolean
          name?: string
          rate_per_day?: number
          total_beds?: number
          updated_at?: string
          ward_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      admission_status: "Admitted" | "Discharged" | "Transferred"
      app_role: "admin" | "doctor" | "nurse" | "billing"
      bed_status: "Available" | "Occupied" | "Maintenance"
      billing_category:
        | "Room"
        | "Procedure"
        | "Medication"
        | "Lab"
        | "Consultation"
        | "Other"
      lab_order_status: "Pending" | "In Progress" | "Completed" | "Cancelled"
      medication_order_status: "Active" | "Stopped" | "Completed"
      payment_method: "Cash" | "Card" | "Insurance" | "UPI" | "Bank Transfer"
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
    Enums: {
      admission_status: ["Admitted", "Discharged", "Transferred"],
      app_role: ["admin", "doctor", "nurse", "billing"],
      bed_status: ["Available", "Occupied", "Maintenance"],
      billing_category: [
        "Room",
        "Procedure",
        "Medication",
        "Lab",
        "Consultation",
        "Other",
      ],
      lab_order_status: ["Pending", "In Progress", "Completed", "Cancelled"],
      medication_order_status: ["Active", "Stopped", "Completed"],
      payment_method: ["Cash", "Card", "Insurance", "UPI", "Bank Transfer"],
    },
  },
} as const
