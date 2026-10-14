"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Check, Move } from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCrop: (croppedDataUrl: string) => void;
  onClose: () => void;
  aspectRatio?: number; // 1 for square/circle (classic)
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onCrop,
  onClose,
  aspectRatio = 1,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      currentOffset.current = { x: 0, y: 0 };
    }
  }, [isOpen, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      setOffset({ x: newX, y: newY });
      currentOffset.current = { x: newX, y: newY };
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
    }
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.current.x;
      const newY = touch.clientY - dragStart.current.y;
      setOffset({ x: newX, y: newY });
      currentOffset.current = { x: newX, y: newY };
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    currentOffset.current = { x: 0, y: 0 };
  };

  const handleApplyCrop = () => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    // Create an offscreen canvas with high resolution output (480x480)
    const outputSize = 480;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize / aspectRatio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions of preview box
    const containerRect = container.getBoundingClientRect();
    const boxW = containerRect.width;
    const boxH = containerRect.height;

    // Draw background (white)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling ratio from preview box to high-res canvas
    const scaleRatio = outputSize / boxW;

    // Source image natural sizes
    const imgNaturalW = img.naturalWidth;
    const imgNaturalH = img.naturalHeight;

    // Rendered image size in preview
    const renderedW = img.width * zoom;
    const renderedH = img.height * zoom;

    // Position of image relative to container center
    const imgCenterXInContainer = boxW / 2 + offset.x;
    const imgCenterYInContainer = boxH / 2 + offset.y;

    const destW = renderedW * scaleRatio;
    const destH = renderedH * scaleRatio;
    const destX = (imgCenterXInContainer - renderedW / 2) * scaleRatio;
    const destY = (imgCenterYInContainer - renderedH / 2) * scaleRatio;

    ctx.drawImage(img, 0, 0, imgNaturalW, imgNaturalH, destX, destY, destW, destH);

    // Export as high quality JPEG base64
    const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
    onCrop(croppedBase64);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Move className="w-4 h-4 text-primary" />
            Sesuaikan Posisi & Ukuran Foto
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* Crop Area Container */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`w-[280px] h-[280px] rounded-2xl overflow-hidden relative bg-slate-900 border-2 border-primary/40 shadow-inner select-none cursor-grab ${
              isDragging ? "cursor-grabbing" : ""
            }`}
          >
            {/* Guide circle & border */}
            <div className="absolute inset-0 pointer-events-none z-10 border-2 border-white/20 rounded-2xl flex items-center justify-center">
              <div className="w-[240px] h-[240px] rounded-full border-2 border-dashed border-white/60 flex items-center justify-center">
                <span className="text-[11px] text-white/80 bg-black/60 px-2.5 py-1 rounded-full pointer-events-none font-medium">
                  Area Foto Profil
                </span>
              </div>
            </div>

            {/* Draggable & Scalable Image */}
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
                className="w-full h-full object-contain pointer-events-none transition-transform duration-75"
              />
            )}
          </div>

          <p className="text-xs text-slate-500 text-center">
            💡 <strong>Geser foto</strong> dengan mouse/jari dan gunakan slider di bawah untuk memperbesar fokus wajah aparatur.
          </p>

          {/* Zoom Control Slider */}
          <div className="w-full max-w-[280px] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <ZoomOut className="w-3.5 h-3.5" /> Zoom
              </span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="h-8 w-8 text-slate-500 hover:text-slate-800 shrink-0 ml-1"
                title="Reset posisi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleApplyCrop}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 shadow-md"
          >
            <Check className="w-4 h-4" />
            Terapkan Foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
