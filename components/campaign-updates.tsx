import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Update {
  id: string
  date: string
  title: string
  content: string
}

export default function CampaignUpdates({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No updates yet</h3>
        <p className="text-gray-500">The campaign organizer hasn't posted any updates yet. Check back later!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {updates.map((update) => (
        <Card key={update.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{update.title}</CardTitle>
              <div className="text-sm text-gray-500">{format(new Date(update.date), "MMMM d, yyyy")}</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{update.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
