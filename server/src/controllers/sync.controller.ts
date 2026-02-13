import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { z } from 'zod';

const syncSchema = z.object({
  currentStreak: z.number().int().nonnegative(),
  maxStreak: z.number().int().nonnegative(),
  lastPlayedDate: z.string().nullable().optional(),
  totalSolved: z.number().int().nonnegative(),
  history: z.record(z.any()).optional(), // Validates it's an object
  displayName: z.string().nullable().optional(),
});

export const syncUserProgress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const userEmail = req.user?.email;

    if (!userId) {
      res.status(401).json({ message: "userId is required" });
      return;
    }

    const validation = syncSchema.safeParse(req.body);
    
    if (!validation.success) {
       res.status(400).json({ message: "Invalid data format", errors: validation.error.format() });
       return;
    }

    const {
      currentStreak,
      maxStreak,
      lastPlayedDate,
      totalSolved,
      history,
      displayName,
    } = validation.data;

    // Use a Transaction for data integrity
    await prisma.$transaction(async (tx) => {
      // 1. Upsert User
      await tx.user.upsert({
        where: { id: userId },
        update: {
          email: userEmail || "unknown@example.com",
          displayName,
        },
        create: {
          id: userId,
          email: userEmail || "unknown@example.com",
          displayName,
        },
      });

      // 2. Upsert Progress
      await tx.progress.upsert({
        where: { userId: userId },
        update: {
          currentStreak,
          maxStreak,
          lastPlayedDate: lastPlayedDate ? new Date(lastPlayedDate) : null,
          totalSolved,
          history: history || {},
        },
        create: {
          userId,
          currentStreak,
          maxStreak,
          lastPlayedDate: lastPlayedDate ? new Date(lastPlayedDate) : null,
          totalSolved,
          history: history || {},
        },
      });
    });

    res.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserProgress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      res.status(401).json({ message: "userId is required" });
      return;
    }

    const progress = await prisma.progress.findUnique({
      where: { userId: userId },
    });

    if (!progress) {
      res.json({ data: null });
      return;
    }

    res.json({ data: progress || null });
  } catch (error) {
    console.error("Get Progress Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
