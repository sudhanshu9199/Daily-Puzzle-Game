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
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end px-1">
        <span className="text-xs font-semibold text-[#3D3B40] uppercase tracking-wider">Activity</span>
        <span className="text-[10px] font-medium text-[#BFCFE7] bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#F6F5F5]">Last {Math.floor(daysToShow / 30)} Months</span>
      </div>
      
      {/* Scrollable Container for Mobile */}
      <div className="overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((dateStr) => {
                const dayData = history[dateStr];
                const isSolved = dayData?.solved;
                const attempts = dayData?.attempts || 0;

                // Determine color intensity based on performance (Optional polish)
                let bgClass = "bg-[#F6F5F5] border border-[#F6F5F5]";
                if (isSolved) {
                    if (attempts === 1) bgClass = "bg-[#414BEA] border border-[#414BEA] shadow-[0_0_8px_rgba(65,75,234,0.4)]"; // Perfect
                    else if (attempts <= 3) bgClass = "bg-[#7752FE] border border-[#7752FE]"; // Good
                    else bgClass = "bg-[#BFCFE7] border border-[#BFCFE7]"; // Solved
                } else if (dayData) {
                    bgClass = "bg-[#F05537] border border-[#F05537]"; // Failed/In-progress
                }

                return (
                  <motion.div
                    key={dateStr}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: weekIndex * 0.02 }}
                    className={`w-3 h-3 rounded-sm ${bgClass} cursor-help transition-colors hover:ring-2 hover:ring-offset-1 hover:ring-blue-300 hover:scale-125 hover:z-10`}
                    title={`${formatReadableDate(dateStr)}: ${isSolved ? 'Solved' : 'Not Played'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 justify-end text-[10px] text-[#3D3B40] font-medium">
        <span>Less</span>
        <div className="w-2.5 h-2.5 bg-[#F6F5F5] rounded-[2px] border border-[#D9E2FF]"></div>
        <div className="w-2.5 h-2.5 bg-[#BFCFE7] rounded-[2px]"></div>
        <div className="w-2.5 h-2.5 bg-[#7752FE] rounded-[2px]"></div>
        <div className="w-2.5 h-2.5 bg-[#414BEA] rounded-[2px]"></div>
        <span>More</span>
      </div>
    </div>
  );
};