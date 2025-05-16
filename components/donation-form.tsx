"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

const donationFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  customAmount: z.string().optional(),
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().optional(),
  anonymous: z.boolean().default(false),
  coverFees: z.boolean().default(true),
})

type DonationFormValues = z.infer<typeof donationFormSchema>

export default function DonationForm({
  campaignId,
  campaignTitle,
}: {
  campaignId: string
  campaignTitle: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("25")
  const [isCustomAmount, setIsCustomAmount] = useState(false)

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "25",
      customAmount: "",
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      anonymous: false,
      coverFees: true,
    },
  })

  const handleAmountChange = (value: string) => {
    setSelectedAmount(value)
    setIsCustomAmount(value === "custom")
    form.setValue("amount", value === "custom" ? form.getValues("customAmount") : value)
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("customAmount", e.target.value)
    if (isCustomAmount) {
      form.setValue("amount", e.target.value)
    }
  }

  async function onSubmit(data: DonationFormValues) {
    setIsSubmitting(true)

    try {
      // In a real application, you would process the payment and submit the donation data to your API
      console.log("Donation data:", data)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to the thank you page
      router.push(`/campaigns/${campaignId}/donate/thank-you`)
    } catch (error) {
      console.error("Error processing donation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate processing fee (typically 2.9% + $0.30 for credit card transactions)
  const calculateFee = (amount: number) => {
    return amount * 0.029 + 0.3
  }

  const donationAmount = Number.parseFloat(isCustomAmount ? form.watch("customAmount") || "0" : selectedAmount)
  const processingFee = calculateFee(donationAmount)
  const totalAmount = form.watch("coverFees") ? donationAmount + processingFee : donationAmount

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Donation Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={handleAmountChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      {["25", "50", "100", "250", "500", "custom"].map((amount) => (
                        <div key={amount}>
                          <RadioGroupItem value={amount} id={`amount-${amount}`} className="peer sr-only" />
                          <Label
                            htmlFor={`amount-${amount}`}
                            className="flex h-14 items-center justify-center rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            {amount === "custom" ? "Custom" : `$${amount}`}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {isCustomAmount && (
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="customAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enter Custom Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <Input
                                  type="number"
                                  min="1"
                                  step="1"
                                  placeholder="Enter amount"
                                  className="pl-8"
                                  {...field}
                                  onChange={handleCustomAmountChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              <FormField
                control={form.control}
                name="coverFees"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Cover transaction fees</FormLabel>
                      <FormDescription>
                        Add ${processingFee.toFixed(2)} to cover payment processing fees so the campaign receives your
                        full donation.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between text-sm mb-2">
                <span>Donation:</span>
                <span>${donationAmount.toFixed(2)}</span>
              </div>
              {form.watch("coverFees") && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Processing Fee:</span>
                  <span>${processingFee.toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormDescription>We'll send your donation receipt to this email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Leave a message of support" className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Your message will be displayed on the campaign page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this donation anonymous</FormLabel>
                      <FormDescription>Your name will not be displayed publicly on the campaign page.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 5678 9012 3456" />
                  </FormControl>
                </FormItem>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <Input placeholder="123" />
                  </FormControl>
                </FormItem>
              </div>

              <FormDescription>
                Your payment information is securely processed. We do not store your credit card details.
              </FormDescription>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Donating to: <span className="font-medium">{campaignTitle}</span>
            </div>
            <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Processing..." : `Donate $${totalAmount.toFixed(2)}`}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={`${className} cursor-pointer`} {...props} />
}
