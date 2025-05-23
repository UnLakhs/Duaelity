// app/Authentication/VerifyEmail/page.tsx
import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}