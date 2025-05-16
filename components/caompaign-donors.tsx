import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface Donor {
  id: string
  name: string
  amount: number
  date: string
  message?: string
}

export default function CampaignDonors({ donors }: { donors: Donor[] }) {
  if (donors.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No donations yet</h3>
        <p className="text-gray-500">Be the first to support this campaign!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {donors.map((donor) => (
        <Card key={donor.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{donor.name}</div>
                    <div className="text-sm text-gray-500">{format(new Date(donor.date), "MMMM d, yyyy")}</div>
                  </div>
                  <div className="font-semibold text-amber-600">${donor.amount.toLocaleString()}</div>
                </div>
                {donor.message && <div className="mt-2 text-gray-600">{donor.message}</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
