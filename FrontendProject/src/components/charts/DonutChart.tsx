import { useTheme } from "@/theme/ThemeContext";
import { useTranslation } from "@/i18n/useTranslation";
import { categoricalColor } from "@/lib/chartColors";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface DonutSegment {
  key: string;
  label: string;
  value: number;
}

const SIZE = 176;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 4; // px along the circumference, separating segments (surface gap, no stroke)

/**
 * A donut chart with an always-present legend (swatch + label + value +
 * share), a center total, and a native tooltip per segment. Colors are
 * assigned by fixed position — see lib/chartColors.ts.
 */
export function DonutChart({
  segments,
  centerLabel,
  className,
}: {
  segments: DonutSegment[];
  centerLabel?: string;
  className?: string;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground",
          className
        )}
      >
        <div
          className="rounded-full border-[10px] border-dashed border-border"
          style={{ width: SIZE * 0.7, height: SIZE * 0.7 }}
        />
        <p className="text-sm">{t("charts.noData")}</p>
      </div>
    );
  }

  let cumulative = 0;

  return (
    <div className={cn("flex flex-col items-center gap-5 sm:flex-row sm:items-center", className)}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={centerLabel ? `${centerLabel}: ${formatNumber(total)}` : `Total: ${formatNumber(total)}`}
        className="shrink-0"
      >
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            className="text-secondary"
            strokeWidth={STROKE}
          />
          {segments
            .filter((s) => s.value > 0)
            .map((segment) => {
              const fraction = segment.value / total;
              const length = fraction * CIRCUMFERENCE;
              const visibleLength = Math.max(length - GAP, 0);
              const offset = -cumulative;
              cumulative += length;
              const index = segments.indexOf(segment);

              return (
                <circle
                  key={segment.key}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={categoricalColor(index, theme)}
                  strokeWidth={STROKE}
                  strokeDasharray={`${visibleLength} ${CIRCUMFERENCE - visibleLength}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                >
                  <title>
                    {segment.label}: {formatNumber(segment.value)} ({Math.round(fraction * 100)}%)
                  </title>
                </circle>
              );
            })}
        </g>
        <text
          x={SIZE / 2}
          y={SIZE / 2 - 4}
          textAnchor="middle"
          className="fill-foreground font-display text-2xl font-bold"
        >
          {formatNumber(total)}
        </text>
        {centerLabel && (
          <text
            x={SIZE / 2}
            y={SIZE / 2 + 16}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] uppercase tracking-wide"
          >
            {centerLabel}
          </text>
        )}
      </svg>

      <ul className="w-full min-w-0 space-y-1.5 text-sm">
        {segments.map((segment, index) => (
          <li key={segment.key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: categoricalColor(index, theme) }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-foreground">{segment.label}</span>
            <span className="shrink-0 font-medium text-muted-foreground">
              {formatNumber(segment.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
