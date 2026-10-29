import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  title?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  actionText?: string;
  actionUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(toast: Omit<ToastMessage, 'id'> & { id?: string }) {
    const id = toast.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = {
      id,
      message: toast.message,
      title: toast.title,
      type: toast.type || 'success',
      duration: toast.duration ?? 3500,
      actionText: toast.actionText,
      actionUrl: toast.actionUrl
    };

    this.toasts.update(current => [...current, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }

    return id;
  }

  success(message: string, options?: { title?: string; duration?: number; actionText?: string; actionUrl?: string }) {
    return this.show({
      message,
      type: 'success',
      title: options?.title || 'Added to Cart',
      duration: options?.duration ?? 4000,
      actionText: options?.actionText,
      actionUrl: options?.actionUrl
    });
  }

  error(message: string, options?: { title?: string; duration?: number }) {
    return this.show({
      message,
      type: 'error',
      title: options?.title || 'Error',
      duration: options?.duration ?? 4000
    });
  }

  info(message: string, options?: { title?: string; duration?: number; actionText?: string; actionUrl?: string }) {
    return this.show({
      message,
      type: 'info',
      title: options?.title,
      duration: options?.duration ?? 4000,
      actionText: options?.actionText,
      actionUrl: options?.actionUrl
    });
  }

  dismiss(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
