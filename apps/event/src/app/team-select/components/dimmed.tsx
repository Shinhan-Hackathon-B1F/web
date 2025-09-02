interface DimmedProps {
    text: string;
  }
  
  const Dimmed = ({ text }: DimmedProps) => {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <p className="text-white text-8xl font-kbo font-bold">{text === "0" ? "Start" : text}</p>
      </div>
    );
  };

  export default Dimmed;