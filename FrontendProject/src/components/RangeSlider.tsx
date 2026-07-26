import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/i18n/useTranslation";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  /** Bucket counts spread evenly across [min, max] — renders as a distribution bar behind the track. */
  histogram?: number[];
  formatValue?: (value: number) => string;
  className?: string;
}

/**
 * A dual-handle range slider with a live distribution histogram behind the
 * track, so picking a range also shows where the data actually clusters.
 */
export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onValueChange,
  histogram,
  formatValue = formatNumber,
  className,
}: RangeSliderProps) {
  const { t } = useTranslation();
  const span = Math.max(max - min, 1);
  const maxCount = histogram ? Math.max(1, ...histogram) : 1;
  const isFiltered = value[0] > min || value[1] < max;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
            {formatValue(value[0])} – {formatValue(value[1])}
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={() => onValueChange([min, max])}
              className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              {t("common.reset")}
            </button>
          )}
        </div>
      </div>

      <div className="relative pt-6">
        {histogram && histogram.length > 0 && (
          <div className="pointer-events-none absolute inset-x-2.5 bottom-[13px] flex h-7 items-end gap-px">
            {histogram.map((count, i) => {
              const bucketStart = min + (i / histogram.length) * span;
              const bucketEnd = min + ((i + 1) / histogram.length) * span;
              const inRange = bucketEnd >= value[0] && bucketStart <= value[1];
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm transition-colors",
                    inRange ? "bg-primary/50" : "bg-secondary"
                  )}
                  style={{ height: `${Math.max((count / maxCount) * 100, count > 0 ? 8 : 2)}%` }}
                />
              );
            })}
          </div>
        )}

        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(v) => onValueChange([v[0], v[1]] as [number, number])}
          minStepsBetweenThumbs={1}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
