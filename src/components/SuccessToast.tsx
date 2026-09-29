"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const success = searchParams?.get("success");
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (success === "added") {
      setMessage("Data sanggar berhasil ditambahkan!");
      setIsVisible(true);
    } else if (success === "updated") {
      setMessage("Data sanggar berhasil diperbarui!");
      setIsVisible(true);
    }

    if (success) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-md bg-green-600 px-4 py-3 text-white shadow-lg shadow-green-600/20 animate-fade-in transition-all duration-300">
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 rounded-lg p-1 transition-colors hover:bg-green-700 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
