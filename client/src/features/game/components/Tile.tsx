// Tile.tsx

interface TileProps {
  content: string;
  status: 'idle' | 'selected' | 'correct' | 'wrong';
  onClick?: () => void;
}

export const Tile = ({ content, status, onClick }: TileProps) => {
  const baseStyle = "w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-200 select-none shadow-sm";
  
  const statusStyles = {
    idle: "bg-[#FFFFFF] border-2 border-[#D9E2FF] text-[#3D3B40] hover:border-[#7752FE] hover:shadow-md",
    selected: "bg-[#DDF2FD] border-2 border-[#414BEA] text-[#190482] shadow-md shadow-[#414BEA]/10 scale-105",
    correct: "bg-[#525CEB] border-2 border-[#525CEB] text-white shadow-lg shadow-[#525CEB]/20",
    wrong: "bg-[#F05537] border-2 border-[#F05537] text-white animate-shake shadow-lg shadow-[#F05537]/20"
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