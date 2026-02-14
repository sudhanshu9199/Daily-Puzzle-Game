import confetti from 'canvas-confetti';

export const triggerSideCannons = () => {
  const end = Date.now() + 3 * 1000; // 3 seconds duration
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']; // Matches your Tailwind palette (blue, green, yellow, red)

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 }, // Left bottom corner
      colors: colors,
      zIndex: 1000, // Ensure it sits on top of modals/UI
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 }, // Right bottom corner
      colors: colors,
      zIndex: 1000,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};