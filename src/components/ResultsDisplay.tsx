
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, Rectangle
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QueueModel, SimulationResults } from "@/types/queue";
import GanttChart from "./GanttChart";

interface ResultsDisplayProps {
  results: SimulationResults;
  modelType: QueueModel;
}

const ResultsDisplay = ({ results, modelType }: ResultsDisplayProps) => {
  const { queueMetrics, simulationMetrics, serverActivity } = results;

  // Prepare data for wait time distribution chart
  const prepareWaitTimeData = () => {
    const waitTimes = simulationMetrics.waitTime.sort((a, b) => a - b);
    const bucketSize = Math.ceil(waitTimes.length / 10);
    
    const data = [];
    for (let i = 0; i < waitTimes.length; i += bucketSize) {
      const slice = waitTimes.slice(i, i + bucketSize);
      const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      data.push({
        name: `Job ${i}-${Math.min(i + bucketSize - 1, waitTimes.length - 1)}`,
        waitTime: parseFloat(avg.toFixed(3))
      });
    }
    return data;
  };

  // Prepare data for service time distribution chart
  const prepareServiceTimeData = () => {
    const serviceTimes = simulationMetrics.serviceTime.sort((a, b) => a - b);
    const bucketSize = Math.ceil(serviceTimes.length / 10);
    
    const data = [];
    for (let i = 0; i < serviceTimes.length; i += bucketSize) {
      const slice = serviceTimes.slice(i, i + bucketSize);
      const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      data.push({
        name: `Job ${i}-${Math.min(i + bucketSize - 1, serviceTimes.length - 1)}`,
        serviceTime: parseFloat(avg.toFixed(3))
      });
    }
    return data;
  };

  // Calculate average metrics
  const calculateAverage = (arr: number[]) => {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  };

  const avgTurnaroundTime = parseFloat(calculateAverage(simulationMetrics.turnaroundTime).toFixed(4));
  const avgWaitTime = parseFloat(calculateAverage(simulationMetrics.waitTime).toFixed(4));
  const avgResponseTime = parseFloat(calculateAverage(simulationMetrics.responseTime).toFixed(4));
  const avgServiceTime = parseFloat(calculateAverage(simulationMetrics.serviceTime).toFixed(4));

  // Format queue metrics
  const formattedQueueMetrics = {
    lq: parseFloat(queueMetrics.lq.toFixed(4)),
    ls: parseFloat(queueMetrics.ls.toFixed(4)),
    wq: parseFloat(queueMetrics.wq.toFixed(4)),
    ws: parseFloat(queueMetrics.ws.toFixed(4)),
    idleTime: parseFloat((queueMetrics.idleTime * 100).toFixed(2)),
    utilizationTime: parseFloat((queueMetrics.utilizationTime * 100).toFixed(2))
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-queue-primary">
        Simulation Results for {modelType} Model
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Queue Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Lq (Avg. in Queue):</span>
                  <span className="font-semibold">{formattedQueueMetrics.lq}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Ls (Avg. in System):</span>
                  <span className="font-semibold">{formattedQueueMetrics.ls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Wq (Avg. Queue Time):</span>
                  <span className="font-semibold">{formattedQueueMetrics.wq}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Ws (Avg. System Time):</span>
                  <span className="font-semibold">{formattedQueueMetrics.ws}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Idle Time:</span>
                  <span className="font-semibold">{formattedQueueMetrics.idleTime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Utilization:</span>
                  <span className="font-semibold">{formattedQueueMetrics.utilizationTime}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simulation Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Avg. Turnaround Time:</span>
                  <span className="font-semibold">{avgTurnaroundTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Avg. Wait Time:</span>
                  <span className="font-semibold">{avgWaitTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Avg. Response Time:</span>
                  <span className="font-semibold">{avgResponseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Avg. Service Time:</span>
                  <span className="font-semibold">{avgServiceTime}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="waitTime" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="waitTime">Wait Time Chart</TabsTrigger>
          <TabsTrigger value="serviceTime">Service Time Chart</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="waitTime">
          <Card>
            <CardHeader>
              <CardTitle>Wait Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareWaitTimeData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="waitTime" 
                      name="Wait Time"
                      stroke="#4361ee" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serviceTime">
          <Card>
            <CardHeader>
              <CardTitle>Service Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareServiceTimeData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="serviceTime" 
                      name="Service Time" 
                      fill="#3f37c9"
                      activeBar={<Rectangle fill="#4cc9f0" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gantt">
          <Card>
            <CardHeader>
              <CardTitle>Server Activity (Gantt Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              <GanttChart serverActivity={serverActivity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDisplay;
