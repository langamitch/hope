"use client";

import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

type SignupState = "idle" | "loading" | "done";

export default function NewsletterSignupButton() {
  const [state, setState] = useState<SignupState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (state !== "idle") return;

    setState("loading");
    timeoutRef.current = setTimeout(() => {
      setState("done");
    }, 5000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state !== "idle"}
      className="mt-2 inline-flex w-fit items-center gap-2 bg-black px-2 py-1 text-[13px] uppercase text-white disabled:cursor-not-allowed disabled:opacity-90"
    >
      {state === "loading" && <Loader />}
      {state === "idle" && "Sign up now"}
      {state === "loading" && ""}
      {state === "done" && "Thank you."}
    </button>
  );
}
