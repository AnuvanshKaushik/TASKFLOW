import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export const Modal = ({ open, title, description, children, onClose }: ModalProps) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/50 bg-white/90 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-[#171923]/95"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-6 py-5 dark:border-white/10">
            <div>
              <h2 className="text-xl font-bold text-ink dark:text-white">{title}</h2>
              {description ? (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              ) : null}
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="max-h-[calc(90vh-96px)] overflow-y-auto p-6">{children}</div>
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

