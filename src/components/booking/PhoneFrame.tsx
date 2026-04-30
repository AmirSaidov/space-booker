import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Mobile-first container. On larger screens it shows a centered "phone"
 * mock (max 420px) for a polished preview; on real mobile devices it fills
 * the viewport.
 */
export const PhoneFrame = ({ children }: PhoneFrameProps) => {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center sm:p-6">
      <div className="relative w-full sm:max-w-[420px] sm:rounded-[2.25rem] bg-background sm:shadow-card sm:ring-1 sm:ring-border overflow-hidden min-h-screen sm:min-h-[860px] sm:max-h-[860px] flex flex-col">
        {/* Status bar (visual only, on sm+) */}
        <div className="hidden sm:flex h-9 px-7 items-center justify-between text-xs font-semibold text-foreground shrink-0">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-foreground/80" />
            <span className="inline-block w-3 h-3 rounded-sm bg-foreground/80" />
            <span className="inline-block w-5 h-2.5 rounded-sm border border-foreground/80" />
          </span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};