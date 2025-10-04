import { api } from "encore.dev/api";
import db from "../db";
import type { ChatMessage } from "./chat";

export interface GetHistoryRequest {
  agentId: string;
}

export interface GetHistoryResponse {
  messages: ChatMessage[];
}

// Retrieves chat history for a specific agent.
export const getHistory = api<GetHistoryRequest, GetHistoryResponse>(
  { expose: true, method: "GET", path: "/agents/:agentId/history" },
  async (req) => {
    const rows = await db.queryAll<{
      id: number;
      agent_id: string;
      message: string;
      is_user: boolean;
      created_at: Date;
    }>`
      SELECT id, agent_id, message, is_user, created_at
      FROM chat_messages
      WHERE agent_id = ${req.agentId}
      ORDER BY created_at ASC
      LIMIT 100
    `;

    const messages: ChatMessage[] = rows.map((row) => ({
      id: row.id,
      agentId: row.agent_id,
      message: row.message,
      isUser: row.is_user,
      createdAt: row.created_at,
    }));

    return { messages };
  }
);
