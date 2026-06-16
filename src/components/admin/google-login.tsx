"use client";

import * as React from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function GoogleLoginButton({ clientId }: { clientId?: string }) {
  const buttonRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!clientId) return;
    const googleClientId = clientId;

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    const script = existing || document.createElement("script");

    function renderButton() {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            toast.error("Google did not return a credential.");
            return;
          }

          const result = await fetch("/api/admin/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential })
          });

          if (!result.ok) {
            const payload = await result.json().catch(() => ({}));
            toast.error(typeof payload?.message === "string" ? payload.message : "Google sign-in failed.");
            return;
          }

          window.location.assign("/");
        }
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "rectangular",
        width: 320
      });
    }

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;

    if (!existing) document.head.appendChild(script);
    if (existing) renderButton();
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="flex h-11 items-center justify-center rounded-[8px] border border-[#232323] bg-[#111111] px-4 text-sm text-[#9B9B9B]">
        Google sign-in unavailable
      </div>
    );
  }

  return <div ref={buttonRef} className="min-h-11" />;
}
