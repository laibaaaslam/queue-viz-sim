
import SimulationModal from "@/components/SimulationModal";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-queue-primary">Queue Visualization Simulator</h1>
        <p className="text-xl text-gray-600 mb-8">
          Explore different queuing models with interactive simulations.
        </p>
        <div className="mb-8">
          <SimulationModal />
        </div>
        <div className="text-left mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-queue-secondary">About Queuing Theory</h2>
          <p className="mb-4">
            Queuing theory is the mathematical study of waiting lines, or queues. In this application,
            you can simulate and analyze different queuing models:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>M/M/C Model:</strong> Markovian arrivals, Markovian service times, C servers 
              (exponential distributions for both)
            </li>
            <li>
              <strong>M/G/C Model:</strong> Markovian arrivals, General service time distribution, C servers
            </li>
            <li>
              <strong>G/G/C Model:</strong> General arrival distribution, General service time distribution, C servers
            </li>
          </ul>
          <p>
            The simulator calculates important metrics such as average queue length, average wait time,
            server utilization, and more. You can also enable priority-based simulations to see how
            prioritization affects system performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
