import { useRef, useState } from "react";
import { useTheme } from "@/theme/ThemeContext";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface LineChartPoint {
  /** ISO date string. */
  date: string;
  value: number;
}

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 220;
const PAD_LEFT = 34;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 26;
const PLOT_WIDTH = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_HEIGHT = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;

// Same "blue" hue as categorical slot 1 — the default single hue for a lone series.
const LINE_COLOR = { light: "#2a78d6", dark: "#3987e5" };

/** Rounds up to a visually clean ceiling (1/2/5 × 10^n) for axis gridlines. */
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  const fraction = value / base;
  const step = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return step * base;
}

/**
 * A single-series line chart with a hover crosshair + tooltip and an
 * end-of-line value label. No legend — one series needs none (the card
 * title already says what is plotted).
 */
export function LineChart({
  points,
  className,
}: {
  points: LineChartPoint[];
  className?: string;
}) {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxValue = niceCeil(Math.max(1, ...points.map((p) => p.value)));
  const n = points.length;

  const xAt = (i: number) => PAD_LEFT + (n <= 1 ? 0 : (i / (n - 1)) * PLOT_WIDTH);
  const yAt = (v: number) => PAD_TOP + PLOT_HEIGHT - (v / maxValue) * PLOT_HEIGHT;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(p.value)}`).join(" ");
  const lineColor = theme === "dark" ? LINE_COLOR.dark : LINE_COLOR.light;

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || n === 0) return;
    const rect = svg.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * VIEW_WIDTH;
    const clamped = Math.min(Math.max(relativeX, PAD_LEFT), PAD_LEFT + PLOT_WIDTH);
    const fraction = PLOT_WIDTH === 0 ? 0 : (clamped - PAD_LEFT) / PLOT_WIDTH;
    const index = Math.round(fraction * (n - 1));
    setHoverIndex(Math.min(Math.max(index, 0), n - 1));
  };

  const gridTicks = [0, maxValue / 2, maxValue];
  const lastPoint = points[n - 1];
  const hovered = hoverIndex != null ? points[hoverIndex] : null;

  // Show a handful of date labels along the X axis — never one per point.
  const labelIndices = n <= 1 ? [0] : [0, Math.floor((n - 1) / 2), n - 1];

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="w-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
        role="img"
        aria-label={lastPoint ? `Latest: ${formatNumber(lastPoint.value)}` : undefined}
      >
        {/* Gridlines — hairline, recessive */}
        {gridTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD_LEFT}
              x2={VIEW_WIDTH - PAD_RIGHT}
              y1={yAt(tick)}
              y2={yAt(tick)}
              stroke="currentColor"
              className="text-border"
              strokeWidth={1}
            />
            <text
              x={PAD_LEFT - 8}
              y={yAt(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {formatNumber(Math.round(tick))}
            </text>
          </g>
        ))}

        {/* X-axis date labels — start, middle, end only */}
        {labelIndices.map((i) => (
          <text
            key={i}
            x={xAt(i)}
            y={VIEW_HEIGHT - 6}
            textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
            className="fill-muted-foreground text-[10px]"
          >
            {formatDate(points[i].date)}
          </text>
        ))}

        {/* The line */}
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* End-of-line value label + marker */}
        {lastPoint && (
          <>
            <circle cx={xAt(n - 1)} cy={yAt(lastPoint.value)} r={4} fill={lineColor} stroke="currentColor" className="text-card" strokeWidth={2} />
            <text
              x={xAt(n - 1)}
              y={yAt(lastPoint.value) - 10}
              textAnchor="end"
              className="fill-foreground text-[11px] font-semibold"
            >
              {formatNumber(lastPoint.value)}
            </text>
          </>
        )}

        {/* Hover crosshair */}
        {hovered && hoverIndex != null && (
          <>
            <line
              x1={xAt(hoverIndex)}
              x2={xAt(hoverIndex)}
              y1={PAD_TOP}
              y2={PAD_TOP + PLOT_HEIGHT}
              stroke="currentColor"
              className="text-muted-foreground"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={xAt(hoverIndex)}
              cy={yAt(hovered.value)}
              r={5}
              fill={lineColor}
              stroke="currentColor"
              className="text-card"
              strokeWidth={2}
            />
          </>
        )}
      </svg>

      {hovered && hoverIndex != null && (
        <div
          className="pointer-events-none absolute top-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-lift"
          style={{
            left: `${(xAt(hoverIndex) / VIEW_WIDTH) * 100}%`,
            transform: hoverIndex > n / 2 ? "translateX(-100%)" : undefined,
          }}
        >
          <p className="font-semibold text-foreground">{formatNumber(hovered.value)}</p>
          <p className="text-muted-foreground">{formatDate(hovered.date)}</p>
        </div>
      )}
    </div>
  );
}
