import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrScanner } from "@/components/qr/QrScanner";

interface ScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onDecode: (decodedText: string) => void;
}

export const ScannerModal = ({ open, onOpenChange, title = "Сканирование QR", onDecode }: ScannerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-4 sm:p-5">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-3">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border bg-muted">
            <QrScanner onDecode={onDecode} />
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-xl",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-xl",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl",
            ].map((c, i) => (
              <span key={i} className={`absolute w-10 h-10 border-white/90 ${c}`} />
            ))}
          </div>
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
      </DialogContent>
    </Dialog>
  );
};

