// Tile.tsx

interface TileProps {
  content: string;
  status: 'idle' | 'selected' | 'correct' | 'wrong';
  onClick?: () => void;
}

export const Tile = ({ content, status, onClick }: TileProps) => {
  const baseStyle = "w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-200 select-none shadow-sm";
  
  const statusStyles = {
    idle: "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400",
    selected: "bg-blue-50 border-2 border-blue-500 text-blue-700",
    correct: "bg-green-100 border-2 border-green-500 text-green-700",
    wrong: "bg-red-100 border-2 border-red-500 text-red-700 animate-shake"
  };

  return (
    <div 
      className={`${baseStyle} ${statusStyles[status]}`}
      onClick={onClick}
    >
      {content}
    </div>
  );
};