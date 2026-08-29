import { jsPDF } from 'jspdf';

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  compressedUrl?: string;
  compressedSize?: number;
  originalSize: number;
}

export const QUALITY_PRESETS = [
  { label: 'High Quality', value: 90 },
  { label: 'Balanced', value: 75 },
  { label: 'High Compression', value: 50 },
] as const;

/**
 * Format bytes into human-readable representation (e.g. 1.2 MB, 350 KB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Safely load an image from a URL or Blob source into an HTMLImageElement
 */
export const loadImageElement = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

/**
 * Compress a single image file via HTML5 Canvas in browser memory
 */
export const compressSingleImage = async (
  fileObj: UploadedFile,
  qualityPercent: number
): Promise<{ file: UploadedFile; savedBytes: number }> => {
  const img = await loadImageElement(fileObj.previewUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  return new Promise<{ file: UploadedFile; savedBytes: number }>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve({ file: fileObj, savedBytes: 0 });
          return;
        }
        const compressedUrl = URL.createObjectURL(blob);
        const savedBytes = Math.max(0, fileObj.originalSize - blob.size);
        resolve({
          file: {
            ...fileObj,
            compressedUrl,
            compressedSize: blob.size,
          },
          savedBytes,
        });
      },
      'image/jpeg',
      qualityPercent / 100
    );
  });
};

/**
 * Compile a list of images into a single multi-page PDF document
 */
export const compileImagesToPdf = async (files: UploadedFile[]): Promise<Blob> => {
  if (files.length === 0) throw new Error('No files provided for PDF compilation');

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < files.length; i++) {
    const current = files[i];
    const sourceUrl = current.compressedUrl || current.previewUrl;
    const img = await loadImageElement(sourceUrl);

    if (i > 0) {
      pdf.addPage();
    }

    const scale = Math.min(pageWidth / img.naturalWidth, pageHeight / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (pageWidth - w) / 2;
    const y = (pageHeight - h) / 2;

    pdf.addImage(img, 'JPEG', x, y, w, h);
  }

  return pdf.output('blob');
};

/**
 * Revoke object URLs to prevent browser memory leaks
 */
export const revokeFileUrls = (file: UploadedFile): void => {
  if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
  if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
};
