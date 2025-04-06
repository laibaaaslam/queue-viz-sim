
import { Distribution, Job, QueueMetrics, ServerActivity, SimulationMetrics, SimulationParams, SimulationResults } from "../types/queue";
import { generateRandom } from "./distributions";

class Simulator {
  private params: SimulationParams;
  private currentTime: number = 0;
  private jobs: Job[] = [];
  private queue: Job[] = [];
  private servers: (Job | null)[] = [];
  private completedJobs: Job[] = [];
  private nextJobId: number = 0;
  private serverActivity: ServerActivity[] = [];

  constructor(params: SimulationParams) {
    this.params = params;
    this.servers = new Array(params.numberOfServers).fill(null);
    
    // Initialize server activity tracking
    for (let i = 0; i < params.numberOfServers; i++) {
      this.serverActivity.push({
        server: i,
        jobs: []
      });
    }
  }

  private generateArrival(): number {
    return generateRandom(this.params.arrivalDistribution, this.params.arrivalMean);
  }

  private generateService(): number {
    return generateRandom(this.params.serviceDistribution, this.params.serviceMean);
  }

  private generateJobs(): void {
    let time = 0;
    for (let i = 0; i < this.params.numberOfJobs; i++) {
      const interarrivalTime = this.generateArrival();
      time += interarrivalTime;
      
      const job: Job = {
        id: this.nextJobId++,
        arrivalTime: time,
        serviceTime: this.generateService(),
        priority: this.params.priorityEnabled ? Math.floor(Math.random() * 3) + 1 : 1, // 1, 2, or 3 with 1 being highest priority
        startTime: null,
        endTime: null,
        server: null
      };
      
      this.jobs.push(job);
    }
  }

  private getNextEvent(): { type: 'arrival' | 'completion', time: number, job?: Job, serverIndex?: number } {
    // Find next job arrival
    const nextArrival = this.jobs.find(job => job.arrivalTime > this.currentTime && job.startTime === null);
    const arrivalTime = nextArrival ? nextArrival.arrivalTime : Infinity;
    
    // Find next job completion
    let earliestCompletion = Infinity;
    let completingServerIndex = -1;
    
    this.servers.forEach((job, index) => {
      if (job !== null && job.startTime !== null) {
        const completionTime = job.startTime + job.serviceTime;
        if (completionTime < earliestCompletion) {
          earliestCompletion = completionTime;
          completingServerIndex = index;
        }
      }
    });
    
    // Return the earliest event
    if (arrivalTime < earliestCompletion) {
      return { type: 'arrival', time: arrivalTime, job: nextArrival };
    } else if (completingServerIndex !== -1) {
      return { 
        type: 'completion', 
        time: earliestCompletion, 
        job: this.servers[completingServerIndex],
        serverIndex: completingServerIndex
      };
    }
    
    // No more events
    return { type: 'arrival', time: Infinity };
  }

  private processArrival(job: Job): void {
    // Update current time
    this.currentTime = job.arrivalTime;
    
    // Check if any server is available
    const availableServerIndex = this.servers.findIndex(s => s === null);
    
    if (availableServerIndex !== -1) {
      // Server is available, start service immediately
      job.startTime = this.currentTime;
      job.server = availableServerIndex;
      this.servers[availableServerIndex] = job;
      
      // Record server activity
      this.serverActivity[availableServerIndex].jobs.push({
        jobId: job.id,
        startTime: this.currentTime,
        endTime: this.currentTime + job.serviceTime,
        priority: job.priority
      });
    } else {
      // All servers busy, add to queue
      this.queue.push(job);
      
      // Sort queue by priority if enabled
      if (this.params.priorityEnabled) {
        this.queue.sort((a, b) => a.priority - b.priority);
      }
    }
  }

