"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Destructive-action confirmation (replaces window.confirm). */
export default function ConfirmDialog({ title, message, confirmLabel, cancelLabel, isBusy, onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !isBusy && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel, isBusy]);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={() => !isBusy && onCancel()}
    >
      <div className="w-full max-w-md bg-white rounded-sm shadow-2xl border border-zinc-200 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 id="confirm-dialog-title" className="text-base font-bold text-zinc-900">{title}</h3>
            <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button type="button" onClick={onCancel} disabled={isBusy} className="px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-sm hover:bg-zinc-50 transition-colors disabled:opacity-60">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={isBusy} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-sm transition-colors disabled:opacity-60">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
