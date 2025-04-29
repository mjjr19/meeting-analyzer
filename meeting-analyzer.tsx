"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { useMemo } from "react"

export default function MeetingAnalyzer() {
  // Mock data based on the Python script results
  const modelStats = {
    r2: 0.78,
    rmse: 1.24,
    totalMeetings: 120,
    recommendAsync: 42,
    keepScheduled: 78,
  }

  const featureImportance = [
    { name: "Decision_Made_Numeric", value: 3.2 },
    { name: "Agenda_Provided_Numeric", value: 1.8 },
    { name: "Actual_Speakers", value: 1.5 },
    { name: "Follow_Up_Sent_Numeric", value: 0.9 },
    { name: "Participants", value: -0.4 },
    { name: "Duration_Minutes", value: -0.7 },
  ]

  // Generate mock data for actual vs predicted scatter plot
  const scatterData = useMemo(() => {
    return Array.from({ length: 50 }, () => {
      const actual = Math.random() * 8 - 4
      // Add some noise to create realistic scatter
      const predicted = actual + (Math.random() - 0.5) * 2
      return { actual, predicted }
    })
  }, [])

  // Comparison metrics between meetings to keep vs make async
  const comparisonData = {
    keep: {
      Duration_Minutes: 45.2,
      Participants: 6.8,
      Actual_Speakers: 5.3,
      Decision_Made_Numeric: 0.82,
      Agenda_Provided_Numeric: 0.91,
      Follow_Up_Sent_Numeric: 0.76,
    },
    async: {
      Duration_Minutes: 62.7,
      Participants: 9.4,
      Actual_Speakers: 3.1,
      Decision_Made_Numeric: 0.24,
      Agenda_Provided_Numeric: 0.38,
      Follow_Up_Sent_Numeric: 0.31,
    },
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>Accuracy metrics for the meeting usefulness prediction model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">R-squared (accuracy)</span>
                  <span className="text-sm font-medium">{modelStats.r2.toFixed(2)}</span>
                </div>
                <Progress value={modelStats.r2 * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">RMSE (error)</span>
                  <span className="text-sm font-medium">{modelStats.rmse.toFixed(2)}</span>
                </div>
                <Progress value={100 - (modelStats.rmse / 5) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Recommendations</CardTitle>
            <CardDescription>Analysis of which meetings should be kept or made asynchronous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Keep as scheduled</span>
                  <span className="text-sm font-medium">
                    {modelStats.keepScheduled} (
                    {((modelStats.keepScheduled / modelStats.totalMeetings) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(modelStats.keepScheduled / modelStats.totalMeetings) * 100}
                  className="h-2 bg-gray-200"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Recommend async</span>
                  <span className="text-sm font-medium">
                    {modelStats.recommendAsync} (
                    {((modelStats.recommendAsync / modelStats.totalMeetings) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(modelStats.recommendAsync / modelStats.totalMeetings) * 100}
                  className="h-2 bg-gray-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Importance</CardTitle>
          <CardDescription>Impact of different factors on meeting usefulness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={150} />
                <Tooltip formatter={(value) => [value.toFixed(2), "Impact"]} />
                <Bar dataKey="value" fill={(entry) => (entry.value > 0 ? "#10b981" : "#ef4444")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actual vs. Predicted Usefulness</CardTitle>
          <CardDescription>Comparison of actual meeting usefulness scores with model predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="actual" name="Actual Score" domain={[-4, 4]} />
                <YAxis type="number" dataKey="predicted" name="Predicted Score" domain={[-4, 4]} />
                <ZAxis range={[60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Meetings" data={scatterData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Characteristics Comparison</CardTitle>
          <CardDescription>Average values for meetings recommended to keep vs. make asynchronous</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Metric</th>
                  <th className="text-right py-2 px-4">Keep Meetings</th>
                  <th className="text-right py-2 px-4">Async Meetings</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(comparisonData.keep).map((metric) => (
                  <tr key={metric} className="border-b">
                    <td className="py-2 px-4">{metric.replace("_Numeric", "")}</td>
                    <td className="text-right py-2 px-4">{comparisonData.keep[metric].toFixed(2)}</td>
                    <td className="text-right py-2 px-4">{comparisonData.async[metric].toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
