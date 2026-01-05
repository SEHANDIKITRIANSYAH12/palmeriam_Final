import { useState, useEffect } from "react";
import { Settings, ZoomIn, ZoomOut, Contrast, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TextScale = "sm" | "base" | "lg" | "xl";

export default function AccessibilityToolbar() {
  const [textScale, setTextScale] = useState<TextScale>("base");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Apply text scale
    document.documentElement.classList.remove(
      "text-scale-sm",
      "text-scale-base",
      "text-scale-lg",
      "text-scale-xl"
    );
    document.documentElement.classList.add(`text-scale-${textScale}`);

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [textScale, highContrast]);

  const scaleLabels: Record<TextScale, string> = {
    sm: "Kecil",
    base: "Normal",
    lg: "Besar",
    xl: "Sangat Besar",
  };

  const increaseText = () => {
    const scales: TextScale[] = ["sm", "base", "lg", "xl"];
    const currentIndex = scales.indexOf(textScale);
    if (currentIndex < scales.length - 1) {
      setTextScale(scales[currentIndex + 1]);
    }
  };

  const decreaseText = () => {
    const scales: TextScale[] = ["sm", "base", "lg", "xl"];
    const currentIndex = scales.indexOf(textScale);
    if (currentIndex > 0) {
      setTextScale(scales[currentIndex - 1]);
    }
  };

  const resetAll = () => {
    setTextScale("base");
    setHighContrast(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full shadow-government-lg bg-card border-border hover:bg-secondary"
          aria-label="Pengaturan Aksesibilitas"
        >
          <Settings className="w-5 h-5 text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="end"
        className="w-72 p-4"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-foreground">Aksesibilitas</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAll}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>

          {/* Text Size */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Ukuran Teks</p>
            <div className="flex items-center justify-between bg-secondary rounded-lg p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseText}
                disabled={textScale === "sm"}
                className="w-8 h-8"
                aria-label="Perkecil teks"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-foreground">
                {scaleLabels[textScale]}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseText}
                disabled={textScale === "xl"}
                className="w-8 h-8"
                aria-label="Perbesar teks"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Mode Kontras Tinggi</p>
            <Button
              variant={highContrast ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setHighContrast(!highContrast)}
            >
              <Contrast className="w-4 h-4 mr-2" />
              {highContrast ? "Aktif" : "Nonaktif"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Gunakan Tab dan Enter untuk navigasi keyboard.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
