"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const KEY = "nsfw-acknowledged";

/**
 * Shows an age notice before NSFW content. Once someone agrees, it is remembered
 * in their browser so they aren't asked on every page.
 */
export function NsfwGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "ask" | "ok">("checking");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(KEY) === "yes";
    } catch {}
    setState(ok ? "ok" : "ask");
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (state === "ask" && d && !d.open) d.showModal();
  }, [state]);

  const agree = () => {
    try {
      localStorage.setItem(KEY, "yes");
    } catch {}
    dialogRef.current?.close();
    setState("ok");
  };
  const leave = () => router.push("/");

  if (state === "ok") return <>{children}</>;
  return (
    <>
      <div className="nsfw-placeholder" aria-hidden={state === "ask"}>
        {state === "ask" && (
          <p className="muted">
            This page is in the NSFW section. <Link href="/">Back to the home page</Link>
          </p>
        )}
      </div>
      <dialog
        ref={dialogRef}
        className="nsfw-dialog"
        aria-labelledby="nsfw-title"
        onCancel={(e) => {
          e.preventDefault();
          leave();
        }}
      >
        <h2 id="nsfw-title">NSFW translations</h2>
        <p>
          This section is for NSFW translations. By continuing, you agree that you’re old enough to know what that
          means.
        </p>
        <div className="nsfw-actions">
          <button type="button" className="btn-secondary" onClick={leave}>
            Go back
          </button>
          <button type="button" className="btn-primary" onClick={agree} autoFocus>
            Continue
          </button>
        </div>
      </dialog>
    </>
  );
}
