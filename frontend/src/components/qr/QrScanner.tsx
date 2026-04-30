import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  onDecode: (decodedText: string) => void;
  onError?: (message: string) => void;
}

export const QrScanner = ({ onDecode, onError }: QrScannerProps) => {
  const readerId = useMemo(() => {
    const fallback = `qr-reader-${Math.random().toString(16).slice(2)}`;
    // `crypto.randomUUID` is available in modern browsers; keep fallback for safety.
    return typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `qr-reader-${crypto.randomUUID()}`
      : fallback;
  }, []);

  const qrRef = useRef<Html5Qrcode | null>(null);
  const decodedOnceRef = useRef(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const qr = new Html5Qrcode(readerId);
    qrRef.current = qr;

    const start = async () => {
      try {
        await qr.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1,
          },
          (decodedText) => {
            if (decodedOnceRef.current) return;
            decodedOnceRef.current = true;

            if (!cancelled) onDecode(decodedText);
          },
          () => {
            // ignore per-frame decode errors/noise
          }
        );
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Не удалось запустить камеру";
        setInitError(message);
        onError?.(message);
      }
    };

    void start();

    return () => {
      cancelled = true;
      decodedOnceRef.current = true;
      const active = qrRef.current;
      qrRef.current = null;
      if (!active) return;
      
      if (active.isScanning) {
        active.stop().then(() => {
          try { active.clear(); } catch {}
        }).catch(() => {
          try { active.clear(); } catch {}
        });
      } else {
        try { active.clear(); } catch {}
      }
    };
  }, [onDecode, onError, readerId]);

  if (initError) {
    return (
      <div className="w-full h-full rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center p-4 text-center text-sm text-white/90">
        {initError}
      </div>
    );
  }

  return <div id={readerId} className="w-full h-full rounded-2xl overflow-hidden" />;
};

