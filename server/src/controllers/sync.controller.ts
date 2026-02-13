import { Request, Response } from 'express';
import { prisma } from '../config/prisma'; // Import the singleton instance

export const syncUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, currentStreak, maxStreak, lastPlayedDate, totalSolved, history, email, displayName } = req.body;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    // Use a Transaction for data integrity
    await prisma.$transaction(async (tx) => {
      // 1. Upsert User
      await tx.user.upsert({
        where: { id: userId },
        update: { email, displayName },
        create: { 
          id: userId, 
          email: email || "unknown@example.com", 
          displayName 
        }
      });

      // 2. Upsert Progress
      await tx.progress.upsert({
        where: { userId: userId },
        update: {
          currentStreak,
          maxStreak,
          lastPlayedDate: lastPlayedDate ? new Date(lastPlayedDate) : null,
          totalSolved,
          history: history || {} 
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
    });

    res.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};