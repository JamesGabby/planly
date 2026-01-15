// components/landing/product-preview.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductPreview() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Browser Frame */}
        <div className="relative rounded-xl lg:rounded-2xl overflow-hidden border-2 shadow-2xl shadow-primary/10 bg-background">
          {/* Browser Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-4">
              <div className="max-w-md mx-auto px-4 py-1.5 rounded-lg bg-background text-xs text-muted-foreground text-center">
                app.planly.co.uk/dashboard
              </div>
            </div>
          </div>

          {/* Screenshot/Video Area */}
          <div className="relative aspect-[16/10] bg-muted">
            <Image
              src="/images/dashboard-preview.png" // Add your screenshot
              alt="Planly Dashboard Preview"
              fill
              className="object-cover object-top"
              priority
            />

            {/* Play Button Overlay */}
            <button
              onClick={() => setIsVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
              aria-label="Watch demo video"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/95 shadow-xl group-hover:scale-105 transition-transform">
                <div className="p-2 rounded-full bg-primary text-primary-foreground">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <span className="font-semibold text-foreground">Watch Demo</span>
              </div>
            </button>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="absolute -left-4 lg:-left-12 top-1/4 hidden md:block animate-float">
          <div className="p-4 rounded-xl bg-background/95 backdrop-blur border shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">Lesson Created</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-4 lg:-right-12 bottom-1/4 hidden md:block animate-float animation-delay-500">
          <div className="p-4 rounded-xl bg-background/95 backdrop-blur border shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">AI Generated</p>
                <p className="text-xs text-muted-foreground">15 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/uzReux4CJ6M?autoplay=1"
              title="Planly Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}