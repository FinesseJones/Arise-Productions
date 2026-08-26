// ==============================================================================
// ARISE PRODUCTION STUDIO - PERSISTENT AGENT MEMORY & CHAT DATABASE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026 • ALL RIGHTS RESERVED
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = process.env.DATA_DIR || (fs.existsSync('/app/data') ? '/app/data' : path.join(__dirname));
const CHAT_FILE = path.join(DB_DIR, 'agent_conversations.json');
const MEMORY_FILE = path.join(DB_DIR, 'studio_memory.json');

// Ensure database files exist
function ensureFiles() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHAT_FILE)) {
    fs.writeFileSync(CHAT_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
  if (!fs.existsSync(MEMORY_FILE)) {
    const defaultMemory = [
      {
        id: 'mem-core-1',
        category: 'Project Vision',
        title: 'Arise Production Studio Standards',
        content: 'Production pipeline adheres to Hollywood 10-Stage framework with real-time 4K 3D Soundstage, ACEScg color workflows, and 5.1 Atmos spatial audio standards.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'mem-core-2',
        category: 'Brand Identity',
        title: 'The AI Content Foundry Aesthetics',
        content: 'Dark cinematic tech-noir studio theme with golden amber, deep purple, and cyber magenta lighting palettes.',
        timestamp: new Date().toISOString(),
      }
    ];
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(defaultMemory, null, 2), 'utf8');
  }
}

ensureFiles();

function readJson(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
    return defaultValue;
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Error writing to ${filePath}:`, e);
  }
}

export const agentMemory = {
  // Get chat history for a specific agent and project
  getHistory(agentId, projectId = 'default') {
    const key = `${projectId}:${agentId}`;
    const allChats = readJson(CHAT_FILE, {});
    return allChats[key] || [];
  },

  // Append message to agent conversation
  addMessage(agentId, message, projectId = 'default') {
    const key = `${projectId}:${agentId}`;
    const allChats = readJson(CHAT_FILE, {});
    if (!allChats[key]) allChats[key] = [];

    const msgObj = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      role: message.role, // 'user' | 'assistant' | 'system'
      content: message.content,
      agentName: message.agentName || agentId,
      timestamp: new Date().toISOString(),
      metadata: message.metadata || {},
    };

    allChats[key].push(msgObj);
    // Keep max 100 messages per thread to prevent unbounded file growth
    if (allChats[key].length > 100) {
      allChats[key] = allChats[key].slice(-100);
    }

    writeJson(CHAT_FILE, allChats);
    return msgObj;
  },

  // Clear agent chat history
  clearHistory(agentId, projectId = 'default') {
    const key = `${projectId}:${agentId}`;
    const allChats = readJson(CHAT_FILE, {});
    delete allChats[key];
    writeJson(CHAT_FILE, allChats);
    return { success: true };
  },

  // Get all global studio memories / permanent notes
  getStudioMemories() {
    return readJson(MEMORY_FILE, []);
  },

  // Add a new memory item
  addStudioMemory(memoryItem) {
    const memories = readJson(MEMORY_FILE, []);
    const newMem = {
      id: memoryItem.id || `mem-${Date.now()}`,
      category: memoryItem.category || 'General Note',
      title: memoryItem.title || 'Studio Note',
      content: memoryItem.content,
      timestamp: new Date().toISOString(),
    };
    memories.unshift(newMem);
    writeJson(MEMORY_FILE, memories);
    return newMem;
  },

  // Delete a memory item
  deleteStudioMemory(id) {
    let memories = readJson(MEMORY_FILE, []);
    memories = memories.filter((m) => m.id !== id);
    writeJson(MEMORY_FILE, memories);
    return { success: true };
  },

  // Search relevant memories to inject into prompt context
  searchRelevantMemories(query = '') {
    const memories = readJson(MEMORY_FILE, []);
    if (!query) return memories.slice(0, 5);
    const q = query.toLowerCase();
    return memories.filter((m) =>
      m.title.toLowerCase().includes(q) ||
      m.content.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    ).slice(0, 8);
  },

  // Get full studio voice transcript history
  getVoiceTranscripts(projectId = 'default') {
    const TRANSCRIPTS_FILE = path.join(DB_DIR, 'voice_transcripts.json');
    const all = readJson(TRANSCRIPTS_FILE, {});
    return all[projectId] || [];
  },

  // Save a live microphone voice turn / conversation
  addVoiceTranscript(item, projectId = 'default') {
    const TRANSCRIPTS_FILE = path.join(DB_DIR, 'voice_transcripts.json');
    const all = readJson(TRANSCRIPTS_FILE, {});
    if (!all[projectId]) all[projectId] = [];

    const newRecord = {
      id: `vt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      speaker: item.speaker || 'User (Voice)',
      agentId: item.agentId || 'assistant',
      agentName: item.agentName || 'Arise Co-Pilot',
      userTranscript: item.userTranscript || '',
      agentReply: item.agentReply || '',
      room: item.room || 'General',
      timestamp: new Date().toISOString(),
    };

    all[projectId].unshift(newRecord);
    if (all[projectId].length > 200) {
      all[projectId] = all[projectId].slice(0, 200);
    }

    writeJson(TRANSCRIPTS_FILE, all);
    return newRecord;
  }
};
