// ==============================================================================
// ARISE PRODUCTION - REMOTION RENDERING API
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import express from 'express';
import { remotionConnector } from '../services/remotion-connector.js';
import { toolDetection } from '../services/tool-detection.js';

const router = express.Router();

/**
 * POST /api/remotion/init
 * Initialize Remotion with a project path
 */
router.post('/init', async (req, res) => {
  try {
    const { projectPath } = req.body;

    if (!projectPath) {
      return res.status(400).json({
        error: 'Missing required parameter: projectPath',
      });
    }

    const result = await remotionConnector.initRemotion(projectPath);
    res.json(result);
  } catch (err) {
    console.error('[Remotion API] Init error:', err);
    res.status(500).json({
      error: 'Failed to initialize Remotion',
      message: err.message,
    });
  }
});

/**
 * POST /api/remotion/render
 * Render a Remotion composition
 */
router.post('/render', async (req, res) => {
  try {
    const { compositionId, options = {} } = req.body;

    if (!compositionId) {
      return res.status(400).json({
        error: 'Missing required parameter: compositionId',
      });
    }

    const result = await remotionConnector.renderRemotionComposition(compositionId, options);
    res.json(result);
  } catch (err) {
    console.error('[Remotion API] Render error:', err);
    res.status(500).json({
      error: 'Failed to render composition',
      message: err.message,
    });
  }
});

/**
 * GET /api/remotion/compositions
 * List available compositions
 */
router.get('/compositions', async (req, res) => {
  try {
    const result = await remotionConnector.listCompositions();
    res.json(result);
  } catch (err) {
    console.error('[Remotion API] List compositions error:', err);
    res.status(500).json({
      error: 'Failed to list compositions',
      message: err.message,
    });
  }
});

/**
 * GET /api/remotion/status
 * Get Remotion engine status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await remotionConnector.getStatus();
    res.json(status);
  } catch (err) {
    console.error('[Remotion API] Status error:', err);
    res.status(500).json({
      error: 'Failed to get Remotion status',
      message: err.message,
    });
  }
});

/**
 * POST /api/remotion/ffmpeg/title-card
 * Render FFmpeg cinematic title card
 */
router.post('/ffmpeg/title-card', async (req, res) => {
  try {
    const options = req.body || {};
    const result = await remotionConnector.renderCinematicVideoCard(options);
    res.json(result);
  } catch (err) {
    console.error('[Remotion API] FFmpeg title card error:', err);
    res.status(500).json({
      error: 'Failed to render FFmpeg title card',
      message: err.message,
    });
  }
});

/**
 * POST /api/remotion/ffmpeg/stitch
 * Stitch image sequence to video
 */
router.post('/ffmpeg/stitch', async (req, res) => {
  try {
    const options = req.body || {};
    const result = await remotionConnector.stitchImageSequenceToVideo(options);
    res.json(result);
  } catch (err) {
    console.error('[Remotion API] FFmpeg stitch error:', err);
    res.status(500).json({
      error: 'Failed to stitch image sequence',
      message: err.message,
    });
  }
});

export default router;
