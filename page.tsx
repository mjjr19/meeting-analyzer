import MeetingAnalyzer from "@/components/meeting-analyzer"
import MeetingEvaluator from "@/components/meeting-evaluator"
import { Tabs, TabsContent, TabsItem, TabsList } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Meeting Effectiveness Analyzer</h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Analyze meeting effectiveness and get recommendations on which meetings could be handled asynchronously.
      </p>

      <Tabs defaultValue="analyzer" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsItem value="analyzer">Model Results</TabsItem>
          <TabsItem value="evaluator">Evaluate New Meeting</TabsItem>
        </TabsList>
        <TabsContent value="analyzer" className="mt-6">
          <MeetingAnalyzer />
        </TabsContent>
        <TabsContent value="evaluator" className="mt-6">
          <MeetingEvaluator />
        </TabsContent>
      </Tabs>
    </main>
  )
}
