import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface Props {
  open: boolean;
  /** Called when the dialog closes for any reason (button, Escape). */
  onClose: () => void;
  labelledBy: string;
  class?: string;
  children: ComponentChildren;
}

/**
 * A modal native <dialog> (PRD: prefer the platform). The browser traps focus and
 * handles Escape; we return focus to where it was when the dialog opened.
 */
export function Dialog({ open, onClose, labelledBy, class: className, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      onClose();
      returnFocus.current?.focus();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      class={className ? `dialog ${className}` : 'dialog'}
      aria-labelledby={labelledBy}
    >
      {children}
    </dialog>
  );
}
