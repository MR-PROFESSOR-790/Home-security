"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  compareAtPrice: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }),
  brand: z.string().min(2, { message: "Brand must be at least 2 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.string().optional(),
  specifications: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

const categories = [
  "Security Cameras",
  "Smart Locks",
  "Alarm Systems",
  "Motion Sensors",
  "Video Doorbells",
  "Safes",
  "Home Automation",
  "Surveillance Kits",
]

export function AddProductForm() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      compareAtPrice: 0,
      stock: 0,
      sku: "",
      brand: "",
      category: "",
      featured: false,
      isActive: true,
      tags: "",
      specifications: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newFiles])

      // Create preview URLs
      const newUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true)

      // Create FormData to handle file uploads
      const formData = new FormData()

      // Append product data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      // Append tags as array
      if (data.tags) {
        const tagsArray = data.tags.split(",").map((tag) => tag.trim())
        formData.delete("tags")
        formData.append("tags", JSON.stringify(tagsArray))
      }

      // Append specifications as object
      if (data.specifications) {
        try {
          const specs = JSON.parse(data.specifications)
          formData.delete("specifications")
          formData.append("specifications", JSON.stringify(specs))
        } catch (e) {
          // If not valid JSON, treat as text
          console.warn("Specifications not valid JSON, treating as text")
        }
      }

      // Append images
      images.forEach((image) => {
        formData.append("images", image)
      })

      // Get token from localStorage
      const token = localStorage.getItem("token")

      // Send request to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create product")
      }

      toast({
        title: "Product Created",
        description: "Your product has been created successfully.",
      })

      // Redirect to products page
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter product description" className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare At Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>Original price for sale items</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Stock keeping unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Product brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tags separated by commas" {...field} />
                  </FormControl>
                  <FormDescription>Example: wireless, outdoor, night-vision</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter as JSON: {"resolution": "1080p", "wireless": true}'
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter as JSON or leave blank</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <FormLabel>Product Images</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center border border-dashed rounded-md aspect-square cursor-pointer hover:bg-muted/50">
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add Image</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                  <FormDescription>Upload product images. First image will be the main image.</FormDescription>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div>
                        <FormLabel>Featured Product</FormLabel>
                        <FormDescription>Display this product on the homepage</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div>
                        <FormLabel>Active</FormLabel>
                        <FormDescription>Product will be visible to customers</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
