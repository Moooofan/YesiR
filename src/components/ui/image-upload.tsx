"use client";

import { useCallback, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  bucket: string;
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  bucket,
  folder = "",
  multiple = false,
  maxFiles = 6,
  maxSizeMB = 5,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = multiple
    ? (value as string[] | null) || []
    : value
    ? [value as string]
    : [];

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setError(null);
      setUploading(true);

      const supabase = createClient();
      const newUrls: string[] = [];

      try {
        for (const file of Array.from(files)) {
          // 檢查檔案大小
          if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`檔案大小不能超過 ${maxSizeMB}MB`);
            continue;
          }

          // 檢查檔案類型
          if (!file.type.startsWith("image/")) {
            setError("只能上傳圖片檔案");
            continue;
          }

          // 生成唯一檔名
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const filePath = folder ? `${folder}/${fileName}` : fileName;

          // 上傳到 Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            setError("上傳失敗，請稍後再試");
            continue;
          }

          // 取得公開 URL
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(filePath);

          newUrls.push(publicUrl);

          // 檢查是否超過最大數量
          if (multiple && images.length + newUrls.length >= maxFiles) {
            break;
          }
        }

        if (newUrls.length > 0) {
          if (multiple) {
            const updatedImages = [...images, ...newUrls].slice(0, maxFiles);
            onChange(updatedImages);
          } else {
            onChange(newUrls[0]);
          }
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError("上傳失敗，請稍後再試");
      } finally {
        setUploading(false);
        // 清除 input 以便重複上傳同檔案
        e.target.value = "";
      }
    },
    [bucket, folder, images, maxFiles, maxSizeMB, multiple, onChange]
  );

  const handleRemove = useCallback(
    (indexOrUrl: number | string) => {
      if (multiple) {
        const index =
          typeof indexOrUrl === "number"
            ? indexOrUrl
            : images.indexOf(indexOrUrl as string);
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages.length > 0 ? newImages : null);
      } else {
        onChange(null);
      }
    },
    [images, multiple, onChange]
  );

  const canUploadMore = multiple ? images.length < maxFiles : images.length === 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* 已上傳的圖片 */}
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-3",
            multiple ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"
          )}
        >
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={url}
                alt={`上傳的圖片 ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 上傳區域 */}
      {canUploadMore && !disabled && (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            uploading
              ? "cursor-not-allowed border-muted bg-muted/50"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">上傳中...</span>
            </>
          ) : (
            <>
              <div className="mb-2 rounded-full bg-primary/10 p-3">
                {images.length === 0 ? (
                  <ImageIcon className="h-6 w-6 text-primary" />
                ) : (
                  <Upload className="h-6 w-6 text-primary" />
                )}
              </div>
              <span className="text-sm font-medium">
                {images.length === 0 ? "上傳圖片" : "繼續上傳"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {multiple
                  ? `最多 ${maxFiles} 張，每張 ${maxSizeMB}MB 以內`
                  : `${maxSizeMB}MB 以內`}
              </span>
            </>
          )}
        </label>
      )}

      {/* 錯誤訊息 */}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
