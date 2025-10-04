import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";
import AgentCard from "./AgentCard";

export default function AITeam() {
  const { data: agentsData } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => backend.agent.list(),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {agentsData?.agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
