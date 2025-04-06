
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QueueModel, SimulationParams, SimulationResults } from "@/types/queue";
import { runSimulation } from "@/utils/simulator";
import ResultsDisplay from "./ResultsDisplay";

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
        <Button className="bg-queue-primary hover:bg-queue-secondary">Queuing Simulator</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-queue-primary">
            Queuing Theory Simulator
          </DialogTitle>
        </DialogHeader>
        
        {!results ? (
          <div className="space-y-6">
            <Tabs defaultValue="M/M/C" onValueChange={(value) => setSelectedModel(value as QueueModel)}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="M/M/C">M/M/C Model</TabsTrigger>
                <TabsTrigger value="M/G/C">M/G/C Model</TabsTrigger>
                <TabsTrigger value="G/G/C">G/G/C Model</TabsTrigger>
              </TabsList>

              <TabsContent value="M/M/C" className="space-y-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    The M/M/C model uses exponential distributions for both arrival and service times.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="arrivalMean">Arrival Mean (λ)</Label>
                      <Input
                        id="arrivalMean"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={simulationParams.arrivalMean}
                        onChange={(e) => handleNumberInputChange("arrivalMean", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceMean">Service Mean (µ)</Label>
                      <Input
                        id="serviceMean"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={simulationParams.serviceMean}
                        onChange={(e) => handleNumberInputChange("serviceMean", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfServers">Number of Servers (c)</Label>
                      <Input
                        id="numberOfServers"
                        type="number"
                        min="1"
                        value={simulationParams.numberOfServers}
                        onChange={(e) => handleNumberInputChange("numberOfServers", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfJobs">Number of Jobs</Label>
                      <Input
                        id="numberOfJobs"
                        type="number"
                        min="10"
                        value={simulationParams.numberOfJobs}
                        onChange={(e) => handleNumberInputChange("numberOfJobs", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="priorityEnabled"
                      checked={simulationParams.priorityEnabled}
                      onCheckedChange={(checked) => handleParamChange("priorityEnabled", checked)}
                    />
                    <Label htmlFor="priorityEnabled">Enable Priority-Based Simulation</Label>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="M/G/C" className="space-y-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    The M/G/C model uses an exponential distribution for arrival times and a general distribution for service times.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="arrivalMean">Arrival Mean (λ)</Label>
                      <Input
                        id="arrivalMean"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={simulationParams.arrivalMean}
                        onChange={(e) => handleNumberInputChange("arrivalMean", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceMean">Service Mean (µ)</Label>
                      <Input
                        id="serviceMean"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={simulationParams.serviceMean}
                        onChange={(e) => handleNumberInputChange("serviceMean", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfServers">Number of Servers (c)</Label>
                      <Input
                        id="numberOfServers"
                        type="number"
                        min="1"
                        value={simulationParams.numberOfServers}
                        onChange={(e) => handleNumberInputChange("numberOfServers", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceDistribution">Service Distribution</Label>
                      <Select 
                        value={simulationParams.serviceDistribution}
                        onValueChange={(value) => handleParamChange("serviceDistribution", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Service Distribution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gamma">Gamma</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Uniform">Uniform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfJobs">Number of Jobs</Label>
                      <Input
                        id="numberOfJobs"
                        type="number"
                        min="10"
                        value={simulationParams.numberOfJobs}
                        onChange={(e) => handleNumberInputChange("numberOfJobs", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="priorityEnabled"
                        checked={simulationParams.priorityEnabled}
                        onCheckedChange={(checked) => handleParamChange("priorityEnabled", checked)}
                      />
                      <Label htmlFor="priorityEnabled">Enable Priority-Based Simulation</Label>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="G/G/C" className="space-y-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    The G/G/C model uses general distributions for both arrival and service times.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="arrivalMean">Arrival Mean (λ)</Label>
                      <Input
                        id="arrivalMean"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={simulationParams.arrivalMean}
                        onChange={(e) => handleNumberInputChange("arrivalMean", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceMean">Service Mean (µ)</Label>
                      <Input
                        id="serviceMean"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={simulationParams.serviceMean}
                        onChange={(e) => handleNumberInputChange("serviceMean", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="arrivalDistribution">Arrival Distribution</Label>
                      <Select 
                        value={simulationParams.arrivalDistribution}
                        onValueChange={(value) => handleParamChange("arrivalDistribution", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Arrival Distribution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gamma">Gamma</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Uniform">Uniform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceDistribution">Service Distribution</Label>
                      <Select 
                        value={simulationParams.serviceDistribution}
                        onValueChange={(value) => handleParamChange("serviceDistribution", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Service Distribution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gamma">Gamma</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Uniform">Uniform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfServers">Number of Servers (c)</Label>
                      <Input
                        id="numberOfServers"
                        type="number"
                        min="1"
                        value={simulationParams.numberOfServers}
                        onChange={(e) => handleNumberInputChange("numberOfServers", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfJobs">Number of Jobs</Label>
                      <Input
                        id="numberOfJobs"
                        type="number"
                        min="10"
                        value={simulationParams.numberOfJobs}
                        onChange={(e) => handleNumberInputChange("numberOfJobs", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="priorityEnabled"
                      checked={simulationParams.priorityEnabled}
                      onCheckedChange={(checked) => handleParamChange("priorityEnabled", checked)}
                    />
                    <Label htmlFor="priorityEnabled">Enable Priority-Based Simulation</Label>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button 
                className="bg-queue-primary hover:bg-queue-secondary" 
                onClick={runSimulationHandler}
                disabled={isRunning}
              >
                {isRunning ? "Running Simulation..." : "Run Simulation"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultsDisplay results={results} modelType={selectedModel} />
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={resetSimulation}
                className="mr-2"
              >
                Back to Parameters
              </Button>
              <Button 
                className="bg-queue-primary hover:bg-queue-secondary" 
                onClick={runSimulationHandler}
                disabled={isRunning}
              >
                Run New Simulation
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SimulationModal;