  private processCompletion(serverIndex: number): void {
    const job = this.servers[serverIndex];
    if (!job) return;
    
    // Update job completion details
    job.endTime = this.currentTime;
    
    // Add to completed jobs
    this.completedJobs.push(job);
    
    // Free the server
    this.servers[serverIndex] = null;
    
    // Check if there are jobs in queue
    if (this.queue.length > 0) {
      // Get next job from queue
      const nextJob = this.queue.shift();
      if (nextJob) {
        // Start service
        nextJob.startTime = this.currentTime;
        nextJob.server = serverIndex;
        this.servers[serverIndex] = nextJob;
        
        // Record server activity
        this.serverActivity[serverIndex].jobs.push({
          jobId: nextJob.id,
          startTime: this.currentTime,
          endTime: this.currentTime + nextJob.serviceTime,
          priority: nextJob.priority
        });
      }
    }
  }

  private calculateQueueMetrics(): QueueMetrics {
    const totalJobs = this.completedJobs.length;
    if (totalJobs === 0) {
      return {
        lq: 0,
        ls: 0,
        wq: 0,
        ws: 0,
        idleTime: 0,
        utilizationTime: 0
      };
    }
    
    // Calculate metrics
    let totalWaitTime = 0;
    let totalSystemTime = 0;
    
    for (const job of this.completedJobs) {
      if (job.startTime !== null && job.endTime !== null) {
        const waitTime = job.startTime - job.arrivalTime;
        const systemTime = job.endTime - job.arrivalTime;
        
        totalWaitTime += waitTime;
        totalSystemTime += systemTime;
      }
    }
    
    const simulationDuration = this.currentTime;
    const wq = totalWaitTime / totalJobs;
    const ws = totalSystemTime / totalJobs;
    
    // Little's Law: L = λW
    const arrivalRate = totalJobs / simulationDuration;
    const lq = arrivalRate * wq;
    const ls = arrivalRate * ws;
    
    // Calculate server utilization
    let totalServiceTime = 0;
    for (const job of this.completedJobs) {
      if (job.startTime !== null && job.endTime !== null) {
        totalServiceTime += job.serviceTime;
      }
    }
    
    const utilizationTime = totalServiceTime / (simulationDuration * this.params.numberOfServers);
    const idleTime = 1 - utilizationTime;
    
    return {
      lq,
      ls,
      wq,
      ws,
      idleTime,
      utilizationTime
    };
  }

  private calculateSimulationMetrics(): SimulationMetrics {
    const turnaroundTime: number[] = [];
    const waitTime: number[] = [];
    const responseTime: number[] = [];
    const serviceTime: number[] = [];
    const arrivalTime: number[] = [];
    
    for (const job of this.completedJobs) {
      if (job.startTime !== null && job.endTime !== null) {
        turnaroundTime.push(job.endTime - job.arrivalTime);
        waitTime.push(job.startTime - job.arrivalTime);
        responseTime.push(job.startTime - job.arrivalTime);
        serviceTime.push(job.serviceTime);
        arrivalTime.push(job.arrivalTime);
      }
    }
    
    return {
      turnaroundTime,
      waitTime,
      responseTime,
      serviceTime,
      arrivalTime
    };
  }

  public runSimulation(): SimulationResults {
    // Generate jobs
    this.generateJobs();
    
    // Sort jobs by arrival time
    this.jobs.sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    // Process events until no more events
    while (true) {
      const nextEvent = this.getNextEvent();
      
      if (nextEvent.time === Infinity) {
        break;
      }
      
      this.currentTime = nextEvent.time;
      
      if (nextEvent.type === 'arrival' && nextEvent.job) {
        this.processArrival(nextEvent.job);
      } else if (nextEvent.type === 'completion' && nextEvent.serverIndex !== undefined) {
        this.processCompletion(nextEvent.serverIndex);
      }
      
      // Optional: break if simulation time exceeded
      if (this.params.simulationTime > 0 && this.currentTime > this.params.simulationTime) {
        break;
      }
    }
    
    // Calculate metrics
    const queueMetrics = this.calculateQueueMetrics();
    const simulationMetrics = this.calculateSimulationMetrics();
    
    return {
      queueMetrics,
      simulationMetrics,
      serverActivity: this.serverActivity,
      jobs: this.completedJobs
    };
  }
}

export function runSimulation(params: SimulationParams): SimulationResults {
  const simulator = new Simulator(params);
  return simulator.runSimulation();
}
