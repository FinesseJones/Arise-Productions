// ============================================
// UNREAL ENGINE BRIDGE PREPARATION
// Save as: frontend/src/modules/unreal-bridge/casting-bridge.ts
// ============================================

/**
 * Bridge module for sending casting data to Unreal Engine
 * This will be used when integrating with UE5
 */

import { CastingProfile } from "@/types/casting.types";

export class CastingUnrealBridge {
  private static websocket: WebSocket | null = null;

  /**
   * Initialize WebSocket connection to Unreal Engine
   */
  static async connect(url: string = "ws://localhost:8080"): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.websocket = new WebSocket(url);

        this.websocket.onopen = () => {
          console.log("Connected to Unreal Engine");
          resolve(true);
        };

        this.websocket.onerror = (error) => {
          console.error("Unreal Engine connection error:", error);
          reject(false);
        };

        this.websocket.onmessage = (event) => {
          this.handleUnrealMessage(event.data);
        };
      } catch (error) {
        reject(false);
      }
    });
  }

  /**
   * Send casting profile to Unreal Engine
   */
  static sendCastingProfile(profile: CastingProfile): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error("Not connected to Unreal Engine");
      return;
    }

    const message = {
      type: "CASTING_PROFILE",
      data: profile,
      timestamp: Date.now(),
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Send character to spawn in Unreal scene
   */
  static spawnCharacter(characterData: any): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error("Not connected to Unreal Engine");
      return;
    }

    const message = {
      type: "SPAWN_CHARACTER",
      data: characterData,
      timestamp: Date.now(),
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Handle messages from Unreal Engine
   */
  private static handleUnrealMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      console.log("Received from Unreal:", message);

      // Handle different message types
      switch (message.type) {
        case "CHARACTER_SPAWNED":
          console.log("Character spawned successfully in Unreal");
          break;
        case "SCENE_READY":
          console.log("Unreal scene is ready");
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error parsing Unreal message:", error);
    }
  }

  /**
   * Disconnect from Unreal Engine
   */
  static disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      console.log("Disconnected from Unreal Engine");
    }
  }
}
