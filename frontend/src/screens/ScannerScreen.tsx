import { X, Flashlight } from "lucide-react";
import { QrScanner } from "@/components/qr/QrScanner";

interface ScannerScreenProps {
  onClose: () => void;
  onScanned: (decodedText: string) => void;
}

export const ScannerScreen = ({ onClose, onScanned }: ScannerScreenProps) => {
  return (
    <div className="flex-1 relative bg-[#1a1410] text-white overflow-hidden">
      {/* Dark backdrop */}
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
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 pt-4 pb-3">
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
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-8 pt-4 pb-6">
        <div className="relative w-full aspect-square max-w-[360px]">
          <div className="absolute inset-0">
            <QrScanner onDecode={onScanned} />
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
        /* Make html5-qrcode output fill the square neatly */
        [id^="qr-reader-"] video,
        [id^="qr-reader-"] canvas {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }

        /* Hide html5-qrcode's shaded scan box/overlay (we draw our own frame) */
        #qr-shaded-region {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
