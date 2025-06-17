import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ClientDashboard } from "@/components/client/client-dashboard"

export default async function ClientDashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ClientDashboard />
      </main>
      <Footer />
    </div>
  )
}
