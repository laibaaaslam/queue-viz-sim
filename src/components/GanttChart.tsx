
import { ServerActivity } from "@/types/queue";
import { useEffect, useRef } from "react";

interface GanttChartProps {
  serverActivity: ServerActivity[];
}

const GanttChart = ({ serverActivity }: GanttChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Define priority colors
  const priorityColors = {
    1: '#4361ee', // Highest priority - blue
    2: '#3f37c9', // Medium priority - purple
    3: '#4cc9f0'  // Low priority - light blue
  };

  useEffect(() => {
    if (!canvasRef.current || serverActivity.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Find the time range
    let minTime = Infinity;
    let maxTime = -Infinity;
    
    serverActivity.forEach(server => {
      server.jobs.forEach(job => {
        minTime = Math.min(minTime, job.startTime);
        maxTime = Math.max(maxTime, job.endTime);
      });
    });
    
    // Add padding
    minTime = Math.max(0, minTime - 1);
    maxTime = maxTime + 1;
    
    const timeRange = maxTime - minTime;
    const serverCount = serverActivity.length;
    
    // Define chart dimensions
    const barHeight = 30;
    const barPadding = 15;
    const leftPadding = 50;
    const topPadding = 30;
    
    // Adjust canvas size
    canvas.height = (barHeight + barPadding) * serverCount + topPadding * 2;
    canvas.width = 800;
    
    // Draw time axis
    const pixelsPerTimeUnit = (canvas.width - leftPadding - 20) / timeRange;
    
    // Draw time labels
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    const timeSteps = 10;
    for (let i = 0; i <= timeSteps; i++) {
      const time = minTime + (timeRange / timeSteps) * i;
      const x = leftPadding + (time - minTime) * pixelsPerTimeUnit;
      
      ctx.fillText(time.toFixed(1), x, 20);
      
      // Draw vertical grid line
      ctx.strokeStyle = '#ddd';
      ctx.beginPath();
      ctx.moveTo(x, topPadding);
      ctx.lineTo(x, canvas.height - 20);
      ctx.stroke();
    }
    
    // Draw server labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    serverActivity.forEach((server, index) => {
      const y = topPadding + (barHeight + barPadding) * index + barHeight / 2;
      ctx.fillText(`Server ${server.server + 1}`, leftPadding - 10, y);
    });
    
    // Draw server jobs
    serverActivity.forEach((server, serverIndex) => {
      server.jobs.forEach(job => {
        const x = leftPadding + (job.startTime - minTime) * pixelsPerTimeUnit;
        const width = (job.endTime - job.startTime) * pixelsPerTimeUnit;
        const y = topPadding + (barHeight + barPadding) * serverIndex;
        
        // Choose color based on priority
        const colorKey = job.priority as keyof typeof priorityColors;
        ctx.fillStyle = priorityColors[colorKey];
        
        // Draw job rectangle
        ctx.fillRect(x, y, width, barHeight);
        
        // Draw job ID
        if (width > 20) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`Job ${job.jobId}`, x + width / 2, y + barHeight / 2);
        }
      });
    });
    
    // Draw legend for priority
    const legendX = canvas.width - 150;
    const legendY = 20;
    
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    Object.entries(priorityColors).forEach(([priority, color], index) => {
      const y = legendY + index * 15;
      
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX, y - 5, 10, 10);
      
      // Draw text
      ctx.fillStyle = '#000';
      ctx.fillText(`Priority ${priority}`, legendX + 15, y);
    });
    
  }, [serverActivity]);
  
  return (
    <div className="relative w-full overflow-x-auto">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400}
        className="w-full"
      />
    </div>
  );
};

export default GanttChart;
