
import SimulationModal from "@/components/SimulationModal";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="w-full py-12 px-6 md:px-12 lg:px-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-queue-primary bg-clip-text text-transparent bg-gradient-to-r from-queue-primary to-queue-accent">
          Queue Visualization Simulator
        </h1>
        <p className="text-xl text-gray-600 mt-4 text-center max-w-2xl mx-auto">
          Explore different queuing models with interactive simulations
        </p>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-24">
            <SimulationModal />
            <p className="text-gray-500 text-sm mt-4">
              Click above to configure and run queue simulations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-queue-accent/20">
              <CardContent className="pt-8 p-8">
                <h2 className="text-2xl font-semibold mb-6 text-queue-secondary">About Queuing Theory</h2>
                <p className="text-gray-600 mb-4 text-lg">
                  Queuing theory is the mathematical study of waiting lines, or queues. It provides models to predict queue lengths and waiting times.
                </p>
                <p className="text-gray-600 text-lg">
                  These models help organizations optimize resource allocation, improve customer satisfaction, and reduce operational costs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-queue-accent/20">
              <CardContent className="pt-8 p-8">
                <h2 className="text-2xl font-semibold mb-6 text-queue-secondary">Available Models</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-queue-primary/10 text-queue-primary p-2 rounded mr-3">
                      <span className="font-mono font-medium">M/M/C</span>
                    </div>
                    <span className="text-gray-600 text-lg">Markovian arrivals, Markovian service times, C servers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-queue-primary/10 text-queue-primary p-2 rounded mr-3">
                      <span className="font-mono font-medium">M/G/C</span>
                    </div>
                    <span className="text-gray-600 text-lg">Markovian arrivals, General service time distribution, C servers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-queue-primary/10 text-queue-primary p-2 rounded mr-3">
                      <span className="font-mono font-medium">G/G/C</span>
                    </div>
                    <span className="text-gray-600 text-lg">General arrival distribution, General service time distribution, C servers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-8 px-4 text-center text-gray-500 text-sm">
        <p>Queue Visualization Simulator © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
