import { ProductCard } from "./product-card"

async function getRelatedProducts(currentProductId: string, category: string) {
  // Mock related products - replace with actual API call
  return [
    {
      id: "2",
      name: "SmartLock Elite",
      description: "Keyless entry smart lock with fingerprint and app control",
      price: 199.99,
      originalPrice: 249.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Smart Locks",
      rating: 4.9,
      reviews: 89,
      featured: true,
      inStock: true,
    },
    {
      id: "3",
      name: "Guardian Alarm System",
      description: "Complete home security system with 24/7 monitoring",
      price: 499.99,
      originalPrice: 599.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Alarm Systems",
      rating: 4.7,
      reviews: 156,
      featured: true,
      inStock: true,
    },
    {
      id: "4",
      name: "Motion Sensor Pro",
      description: "Advanced motion detection with smartphone alerts",
      price: 79.99,
      originalPrice: 99.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Sensors",
      rating: 4.6,
      reviews: 67,
      featured: true,
      inStock: true,
    },
    {
      id: "5",
      name: "Video Doorbell HD",
      description: "Smart doorbell with HD video and two-way audio",
      price: 149.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Doorbells",
      rating: 4.5,
      reviews: 92,
      featured: false,
      inStock: true,
    },
  ].filter((product) => product.id !== currentProductId)
}

export async function RelatedProducts({
  currentProductId,
  category,
}: {
  currentProductId: string
  category: string
}) {
  const relatedProducts = await getRelatedProducts(currentProductId, category)

  return (
    <section className="container mx-auto px-4 py-16 bg-slate-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">You Might Also Like</h2>
        <p className="text-muted-foreground">
          Discover more security solutions to complete your home protection system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
