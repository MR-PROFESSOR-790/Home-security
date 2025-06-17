import { AddProductForm } from "@/components/admin/add-product-form"

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product in your inventory</p>
      </div>
      <AddProductForm />
    </div>
  )
}
