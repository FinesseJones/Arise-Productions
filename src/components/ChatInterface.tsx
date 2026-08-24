import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import backend from "~backend/client";
import type { AIAgent } from "~backend/agent/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ChatInterfaceProps {
  agent: AIAgent;
  onBack: () => void;
}

export default function ChatInterface({ agent, onBack }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: historyData, refetch } = useQuery({
    queryKey: ["chat-history", agent.id],
    queryFn: async () => backend.agent.getHistory({ agentId: agent.id }),
  });

  const chatMutation = useMutation({
    mutationFn: async (msg: string) =>
      backend.agent.chat({ agentId: agent.id, message: msg }),
    onSuccess: () => {
      refetch();
      setMessage("");
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    chatMutation.mutate(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historyData?.messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-foreground hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{agent.name}</h2>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 p-4 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
        {historyData?.messages && historyData.messages.length > 0 ? (
          <div className="space-y-4">
            {historyData.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.isUser
                      ? "bg-gradient-to-r from-gold-500 to-purple-600 text-white"
                      : "bg-slate-700/50 text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                Start a conversation with {agent.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Ask questions about {agent.description.toLowerCase()}
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${agent.name}...`}
          disabled={chatMutation.isPending}
          className="bg-slate-800 border-slate-700 text-foreground"
        />
        <Button
          type="submit"
          disabled={chatMutation.isPending || !message.trim()}
          className="bg-gradient-to-r from-gold-500 to-purple-600 hover:from-gold-600 hover:to-purple-700 text-white"
        >
          {chatMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
