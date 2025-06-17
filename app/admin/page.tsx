"use client"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  )
}
