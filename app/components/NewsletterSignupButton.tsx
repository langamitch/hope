"use client";

import Loader from "./Loader";

export type NewsletterSignupState = "idle" | "loading" | "done" | "error";

type NewsletterSignupButtonProps = {
  state: NewsletterSignupState;
  onClick: () => void;
  disabled?: boolean;
};

export default function NewsletterSignupButton({
  state,
  onClick,
  disabled = false,
}: NewsletterSignupButtonProps) {
  const isDisabled = disabled || state === "loading";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="mt-2 inline-flex w-fit items-center gap-2 bg-black px-2 py-1 text-[13px] uppercase text-white disabled:cursor-not-allowed disabled:opacity-90"
    >
      {state === "loading" && <Loader />}
      {state === "idle" && "Sign up now"}
      {state === "loading" && ""}
      {state === "done" && "Thank you."}
      {state === "error" && "Try again"}
    </button>
  );
}
