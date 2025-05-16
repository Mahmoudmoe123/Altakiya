"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

const campaignFormSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters.",
    })
    .max(2000, {
      message: "Description must not exceed 2000 characters.",
    }),
  longDescription: z
    .string()
    .min(50, {
      message: "Long description must be at least 50 characters.",
    })
    .max(5000, {
      message: "Long description must not exceed 5000 characters.",
    }),
  goal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Goal must be a positive number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  endDate: z
    .date({
      required_error: "End date is required.",
    })
    .refine((date) => date > new Date(), {
      message: "End date must be in the future.",
    }),
})

type CampaignFormValues = z.infer<typeof campaignFormSchema>

export default function CampaignForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const supabase = createClient()
  const { toast } = useToast()

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      goal: "",
      category: "",
      location: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newFiles])

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data: CampaignFormValues) {
    setIsSubmitting(true)

    try {
      // Create campaign in Supabase
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          title: data.title,
          description: data.description,
          long_description: data.longDescription,
          goal: Number.parseFloat(data.goal),
          location: data.location,
          category: data.category,
          end_date: data.endDate.toISOString(),
          user_id: userId,
        })
        .select()
        .single()

      if (campaignError) {
        throw new Error(campaignError.message)
      }

      // Upload images to Supabase Storage
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          const fileExt = file.name.split(".").pop()
          const fileName = `${uuidv4()}.${fileExt}`
          const filePath = `campaign-images/${campaign.id}/${fileName}`

          // Upload image
          const { error: uploadError } = await supabase.storage.from("campaign-images").upload(filePath, file)

          if (uploadError) {
            console.error("Error uploading image:", uploadError)
            continue
          }

          // Get public URL
          const { data: publicUrl } = supabase.storage.from("campaign-images").getPublicUrl(filePath)

          // Save image reference in database
          const { error: imageError } = await supabase.from("campaign_images").insert({
            campaign_id: campaign.id,
            image_url: publicUrl.publicUrl,
            is_primary: i === 0, // First image is primary
          })

          if (imageError) {
            console.error("Error saving image reference:", imageError)
          }
        }
      }

      toast({
        title: "Campaign created!",
        description: "Your campaign has been created successfully.",
      })

      // Redirect to the dashboard
      router.push(`/dashboard/campaigns?success=true`)
      router.refresh()
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Error",
        description: "An error occurred while creating your campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a clear, descriptive title" {...field} />
                    </FormControl>
                    <FormDescription>This is the name that will appear on your campaign page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your community kitchen initiative, its goals, and impact"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief summary of your community kitchen (this will appear in campaign cards).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed information about your community kitchen, who it serves, and how the funds will be used"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This detailed description will appear on your campaign page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Campaign Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="5000" {...field} />
                      </FormControl>
                      <FormDescription>Set a realistic funding goal for your campaign.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Campaign End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Your campaign will automatically end on this date.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectItem value="homeless-support">Homeless Support</SelectItem>
                          <SelectItem value="food-pantry">Food Pantry</SelectItem>
                          <SelectItem value="senior-support">Senior Support</SelectItem>
                          <SelectItem value="children-programs">Children's Programs</SelectItem>
                          <SelectItem value="community-gardens">Community Gardens</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the category that best describes your campaign.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormDescription>Enter the location of your community kitchen.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Campaign Images</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Campaign image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}

                {previewUrls.length < 5 && (
                  <div className="aspect-video flex items-center justify-center border border-dashed rounded-md p-4">
                    <label className="cursor-pointer text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm font-medium">Upload Image</span>
                        <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                )}
              </div>

              <FormDescription>
                Upload up to 5 high-quality images that showcase your community kitchen. Include photos of your space,
                volunteers, and the people you serve.
              </FormDescription>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
