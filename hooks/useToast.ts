"use client";

import { useState, useCallback } from "react";
import { ToastProps } from "@/components/ui/Toast";

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback(
    (type: ToastProps["type"], message: string, duration?: number) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: ToastProps = {
        id,
        type,
        message,
        duration,
        onClose: (id: string) => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        },
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string, duration?: number) =>
      showToast("success", message, duration),
    error: (message: string, duration?: number) =>
      showToast("error", message, duration),
    warning: (message: string, duration?: number) =>
      showToast("warning", message, duration),
    info: (message: string, duration?: number) =>
      showToast("info", message, duration),
  };
}
