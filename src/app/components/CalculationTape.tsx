'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

export interface TapeEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface TapeItemProps {
  entry: TapeEntry;
  onRestore: (entry: TapeEntry) => void;
  onDelete: (id: string) => void;
  onCopy: (entry: TapeEntry) => void;
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatDateTime(date: Date): string {
  const d = date.toLocaleDateString('ru-RU');
  const t = formatTime(date);
  return `${d} ${t}`;
}

function TapeItem({ entry, onRestore, onDelete, onCopy }: TapeItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);
  const isScrollingRef = useRef<boolean | null>(null);

  const DELETE_THRESHOLD = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isLongPressRef.current = false;
    isScrollingRef.current = null;

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (navigator.vibrate) navigator.vibrate([20, 10, 20]);
      onCopy(entry);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    }, 500);
  }, [entry, onCopy]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startXRef.current;
    const dy = e.touches[0].clientY - startYRef.current;

    if (isScrollingRef.current === null) {
      isScrollingRef.current = Math.abs(dy) > Math.abs(dx);
    }

    if (isScrollingRef.current) return;

    if (Math.abs(dx) > 5 && longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (dx < 0) {
      setIsDragging(true);
      setTranslateX(Math.max(dx, -120));
    } else if (isDragging) {
      setTranslateX(Math.min(dx, 0));
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isScrollingRef.current) {
      setIsDragging(false);
      return;
    }

    if (translateX < -DELETE_THRESHOLD) {
      setIsDeleting(true);
      setTranslateX(-400);
      if (navigator.vibrate) navigator.vibrate(15);
      setTimeout(() => onDelete(entry.id), 300);
    } else {
      setTranslateX(0);
    }
    setIsDragging(false);
  }, [translateX, entry.id, onDelete]);

  const handleClick = useCallback(() => {
    if (isLongPressRef.current || Math.abs(translateX) > 5) return;
    if (navigator.vibrate) navigator.vibrate(10);
    onRestore(entry);
  }, [translateX, entry, onRestore]);

  const swipeProgress = Math.min(Math.abs(translateX) / DELETE_THRESHOLD, 1);
  const showDeleteBg = translateX < -10;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        marginBottom: 8,
        flexShrink: 0,
      }}
    >
      {/* Delete background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(220, 50, 50, ${0.7 + swipeProgress * 0.3})`,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 20,
          opacity: showDeleteBg ? 1 : 0,
          transition: isDragging ? 'none' : 'opacity 200ms ease',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        </svg>
      </div>

      {/* Main row */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: isCopied ? 'rgba(85, 200, 90, 0.15)' : 'var(--card-bg)',
          borderRadius: 14,
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : isDeleting ? 'transform 300ms ease' : 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), background 300ms ease',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'pan-y',
          boxShadow: '0 2px 8px rgba(40,30,20,0.06)',
          border: isCopied ? '1px solid rgba(85,200,90,0.4)' : '1px solid rgba(128,128,128,0.08)',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-sans)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 2,
          }}>
            {entry.expression || entry.result}
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-sans)',
            opacity: 0.7,
          }}>
            {formatTime(entry.timestamp)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isCopied && (
            <span style={{
              fontSize: 10,
              color: '#55C85A',
              fontWeight: 600,
              letterSpacing: '0.05em',
              animation: 'fadeIn 200ms ease',
            }}>
              СКОПИРОВАНО
            </span>
          )}
          <div style={{
            fontSize: 20,
            fontWeight: 300,
            color: 'var(--foreground)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.5px',
          }}>
            {entry.result}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface CalculationTapeProps {
  entries: TapeEntry[];
  onRestore: (entry: TapeEntry) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

function exportToCSV(entries: TapeEntry[]) {
  if (entries.length === 0) return;

  const header = 'Дата и время,Выражение,Результат';
  const rows = [...entries].reverse().map(e => {
    const dt = formatDateTime(e.timestamp);
    const expr = (e.expression || e.result).replace(/,/g, ';');
    const result = e.result.replace(/,/g, ';');
    return `"${dt}","${expr}","${result}"`;
  });

  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ai-calculator-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function CalculationTape({
  entries,
  onRestore,
  onDelete,
  onClearAll,
  isOpen,
  onClose,
}: CalculationTapeProps) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback((entry: TapeEntry) => {
    const text = entry.expression ? `${entry.expression}` : entry.result;
    navigator.clipboard?.writeText(text).catch(() => {});
  }, []);

  // Drag-to-close handle
  const handleHandleTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleHandleTouchMove = useCallback((e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy > 0) setTranslateY(dy);
  }, []);

  const handleHandleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (translateY > 80) {
      onClose();
    }
    setTranslateY(0);
  }, [translateY, onClose]);

  useEffect(() => {
    if (!isOpen) setTranslateY(0);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 45,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 46,
          background: 'var(--background)',
          borderRadius: '28px 28px 0 0',
          maxHeight: '72%',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen
            ? `translateY(${translateY}px)`
            : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 420ms cubic-bezier(0.32,0.72,0,1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          willChange: 'transform',
        }}
      >
        {/* Drag handle */}
        <div
          onTouchStart={handleHandleTouchStart}
          onTouchMove={handleHandleTouchMove}
          onTouchEnd={handleHandleTouchEnd}
          style={{
            padding: '12px 0 4px',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'grab',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: 'rgba(128,128,128,0.25)',
          }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 18px 12px',
          flexShrink: 0,
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--foreground)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.3px',
            }}>
              История вычислений
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--muted-foreground)',
              fontFamily: 'var(--font-sans)',
              marginTop: 1,
            }}>
              {entries.length === 0
                ? 'Нет записей'
                : `${entries.length} ${entries.length === 1 ? 'запись' : entries.length < 5 ? 'записи' : 'записей'}`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* CSV Export button */}
            {entries.length > 0 && (
              <button
                onClick={() => exportToCSV(entries)}
                title="Скачать CSV"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  color: '#11184A',
                  background: 'rgba(17,24,74,0.08)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '5px 10px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  transition: 'transform 120ms ease',
                }}
                onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
                onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                onTouchStart={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)'; }}
                onTouchEnd={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                CSV
              </button>
            )}

            {entries.length > 0 && (
              <button
                onClick={onClearAll}
                style={{
                  fontSize: 12,
                  color: '#F04400',
                  background: 'rgba(240,68,0,0.08)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '5px 10px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                }}
              >
                Очистить
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(128,128,128,0.12)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted-foreground)',
                fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Hint */}
        {entries.length > 0 && (
          <div style={{
            padding: '8px 18px 4px',
            fontSize: 10,
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.04em',
            flexShrink: 0,
            opacity: 0.7,
          }}>
            НАЖМИТЕ — ВОССТАНОВИТЬ • СМАХНИТЕ — УДАЛИТЬ • УДЕРЖИТЕ — СКОПИРОВАТЬ
          </div>
        )}

        {/* List */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 14px 20px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {entries.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 0',
              gap: 10,
            }}>
              <div style={{ fontSize: 36, opacity: 0.25 }}>🧮</div>
              <div style={{
                fontSize: 13,
                color: 'var(--muted-foreground)',
                fontFamily: 'var(--font-sans)',
                textAlign: 'center',
              }}>
                Здесь появятся ваши вычисления
              </div>
            </div>
          ) : (
            [...entries].reverse().map(entry => (
              <TapeItem
                key={entry.id}
                entry={entry}
                onRestore={onRestore}
                onDelete={onDelete}
                onCopy={handleCopy}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
