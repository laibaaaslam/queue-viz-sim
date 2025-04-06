
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QueueModel, SimulationParams, SimulationResults } from "@/types/queue";
import { runSimulation } from "@/utils/simulator";
import ResultsDisplay from "./ResultsDisplay";
import { BarChart3, Play } from "lucide-react";

const SimulationModal = () => {
  const [selectedModel, setSelectedModel] = useState<QueueModel>("M/M/C");
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    arrivalMean: 1,
    serviceMean: 0.8,
    numberOfServers: 3,
    priorityEnabled: false,
    arrivalDistribution: "Exponential",
    serviceDistribution: "Exponential",
    simulationTime: 0,
    numberOfJobs: 100
  });
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleParamChange = (key: keyof SimulationParams, value: any) => {
    setSimulationParams((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNumberInputChange = (key: keyof SimulationParams, value: string) => {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue) && numberValue > 0) {
      handleParamChange(key, numberValue);
    }
  };

  const runSimulationHandler = () => {
    setIsRunning(true);
    
    // Update arrival and service distributions based on model
    let params = { ...simulationParams };
    
    if (selectedModel === "M/M/C") {
      params.arrivalDistribution = "Exponential";
      params.serviceDistribution = "Exponential";
    } else if (selectedModel === "M/G/C") {
      params.arrivalDistribution = "Exponential";
    }
    
    // Run simulation asynchronously
    setTimeout(() => {
      try {
        const results = runSimulation(params);
        setResults(results);
      } catch (error) {
        console.error("Simulation error:", error);
      } finally {
        setIsRunning(false);
      }
    }, 10);
  };

  const resetSimulation = () => {
    setResults(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-to-r from-queue-primary to-queue-secondary hover:opacity-90 text-white shadow-md">
          <BarChart3 className="mr-2 h-5 w-5" />
          Launch Queuing Simulator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="bg-gradient-to-r from-queue-primary to-queue-secondary text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <BarChart3 className="mr-2 h-6 w-6" />
            Queuing Theory Simulator
          </DialogTitle>
          <DialogDescription className="text-white/90">
            Configure parameters and run simulations for different queuing models
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          {!results ? (
            <div className="space-y-6">
              <Tabs 
                defaultValue="M/M/C" 
                onValueChange={(value) => setSelectedModel(value as QueueModel)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-6 w-full">
                  <TabsTrigger value="M/M/C">M/M/C Model</TabsTrigger>
                  <TabsTrigger value="M/G/C">M/G/C Model</TabsTrigger>
                  <TabsTrigger value="G/G/C">G/G/C Model</TabsTrigger>
                </TabsList>

                <TabsContent value="M/M/C" className="space-y-4">
                  <Card className="p-6 shadow-sm border-queue-accent/20">
                    <div className="mb-5">
                      <h3 className="text-lg font-medium text-queue-primary mb-2">M/M/C Model</h3>
                      <p className="text-gray-600">
                        Uses exponential distributions for both arrival and service times.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="arrivalMean" className="text-sm font-medium">Arrival Mean (λ)</Label>
                        <Input
                          id="arrivalMean"
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={simulationParams.arrivalMean}
                          onChange={(e) => handleNumberInputChange("arrivalMean", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Average number of arrivals per unit time</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="serviceMean" className="text-sm font-medium">Service Mean (µ)</Label>
                        <Input
                          id="serviceMean"
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={simulationParams.serviceMean}
                          onChange={(e) => handleNumberInputChange("serviceMean", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Average number of customers served per unit time</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="numberOfServers" className="text-sm font-medium">Number of Servers (c)</Label>
                        <Input
                          id="numberOfServers"
                          type="number"
                          min="1"
                          value={simulationParams.numberOfServers}
                          onChange={(e) => handleNumberInputChange("numberOfServers", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Number of parallel service channels</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="numberOfJobs" className="text-sm font-medium">Number of Jobs</Label>
                        <Input
                          id="numberOfJobs"
                          type="number"
                          min="10"
                          value={simulationParams.numberOfJobs}
                          onChange={(e) => handleNumberInputChange("numberOfJobs", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Total number of jobs to simulate</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-6 p-4 bg-gray-50 rounded-md">
                      <Switch
                        id="priorityEnabled"
                        checked={simulationParams.priorityEnabled}
                        onCheckedChange={(checked) => handleParamChange("priorityEnabled", checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="priorityEnabled" className="text-sm font-medium">Enable Priority-Based Simulation</Label>
                        <p className="text-xs text-gray-500">Jobs will be assigned priority levels and served accordingly</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="M/G/C" className="space-y-4">
                  <Card className="p-6 shadow-sm border-queue-accent/20">
                    <div className="mb-5">
                      <h3 className="text-lg font-medium text-queue-primary mb-2">M/G/C Model</h3>
                      <p className="text-gray-600">
                        Uses an exponential distribution for arrival times and a general distribution for service times.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="arrivalMean" className="text-sm font-medium">Arrival Mean (λ)</Label>
                        <Input
                          id="arrivalMean"
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={simulationParams.arrivalMean}
                          onChange={(e) => handleNumberInputChange("arrivalMean", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Average number of arrivals per unit time</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="serviceMean" className="text-sm font-medium">Service Mean (µ)</Label>
                        <Input
                          id="serviceMean"
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={simulationParams.serviceMean}
                          onChange={(e) => handleNumberInputChange("serviceMean", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Average number of customers served per unit time</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="numberOfServers" className="text-sm font-medium">Number of Servers (c)</Label>
                        <Input
                          id="numberOfServers"
                          type="number"
                          min="1"
                          value={simulationParams.numberOfServers}
                          onChange={(e) => handleNumberInputChange("numberOfServers", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Number of parallel service channels</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="serviceDistribution" className="text-sm font-medium">Service Distribution</Label>
                        <Select 
                          value={simulationParams.serviceDistribution}
                          onValueChange={(value) => handleParamChange("serviceDistribution", value)}
                        >
                          <SelectTrigger className="focus-visible:ring-queue-primary">
                            <SelectValue placeholder="Service Distribution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gamma">Gamma</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Uniform">Uniform</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Statistical distribution for service times</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="numberOfJobs" className="text-sm font-medium">Number of Jobs</Label>
                        <Input
                          id="numberOfJobs"
                          type="number"
                          min="10"
                          value={simulationParams.numberOfJobs}
                          onChange={(e) => handleNumberInputChange("numberOfJobs", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Total number of jobs to simulate</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-6 p-4 bg-gray-50 rounded-md">
                      <Switch
                        id="priorityEnabled"
                        checked={simulationParams.priorityEnabled}
                        onCheckedChange={(checked) => handleParamChange("priorityEnabled", checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="priorityEnabled" className="text-sm font-medium">Enable Priority-Based Simulation</Label>
                        <p className="text-xs text-gray-500">Jobs will be assigned priority levels and served accordingly</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="G/G/C" className="space-y-4">
                  <Card className="p-6 shadow-sm border-queue-accent/20">
                    <div className="mb-5">
                      <h3 className="text-lg font-medium text-queue-primary mb-2">G/G/C Model</h3>
                      <p className="text-gray-600">
                        Uses general distributions for both arrival and service times.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="arrivalMean" className="text-sm font-medium">Arrival Mean (λ)</Label>
                        <Input
                          id="arrivalMean"
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={simulationParams.arrivalMean}
                          onChange={(e) => handleNumberInputChange("arrivalMean", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Average number of arrivals per unit time</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="serviceMean" className="text-sm font-medium">Service Mean (µ)</Label>
                        <Input
                          id="serviceMean"
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={simulationParams.serviceMean}
                          onChange={(e) => handleNumberInputChange("serviceMean", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Average number of customers served per unit time</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="arrivalDistribution" className="text-sm font-medium">Arrival Distribution</Label>
                        <Select 
                          value={simulationParams.arrivalDistribution}
                          onValueChange={(value) => handleParamChange("arrivalDistribution", value)}
                        >
                          <SelectTrigger className="focus-visible:ring-queue-primary">
                            <SelectValue placeholder="Arrival Distribution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gamma">Gamma</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Uniform">Uniform</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Statistical distribution for arrival times</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="serviceDistribution" className="text-sm font-medium">Service Distribution</Label>
                        <Select 
                          value={simulationParams.serviceDistribution}
                          onValueChange={(value) => handleParamChange("serviceDistribution", value)}
                        >
                          <SelectTrigger className="focus-visible:ring-queue-primary">
                            <SelectValue placeholder="Service Distribution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gamma">Gamma</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Uniform">Uniform</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Statistical distribution for service times</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="numberOfServers" className="text-sm font-medium">Number of Servers (c)</Label>
                        <Input
                          id="numberOfServers"
                          type="number"
                          min="1"
                          value={simulationParams.numberOfServers}
                          onChange={(e) => handleNumberInputChange("numberOfServers", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Number of parallel service channels</p>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="numberOfJobs" className="text-sm font-medium">Number of Jobs</Label>
                        <Input
                          id="numberOfJobs"
                          type="number"
                          min="10"
                          value={simulationParams.numberOfJobs}
                          onChange={(e) => handleNumberInputChange("numberOfJobs", e.target.value)}
                          className="focus-visible:ring-queue-primary"
                        />
                        <p className="text-xs text-gray-500">Total number of jobs to simulate</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-6 p-4 bg-gray-50 rounded-md">
                      <Switch
                        id="priorityEnabled"
                        checked={simulationParams.priorityEnabled}
                        onCheckedChange={(checked) => handleParamChange("priorityEnabled", checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="priorityEnabled" className="text-sm font-medium">Enable Priority-Based Simulation</Label>
                        <p className="text-xs text-gray-500">Jobs will be assigned priority levels and served accordingly</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end pt-4">
                <Button 
                  className="bg-gradient-to-r from-queue-primary to-queue-secondary hover:opacity-90 text-white"
                  onClick={runSimulationHandler}
                  disabled={isRunning}
                  size="lg"
                >
                  {isRunning ? (
                    <>Running Simulation...</>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Simulation
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ResultsDisplay results={results} modelType={selectedModel} />
              
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetSimulation}
                >
                  Back to Parameters
                </Button>
                <Button 
                  className="bg-gradient-to-r from-queue-primary to-queue-secondary hover:opacity-90 text-white"
                  onClick={runSimulationHandler}
                  disabled={isRunning}
                >
                  {isRunning ? "Running..." : "Run New Simulation"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimulationModal;
