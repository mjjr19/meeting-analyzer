"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function MeetingEvaluator() {
  const [formData, setFormData] = useState({
    duration: 30,
    participants: 5,
    speakers: 3,
    decisionMade: "No",
    agendaProvided: "No",
    followUpSent: "No",
  })

  const [result, setResult] = useState<{
    recommendation: string
    score: number
    submitted: boolean
  }>({
    recommendation: "",
    score: 0,
    submitted: false,
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock the prediction function from the Python script
    const calculateScore = () => {
      let score = 0

      // Key positive indicators
      if (formData.decisionMade === "Yes") score += 3
      if (formData.agendaProvided === "Yes") score += 2
      if (formData.followUpSent === "Yes") score += 1

      // Speaker engagement
      const speakerRatio = formData.speakers / formData.participants
      score += Math.min(speakerRatio * 2, 2)

      // Duration factor
      const durationFactor = formData.duration / 60
      if (formData.decisionMade === "No" && formData.duration > 60) {
        score -= durationFactor
      }

      // Apply coefficients from the model (simplified)
      score = score * 0.8 + (Math.random() * 0.4 - 0.2) // Add some randomness

      return score
    }

    const score = calculateScore()
    const recommendation = score < 0 ? "Make Asynchronous" : "Keep Meeting"

    setResult({
      recommendation,
      score,
      submitted: true,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluate a New Meeting</CardTitle>
        <CardDescription>
          Enter the details of your planned meeting to get a recommendation on whether it should be kept or made
          asynchronous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="180"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Number of Participants</Label>
              <Input
                id="participants"
                type="number"
                min="2"
                max="50"
                value={formData.participants}
                onChange={(e) => handleInputChange("participants", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speakers">Expected Speakers</Label>
              <Input
                id="speakers"
                type="number"
                min="1"
                max={formData.participants}
                value={formData.speakers}
                onChange={(e) => handleInputChange("speakers", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="decisionMade">Will Decisions Be Made?</Label>
              <Select value={formData.decisionMade} onValueChange={(value) => handleInputChange("decisionMade", value)}>
                <SelectTrigger id="decisionMade">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agendaProvided">Will an Agenda be Provided?</Label>
              <Select
                value={formData.agendaProvided}
                onValueChange={(value) => handleInputChange("agendaProvided", value)}
              >
                <SelectTrigger id="agendaProvided">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpSent">Will Follow-up be Sent?</Label>
              <Select value={formData.followUpSent} onValueChange={(value) => handleInputChange("followUpSent", value)}>
                <SelectTrigger id="followUpSent">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Evaluate Meeting
          </Button>
        </form>
      </CardContent>

      {result.submitted && (
        <CardFooter className="flex flex-col">
          <div className="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
            <div className="flex items-center gap-3 mb-2">
              {result.recommendation === "Keep Meeting" ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-amber-500" />
              )}
              <h3 className="text-lg font-semibold">Recommendation: {result.recommendation}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Usefulness Score: {result.score.toFixed(2)}
              {result.score >= 0
                ? " (Positive scores indicate the meeting is likely to be valuable)"
                : " (Negative scores suggest the meeting could be handled asynchronously)"}
            </p>
          </div>

          <div className="w-full">
            <h4 className="font-medium mb-2">Improvement Suggestions:</h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              {formData.decisionMade === "No" && <li>Include clear decision points in your meeting agenda</li>}
              {formData.agendaProvided === "No" && <li>Provide a detailed agenda in advance</li>}
              {formData.speakers / formData.participants < 0.5 && (
                <li>Consider reducing the number of participants or encouraging more active participation</li>
              )}
              {formData.followUpSent === "No" && <li>Plan to send follow-up notes with action items</li>}
              {formData.duration > 60 && formData.decisionMade === "No" && (
                <li>Shorten the meeting duration or ensure decisions will be made</li>
              )}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
