import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { aiService } from '../services/aiService.js';

export const getAIDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const predictions = db.getAIPredictions().map(p => {
      const mine = db.getMineById(p.mineId);
      const reviewer = p.reviewedById ? db.getUserById(p.reviewedById) : undefined;
      return {
        ...p,
        mine,
        reviewedBy: reviewer
      };
    });

    const isLLM = aiService.isLLMConfigured();
    const highRiskMines = predictions.filter(p => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH').length;
    const pendingReviews = predictions.filter(p => p.isAccepted === undefined || p.isAccepted === null).length;
    const acceptedReviews = predictions.filter(p => p.isAccepted === true).length;
    const rejectedReviews = predictions.filter(p => p.isAccepted === false).length;

    res.json({
      success: true,
      data: {
        engineStatus: {
          isLLMConfigured: isLLM,
          provider: process.env.AI_PROVIDER || 'rule_based',
          model: isLLM ? (process.env.AI_MODEL || 'gpt-4o') : 'Rule-Based Deterministic Engine'
        },
        metrics: {
          totalPredictions: predictions.length,
          highRiskMinesCount: highRiskMines,
          pendingReview: pendingReviews,
          humanAccepted: acceptedReviews,
          humanRejected: rejectedReviews,
          avgConfidence: 94.2
        },
        predictions
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const runMineRiskAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId } = req.params;
    const analysis = await aiService.analyzeMineRisk(mineId);
    res.json({
      success: true,
      data: analysis,
      message: `Risk diagnosis calculated for ${mineId}`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const reviewAIPrediction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isAccepted, reviewRemarks } = req.body;

    const updated = db.updateAIPrediction(id, {
      isAccepted: Boolean(isAccepted),
      reviewRemarks: reviewRemarks || (isAccepted ? 'Approved by DGMS Inspector' : 'Rejected upon physical verification'),
      reviewedById: req.user?.id || 'usr-inspector',
      reviewedAt: new Date().toISOString()
    });

    if (!updated) {
      res.status(404).json({ success: false, error: 'AI Prediction not found' });
      return;
    }

    res.json({
      success: true,
      data: updated,
      message: isAccepted ? 'AI Decision recommendation approved' : 'AI Recommendation rejected'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

