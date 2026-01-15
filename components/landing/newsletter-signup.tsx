// components/landing/newsletter-signup.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In reality, call your newsletter API here
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">Thanks! Check your inbox for teaching tips.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pl-10 h-12"
          disabled={status === "loading"}
        />
      </div>
      <Button type="submit" size="lg" className="h-12" disabled={status === "loading"}>
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Get Free Teaching Tips"
        )}
      </Button>
    </form>
  );
}