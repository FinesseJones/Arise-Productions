import { api } from "encore.dev/api";
import db from "../db";

export interface ChatRequest {
  agentId: string;
  message: string;
}

export interface ChatMessage {
  id: number;
  agentId: string;
  message: string;
  isUser: boolean;
  createdAt: Date;
}

export interface ChatResponse {
  message: ChatMessage;
  reply: ChatMessage;
}

// Sends a message to an AI agent and receives a response.
export const chat = api<ChatRequest, ChatResponse>(
  { expose: true, method: "POST", path: "/agents/:agentId/chat" },
  async (req) => {
    // Save user message
    const userMessage = await db.queryRow<{
      id: number;
      agent_id: string;
      message: string;
      is_user: boolean;
      created_at: Date;
    }>`
      INSERT INTO chat_messages (agent_id, message, is_user)
      VALUES (${req.agentId}, ${req.message}, true)
      RETURNING id, agent_id, message, is_user, created_at
    `;

    if (!userMessage) {
      throw new Error("Failed to save user message");
    }

    // Generate AI response based on agent specialization
    const aiResponse = generateAgentResponse(req.agentId, req.message);

    // Save AI response
    const agentMessage = await db.queryRow<{
      id: number;
      agent_id: string;
      message: string;
      is_user: boolean;
      created_at: Date;
    }>`
      INSERT INTO chat_messages (agent_id, message, is_user)
      VALUES (${req.agentId}, ${aiResponse}, false)
      RETURNING id, agent_id, message, is_user, created_at
    `;

    if (!agentMessage) {
      throw new Error("Failed to save agent message");
    }

    return {
      message: {
        id: userMessage.id,
        agentId: userMessage.agent_id,
        message: userMessage.message,
        isUser: userMessage.is_user,
        createdAt: userMessage.created_at,
      },
      reply: {
        id: agentMessage.id,
        agentId: agentMessage.agent_id,
        message: agentMessage.message,
        isUser: agentMessage.is_user,
        createdAt: agentMessage.created_at,
      },
    };
  }
);

function generateAgentResponse(agentId: string, userMessage: string): string {
  const responses: Record<string, string[]> = {
    screenwriting: [
      "I can help you develop that story arc. Let's start by identifying your protagonist's core motivation and the obstacles they'll face.",
      "Interesting concept! For the dialogue, consider how each character's voice should be distinct. What's their background and personality?",
      "Let's structure this using the three-act format. In Act I, we need to establish the ordinary world and the inciting incident.",
      "Character development is key here. What internal conflict will drive your protagonist's transformation?",
    ],
    storyboard: [
      "For this scene, I recommend starting with a wide establishing shot, then cutting to medium shots for dialogue. The visual flow should guide the viewer's eye.",
      "Consider the rule of thirds for composition. Placing key elements off-center creates more dynamic and engaging frames.",
      "The shot sequence you described would work better with a POV shot to build tension. Let me sketch out the camera angles.",
      "Visual continuity is important here. Make sure the eye-line matches and screen direction stays consistent across cuts.",
    ],
    "video-editor": [
      "The pacing feels right, but we could tighten the middle section by 10-15 seconds. Let's trim some reaction shots without losing emotional impact.",
      "I suggest a J-cut here where the audio from the next scene starts before the visual transition. It'll create smoother flow.",
      "This montage sequence needs rhythm. Let's edit on the beat of the music to create energy and drive the narrative forward.",
      "The rough cut looks strong. For the final polish, we should focus on color continuity and audio levels across all scenes.",
    ],
    "audio-engineer": [
      "The dialogue is clear, but adding subtle room tone will make it feel more natural. I'll also boost the low frequencies slightly for warmth.",
      "For this action sequence, layering multiple sound effects will create depth. Let's add impact sounds, foley, and ambient noise.",
      "The music choice works, but it's competing with the dialogue. I recommend ducking the music 6-8dB during speaking parts.",
      "Sound design can elevate this scene. Adding atmospheric elements like wind, distant traffic, or room ambience will make it immersive.",
    ],
    "vfx-specialist": [
      "For this VFX shot, we'll need clean plates and tracking markers. The CGI element should be rendered at 4K with multiple passes for compositing.",
      "Motion tracking looks good, but we need to add motion blur to match the camera movement. It'll help blend the CGI seamlessly.",
      "I can create a particle system for this effect. What mood are you going for? Magical, sci-fi, or more grounded and realistic?",
      "The green screen key is clean. Now let's work on edge refinement and color matching to integrate the subject with the background plate.",
    ],
    "color-grading": [
      "The overall look is good, but let's push the shadows a bit cooler and warm up the highlights. It'll create nice separation and depth.",
      "For this cinematic look, I recommend a teal and orange color grade. It's popular for a reason - it creates pleasing skin tones and contrast.",
      "The skin tones need some correction. We're seeing too much magenta. Let's adjust the hue slightly toward yellow-orange.",
      "Creating a custom LUT for this project will ensure consistency across all scenes. What's the mood you're targeting?",
    ],
    "project-manager": [
      "Based on your timeline, we're on track for phase one. However, I recommend building in a 15% buffer for post-production revisions.",
      "The budget allocation looks solid. Just note that VFX typically runs over, so I'd suggest keeping 20% of the budget as contingency.",
      "Let's schedule a milestone review every two weeks. This keeps the team aligned and allows us to catch any issues early.",
      "Resource-wise, you'll need the audio engineer for 5 days in post. I'll coordinate with their schedule and block the time.",
    ],
    "marketing-expert": [
      "Your target audience aligns well with YouTube and Instagram. I recommend creating 15-second teaser cuts optimized for vertical viewing.",
      "The trailer needs a strong hook in the first 3 seconds. On social platforms, you lose 50% of viewers if you don't grab attention immediately.",
      "Based on trending topics in your genre, I suggest launching during the third week of the month when platform engagement peaks.",
      "Let's build a content calendar. Pre-release: behind-the-scenes content. Launch week: trailer and key art. Post-release: user engagement and community building.",
    ],
  };

  const agentResponses = responses[agentId] || [
    "I'm here to help with your project! Tell me more about what you're working on.",
  ];

  // Return a contextual response
  const randomIndex = Math.floor(Math.random() * agentResponses.length);
  return agentResponses[randomIndex];
}
