"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowSquareOut, CaretRight } from "@phosphor-icons/react";

const CORNER = 6;
const DASH =
  "repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)";

export type HookSidebarItem =
  | string
  | {
      label: string;
      href?: string;
      icon?: React.ComponentType<any>;
      activeColor?: string;
      isExternal?: boolean;
      badge?: string;
    };

export type HookSidebarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: HookSidebarItem[];
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  color?: string;
  dashed?: boolean;
  collapsible?: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
};

const hrefOf = (item: HookSidebarItem) =>
  typeof item === "string" ? undefined : item.href;

const labelOf = (item: HookSidebarItem) =>
  typeof item === "string" ? item : item.label;

const isExternalOf = (item: HookSidebarItem) =>
  typeof item === "string" ? false : Boolean(item.isExternal);

const iconOf = (item: HookSidebarItem) =>
  typeof item === "string" ? undefined : item.icon;

const activeColorOf = (item: HookSidebarItem) =>
  typeof item === "string" ? undefined : item.activeColor;

const Rail = ({
  from = 0,
  y,
  visible,
  color = "#ff3700",
  dashed,
  className,
}: {
  from?: number;
  y: number | null;
  visible: boolean;
  color?: string;
  dashed: boolean;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const travel = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

  return (
    <motion.span
      aria-hidden
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.15 }}
      className={cn("pointer-events-none absolute inset-0 z-10", className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - CORNER - from) }}
        transition={travel}
        style={
          dashed
            ? { backgroundImage: DASH }
            : { backgroundColor: "currentColor" }
        }
        className="absolute left-1.5 w-px"
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - CORNER }}
        transition={travel}
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        className="absolute left-1.5"
      >
        <path
          d="M0.5 0a6 6 0 0 0 6 6H14"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray={dashed ? "2 2" : undefined}
        />
      </motion.svg>
    </motion.span>
  );
};

export function HookSidebar({
  items,
  label,
  value,
  defaultValue = 0,
  onChange,
  color = "#ff3700",
  dashed = true,
  collapsible = false,
  isOpen = true,
  onToggleOpen,
  className,
  ...props
}: HookSidebarProps) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [centers, setCenters] = useState<number[]>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);

  const routed = items.some((item) => hrefOf(item));
  const routeIndex = items.findIndex((item) => hrefOf(item) === pathname);
  const activeIndex = value ?? (routed ? routeIndex : internalValue);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () =>
      setCenters(
        itemRefs.current.map((el) =>
          el ? el.offsetTop + el.offsetHeight / 2 : 0,
        ),
      );

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    measure();
    return () => observer.disconnect();
  }, [items.length, pathname, isOpen]);

  const activeY = activeIndex < 0 ? null : (centers[activeIndex] ?? null);
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null);

  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - CORNER)
      : (activeY ?? 0);

  const select = (index: number) => {
    if (value === undefined) setInternalValue(index);
    onChange?.(index);
  };

  return (
    <nav
      data-slot="hook-sidebar"
      aria-label={label}
      className={cn("flex flex-col select-none", className)}
      {...props}
    >
      {label && (
        collapsible ? (
          <button
            type="button"
            onClick={onToggleOpen}
            className="flex items-center justify-between w-full pb-2.5 pl-2 pr-1 font-tight text-[11px] font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-200 transition-colors group cursor-pointer"
          >
            <span>{label}</span>
            <CaretRight
              size={11}
              weight="bold"
              className={cn(
                "text-neutral-500 transition-transform duration-200 group-hover:text-neutral-300",
                isOpen && "rotate-90"
              )}
            />
          </button>
        ) : (
          <span
            data-slot="hook-sidebar-label"
            className="pb-2.5 pl-2 font-tight text-[11px] font-semibold uppercase tracking-wider text-neutral-400"
          >
            {label}
          </span>
        )
      )}

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div
          ref={listRef}
          onMouseLeave={() => setPointerInside(false)}
          className="relative flex flex-col gap-0.5"
        >
          <Rail
            from={hoverFrom}
            y={hoverY}
            visible={(pointerInside || focusInside) && hoverIndex !== activeIndex}
            dashed={dashed}
            color="#666666"
            className="text-neutral-500"
          />
          <Rail
            y={activeY}
            visible={activeY !== null}
            color={color}
            dashed={dashed}
          />

          {items.map((item, index) => {
            const text = labelOf(item);
            const href = hrefOf(item);
            const isExternal = isExternalOf(item);
            const Icon = iconOf(item);
            const activeColor = activeColorOf(item) || "text-[#FF6D2C]";
            const isActive = index === activeIndex;

            const setRef = (el: HTMLElement | null) => {
              itemRefs.current[index] = el;
            };

            const rowContent = (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5 min-w-0">
                  {Icon && (
                    <Icon
                      size={14}
                      weight={isActive ? "fill" : "duotone"}
                      className={cn(
                        "shrink-0 transition-colors duration-150",
                        isActive
                          ? activeColor
                          : "text-neutral-500 group-hover:text-neutral-300",
                      )}
                    />
                  )}
                  <span className="truncate">{text}</span>
                </div>
                {isExternal && (
                  <ArrowSquareOut size={11} className="text-neutral-600 shrink-0 ml-1" />
                )}
              </div>
            );

            const rowProps = {
              "data-slot": "hook-sidebar-item",
              "data-active": isActive,
              onMouseEnter: () => {
                setHoverIndex(index);
                setPointerInside(true);
              },
              onFocus: () => {
                setHoverIndex(index);
                setFocusInside(true);
              },
              onBlur: () => setFocusInside(false),
              onClick: () => select(index),
              className: cn(
                "group relative flex items-center rounded-lg py-1.5 pl-6 pr-2.5 text-left font-tight text-[13px] tracking-[-0.2px] transition-colors duration-150 motion-reduce:transition-none",
                isActive
                  ? "text-white font-medium bg-white/[0.08] border border-white/[0.06] shadow-xs"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent",
              ),
            };

            if (isExternal && href) {
              return (
                <a
                  key={`${index}-${text}`}
                  {...rowProps}
                  ref={setRef}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {rowContent}
                </a>
              );
            }

            return href ? (
              <Link
                key={`${index}-${text}`}
                {...rowProps}
                ref={setRef}
                href={href}
                aria-current={isActive ? "page" : undefined}
              >
                {rowContent}
              </Link>
            ) : (
              <button
                key={`${index}-${text}`}
                {...rowProps}
                ref={setRef}
                type="button"
                aria-current={isActive ? "true" : undefined}
              >
                {rowContent}
              </button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}
