import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const syncUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, currentStreak, maxStreak, lastPlayedDate, totalSolved, history, email, displayName } = req.body;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    // 1. Ensure User Exists (Upsert = Update if exists, Insert if not)
    // We update email/name just in case they changed in Firebase
    await prisma.user.upsert({
      where: { id: userId },
      update: { email, displayName },
      create: { 
        id: userId, 
        email: email || "unknown@example.com", // Fallback if email is missing
        displayName 
      }
    });

    // 2. Update Progress
    const updatedProgress = await prisma.progress.upsert({
      where: { userId: userId },
      update: {
        currentStreak,
        maxStreak,
        lastPlayedDate: lastPlayedDate ? new Date(lastPlayedDate) : null,
        totalSolved,
        history: history || {} // Ensure valid JSON
      },
      create: {
        userId,
        currentStreak,
        maxStreak,
        lastPlayedDate: lastPlayedDate ? new Date(lastPlayedDate) : null,
        totalSolved,
        history: history || {}
      }
    });

    res.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};