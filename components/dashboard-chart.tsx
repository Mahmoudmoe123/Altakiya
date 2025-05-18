"use client"

import { useState } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartLine,
  ChartBar,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"


//Sample data , will replace later with api
const monthlyData = [
  { month: "Jan", donations: 1200, donors: 10 },
  { month: "Feb", donations: 1800, donors: 15 },
  { month: "Mar", donations: 2400, donors: 20 },
  { month: "Apr", donations: 3600, donors: 30 },
  { month: "May", donations: 2700, donors: 22 },
  { month: "Jun", donations: 3000, donors: 25 },
]

const weeklyData = [
  { week: "Week 1", donations: 800, donors: 7 },
  { week: "Week 2", donations: 1200, donors: 10 },
  { week: "Week 3", donations: 900, donors: 8 },
  { week: "Week 4", donations: 1500, donors: 12 },
]

export default function DashboardChart() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("monthly")

  const data = timeframe === "monthly" ? monthlyData : weeklyData
  const xKey = timeframe === "monthly" ? "month" : "week"

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant={timeframe === "weekly" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeframe("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={timeframe === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeframe("monthly")}
        >
          Monthly
        </Button>
      </div>

      <ChartContainer height={300} data={data} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <ChartLegend>
          <ChartLegendItem name="donations" color="#f59e0b" />
          <ChartLegendItem name="donors" color="#3b82f6" />
        </ChartLegend>
        <ChartGrid vertical horizontal />
        <ChartXAxis dataKey={xKey} />
        <ChartYAxis />
        <ChartBar dataKey="donations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <ChartLine dataKey="donors" stroke="#3b82f6" strokeWidth={2} />
      </ChartContainer>
    </div>
  )
}
