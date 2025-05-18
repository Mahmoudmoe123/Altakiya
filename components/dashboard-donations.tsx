import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye } from "lucide-react"

//will replace this with data from the api later
const donations = [
  {
    id: "1",
    campaignId: "2",
    campaignTitle: "Omdurman Thawrat Kitchen",
    amount: 250,
    date: "2023-05-02",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "2",
    campaignId: "1",
    campaignTitle: "Bahri community kitchen",
    amount: 100,
    date: "2023-04-15",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "3",
    campaignId: "3",
    campaignTitle: "Khartoum community Kitchen",
    amount: 500,
    date: "2023-03-22",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "4",
    campaignId: "1",
    campaignTitle: " Omdurman Hospital Funding ",
    amount: 75,
    date: "2023-02-10",
    status: "completed",
    receiptUrl: "#",
  },
  {
    id: "5",
    campaignId: "2",
    campaignTitle: "Khartoum Electricity Funding",
    amount: 150,
    date: "2023-01-05",
    status: "completed",
    receiptUrl: "#",
  },
]

export default function DashboardDonations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Donations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{format(new Date(donation.date), "MMM d, yyyy")}</TableCell>
                <TableCell>{donation.campaignTitle}</TableCell>
                <TableCell>${donation.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {donation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download Receipt</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
