import { Suspense } from "react"
import { Hero } from "@/components/home/hero"
import { FeaturedProducts } from "@/components/home/featured-products"
import { Features } from "@/components/home/features"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ChatWidget } from "@/components/chat/chat-widget"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedProducts />
        </Suspense>
        <Features />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
