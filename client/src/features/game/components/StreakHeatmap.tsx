// client/src/features/game/components/StreakHeatmap.tsx
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { UserProgress } from '../../../types/index.types';
import { getPastDates, formatReadableDate } from '../../../utils/date.utils';

interface StreakHeatmapProps {
  history: UserProgress['history'];
  daysToShow?: number;
}

export const StreakHeatmap = ({ history, daysToShow = 91 }: StreakHeatmapProps) => {
  // Generate the grid of dates
  const dates = useMemo(() => getPastDates(daysToShow), [daysToShow]);

  // Calculate weeks for the grid layout (7 days per column)
  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeksArray.push(dates.slice(i, i + 7));
    }
    return weeksArray;
  }, [dates]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end px-1">
        <span className="text-xs font-semibold text-slate-400">Activity</span>
        <span className="text-[10px] text-slate-400">Last {Math.floor(daysToShow / 30)} Months</span>
      </div>
      
      {/* Scrollable Container for Mobile */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((dateStr) => {
                const dayData = history[dateStr];
                const isSolved = dayData?.solved;
                const attempts = dayData?.attempts || 0;

                // Determine color intensity based on performance (Optional polish)
                let bgClass = "bg-slate-100";
                if (isSolved) {
                    if (attempts === 1) bgClass = "bg-green-500"; // Perfect
                    else if (attempts <= 3) bgClass = "bg-green-400"; // Good
                    else bgClass = "bg-green-300"; // Solved
                } else if (dayData) {
                    bgClass = "bg-red-200"; // Failed/In-progress
                }

                return (
                  <motion.div
                    key={dateStr}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: weekIndex * 0.02 }}
                    className={`w-3 h-3 rounded-sm ${bgClass} cursor-help transition-colors hover:ring-2 hover:ring-offset-1 hover:ring-blue-300`}
                    title={`${formatReadableDate(dateStr)}: ${isSolved ? 'Solved' : 'Not Played'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 justify-end text-[10px] text-slate-400">
        <span>Less</span>
        <div className="w-2 h-2 bg-slate-100 rounded-sm"></div>
        <div className="w-2 h-2 bg-green-300 rounded-sm"></div>
        <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
};