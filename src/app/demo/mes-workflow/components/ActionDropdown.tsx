'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ActionItem {
  label: string;
  onClick: () => void;
  color?: 'default' | 'blue' | 'emerald' | 'red' | 'amber' | 'orange';
}

const COLOR_MAP: Record<NonNullable<ActionItem['color']>, string> = {
  default: 'text-slate-300 hover:bg-slate-700/60',
  blue:    'text-blue-400  hover:bg-blue-500/10',
  emerald: 'text-emerald-400 hover:bg-emerald-500/10',
  red:     'text-red-400   hover:bg-red-500/10',
  amber:   'text-amber-400 hover:bg-amber-500/10',
  orange:  'text-orange-400 hover:bg-orange-500/10',
};

export default function ActionDropdown({ actions }: { actions: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function positionMenu() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 192;
      const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.right - width));
      setMenuPos({ top: rect.bottom + 6, left });
    }

    function handleMouse(e: MouseEvent) {
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    function handleScroll() {
      setOpen(false);
    }

    if (open) {
      positionMenu();
      document.addEventListener('mousedown', handleMouse);
      document.addEventListener('keydown', handleKey);
      window.addEventListener('resize', positionMenu);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleMouse);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
        title="Actions"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="16" cy="10" r="1.5" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-50 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 overflow-hidden"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {actions.map((a, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={() => { a.onClick(); setOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${COLOR_MAP[a.color ?? 'default']}`}
            >
              {a.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}
