import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Responsive app frame.
 * - Mobile: fills the viewport (no "phone" mock UI).
 * - Desktop/tablet: centers content with comfortable max width.
 */
export const PhoneFrame = ({ children }: PhoneFrameProps) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="min-h-screen w-full mx-auto flex flex-col md:max-w-[1100px] md:px-8 md:py-8">
        <div className="flex-1 flex flex-col overflow-hidden md:rounded-3xl md:border md:border-border md:shadow-card bg-background">
          <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
