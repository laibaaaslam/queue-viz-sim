
export type QueueModel = "M/M/C" | "M/G/C" | "G/G/C";

export type Distribution = "Exponential" | "Gamma" | "Normal" | "Uniform";

export interface SimulationParams {
  arrivalMean: number;
  serviceMean: number;
  numberOfServers: number;
  priorityEnabled: boolean;
  arrivalDistribution: Distribution;
  serviceDistribution: Distribution;
  simulationTime: number;
  numberOfJobs: number;
}

export interface QueueMetrics {
  lq: number; // Average number of customers in queue
  ls: number; // Average number of customers in system
  wq: number; // Average waiting time in queue
  ws: number; // Average waiting time in system
  idleTime: number; // Server idle time
  utilizationTime: number; // Server utilization time
}

export interface SimulationMetrics {
  turnaroundTime: number[]; // Time from arrival to completion
  waitTime: number[]; // Time spent in queue
  responseTime: number[]; // Time from arrival to first service
  serviceTime: number[]; // Time spent in service
  arrivalTime: number[]; // Time of arrival
}

export interface Job {
  id: number;
  arrivalTime: number;
  serviceTime: number;
  priority: number;
  startTime: number | null;
  endTime: number | null;
  server: number | null;
}

export interface ServerActivity {
  server: number;
  jobs: {
    jobId: number;
    startTime: number;
    endTime: number;
    priority: number;
  }[];
}

export interface SimulationResults {
  queueMetrics: QueueMetrics;
  simulationMetrics: SimulationMetrics;
  serverActivity: ServerActivity[];
  jobs: Job[];
}
