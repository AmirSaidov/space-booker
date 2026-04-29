import { useEffect } from "react";
import { X, Flashlight } from "lucide-react";

interface ScannerScreenProps {
  onClose: () => void;
  onScanned: () => void;
}

export const ScannerScreen = ({ onClose, onScanned }: ScannerScreenProps) => {
  // Auto "scan" after a short delay to simulate a successful read
  useEffect(() => {
    const t = setTimeout(onScanned, 2200);
    return () => clearTimeout(t);
  }, [onScanned]);

  return (
    <div className="flex-1 relative bg-[#1a1410] text-white overflow-hidden">
      {/* Faux camera background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, #4a3a2c 0%, #2a1f17 50%, #0d0907 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 0 2px, transparent 2px 6px)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-4 pb-3">
        <button
          onClick={onClose}
          className="p-1.5 -ml-1.5 text-white"
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-base font-semibold">Сканирование QR</h1>
        <span className="w-9" />
      </header>

      {/* Scan window */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 pt-6">
        <div className="relative w-full aspect-square max-w-[280px]">
          {/* Mock QR */}
          <div className="absolute inset-6 bg-white rounded-md flex items-center justify-center overflow-hidden">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 8px 8px",
              }}
            />
          </div>
          {/* Corner brackets */}
          {[
            "top-0 left-0 border-t-4 border-l-4 rounded-tl-xl",
            "top-0 right-0 border-t-4 border-r-4 rounded-tr-xl",
            "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl",
            "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl",
          ].map((c, i) => (
            <span
              key={i}
              className={`absolute w-10 h-10 border-white ${c}`}
            />
          ))}
          {/* Scan line */}
          <span
            aria-hidden
            className="absolute left-6 right-6 h-0.5 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-scan"
          />
        </div>
      </div>

      {/* Flashlight */}
      <div className="relative z-10 flex justify-center pb-10 pt-4">
        <button
          className="w-14 h-14 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white border border-white/20"
          aria-label="Фонарик"
        >
          <Flashlight className="w-6 h-6" />
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 12%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 88%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};