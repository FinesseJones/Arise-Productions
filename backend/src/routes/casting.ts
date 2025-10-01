// ============================================
// BACKEND API ROUTE
// Save as: backend/src/routes/casting.ts
// ============================================

import { Router } from "express";
import { CastingController } from "../controllers/casting.controller";

const router = Router();
const castingController = new CastingController();

/**
 * POST /api/casting/analyze
 * Generate AI-powered casting analysis
 */
router.post("/analyze", async (req, res) => {
  try {
    const result = await castingController.generateAnalysis(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/casting/profiles
 * Save a casting profile
 */
router.post("/profiles", async (req, res) => {
  try {
    const result = await castingController.saveProfile(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/casting/profiles
 * Get all casting profiles
 */
router.get("/profiles", async (req, res) => {
  try {
    const result = await castingController.getProfiles();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
