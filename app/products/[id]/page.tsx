import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductDetails } from "@/components/products/product-details"
import { ProductReviews } from "@/components/products/product-reviews"
import { RelatedProducts } from "@/components/products/related-products"

async function getProduct(id: string) {
  // Mock product data - replace with actual API call
  const products = [
    {
      id: "1",
      name: "SecureCam Pro 4K",
      description:
        "Professional 4K security camera with night vision and AI detection. Perfect for monitoring your home or business with crystal-clear video quality and intelligent motion detection.",
      price: 299.99,
      originalPrice: 399.99,
      image: "/placeholder.svg?height=600&width=600",
      images: [
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
      ],
      category: "Cameras",
      brand: "SecureHome",
      rating: 4.8,
      reviews: 124,
      featured: true,
      inStock: true,
      stock: 15,
      features: [
        "4K Ultra HD Resolution",
        "Night Vision up to 100ft",
        "AI-Powered Motion Detection",
        "Weatherproof IP66 Rating",
        "Two-Way Audio",
        "Cloud & Local Storage",
        "Mobile App Control",
        "Easy Installation",
      ],
      specifications: {
        "Video Resolution": "4K (3840x2160) @ 30fps",
        "Night Vision": "Up to 100ft with IR LEDs",
        "Field of View": "110° diagonal",
        Storage: "Cloud storage & MicroSD up to 256GB",
        Connectivity: "WiFi 802.11 b/g/n, Ethernet",
        Power: "PoE or DC 12V/2A adapter",
        "Operating Temperature": "-20°C to 50°C",
        Dimensions: "3.5 × 3.5 × 6.2 inches",
        Weight: "1.2 lbs",
        Warranty: "2 years",
      },
      longDescription: `
        The SecureCam Pro 4K represents the pinnacle of home security technology. With its ultra-high-definition 4K resolution, you'll capture every detail with stunning clarity, day or night. The advanced AI-powered motion detection system intelligently distinguishes between people, vehicles, and animals, reducing false alerts while ensuring you never miss important events.

        Built to withstand the elements, this camera features an IP66 weatherproof rating, making it perfect for both indoor and outdoor installations. The infrared night vision extends up to 100 feet, providing clear visibility even in complete darkness.

        Installation is straightforward with our comprehensive mounting kit and step-by-step mobile app guidance. The camera supports both Power over Ethernet (PoE) and traditional power adapter connections, giving you flexibility in placement and setup.
      `,
    },
  ]

  return products.find((p) => p.id === id)
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetails product={product} />
        <ProductReviews productId={product.id} />
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </main>
      <Footer />
    </div>
  )
}
