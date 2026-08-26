import React, { useState, useRef } from 'react';
import { 
  Upload, ShieldAlert, CheckCircle2, Download, Sparkles, 
  X, Loader, FileText, Sliders, Trash2 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useToast } from '../context/ToastContext';

interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  compressedUrl?: string;
  compressedSize?: number;
  originalSize: number;
}

const QUALITY_PRESETS = [
  { label: 'High Quality', value: 90 },
  { label: 'Balanced', value: 75 },
  { label: 'High Compression', value: 50 },
];

export const ConverterWidget: React.FC = () => {
  const { showToast } = useToast();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quality, setQuality] = useState<number>(75);
  const [processing, setProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<UploadedFile[]>(files);
  filesRef.current = files;

  // Clean up object URLs on component unmount
  React.useEffect(() => {
    return () => {
      filesRef.current.forEach(f => {
        URL.revokeObjectURL(f.previewUrl);
        if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
      });
    };
  }, []);

  const handleFiles = (newFiles: FileList) => {
    const validImages = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    
    if (validImages.length === 0) {
      showToast('Please select valid image files (PNG, JPG, WEBP)', 'error');
      return;
    }

    const fileObjects = validImages.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      previewUrl: URL.createObjectURL(file),
      originalSize: file.size
    }));

    setFiles(prev => [...prev, ...fileObjects]);
    showToast(`Added ${fileObjects.length} file(s) to queue`, 'info');
    setStatusMessage(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      URL.revokeObjectURL(f.previewUrl);
      if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
    });
    setFiles([]);
    setStatusMessage(null);
    showToast('Queue cleared', 'info');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  // 1. Client-Side Image Compression
  const compressImages = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      let totalSaved = 0;
      const updatedFiles = await Promise.all(
        files.map(async (fileObj) => {
          const img = await loadImage(fileObj.previewUrl);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas not supported');

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          return new Promise<UploadedFile>((resolve) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(fileObj);
                  return;
                }
                const compressedUrl = URL.createObjectURL(blob);
                totalSaved += Math.max(0, fileObj.originalSize - blob.size);
                resolve({
                  ...fileObj,
                  compressedUrl,
                  compressedSize: blob.size
                });
              },
              'image/jpeg',
              quality / 100
            );
          });
        })
      );

      setFiles(updatedFiles);
      showToast(`Compression finished! Reduced size by approx. ${formatSize(totalSaved)}`, 'success');
      setStatusMessage({ type: 'success', text: `Images compressed at ${quality}% quality. Ready to download.` });
    } catch (err) {
      console.error(err);
      showToast('Compression failed. Check image validity.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // 2. Client-Side PDF Compiler
  const compileToPDF = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210;
      const pdfHeight = 297;

      for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        const imgSrc = fileObj.compressedUrl || fileObj.previewUrl;
        const img = await loadImage(imgSrc);

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const ratio = imgWidth / imgHeight;

        let finalWidth = pdfWidth - 20;
        let finalHeight = finalWidth / ratio;

        if (finalHeight > (pdfHeight - 20)) {
          finalHeight = pdfHeight - 20;
          finalWidth = finalHeight * ratio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(imgSrc, 'JPEG', x, y, finalWidth, finalHeight);
      }

      doc.save(`konvert_compiled_${Date.now()}.pdf`);
      showToast('PDF compiled and downloaded automatically!', 'success');
      setStatusMessage({ type: 'success', text: 'PDF compilation completed successfully.' });
    } catch (err) {
      console.error(err);
      showToast('Failed to compile PDF document.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const triggerSingleDownload = (fileObj: UploadedFile) => {
    if (!fileObj.compressedUrl) return;
    const a = document.createElement('a');
    a.href = fileObj.compressedUrl;
    a.download = `optimized_${fileObj.file.name.replace(/\.[^/.]+$/, '')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded optimized ${fileObj.file.name}`, 'info');
  };

  return (
    <div className="solid-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles className="text-emerald" style={{ width: '18px', height: '18px' }} />
          <span>Image &amp; Document Queue</span>
        </h3>
        {files.length > 0 && (
          <button
            onClick={clearAll}
            className="btn btn-secondary-solid"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444' }}
          >
            <Trash2 style={{ width: '13px', height: '13px' }} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerInput}
        style={{
          border: dragActive ? '2px solid var(--emerald-500)' : '2px dashed var(--border-color-strong)',
          background: dragActive ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary)',
          padding: '2.5rem 1.5rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <Upload style={{ width: '32px', height: '32px', margin: '0 auto 0.75rem auto', color: 'var(--emerald-500)' }} />
        <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600 }}>
          Drag &amp; drop files here, or click to browse
        </h4>
        <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Supports PNG, JPG, JPEG, WEBP (Processed in local browser memory)
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          multiple 
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div style={{ 
          marginTop: '1.25rem', 
          padding: '0.75rem 1rem', 
          borderRadius: '0.5rem', 
          fontSize: '0.875rem',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: statusMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
          color: statusMessage.type === 'success' ? 'var(--emerald-500)' : '#ef4444'
        }}>
          {statusMessage.type === 'success' ? <CheckCircle2 style={{ width: '16px', height: '16px' }} /> : <ShieldAlert style={{ width: '16px', height: '16px' }} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto' }}>
            {files.map(fileObj => (
              <div 
                key={fileObj.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 1rem', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '0.625rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <img
                    src={fileObj.previewUrl}
                    alt="Thumbnail"
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                      {fileObj.file.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Size: {formatSize(fileObj.originalSize)}</span>
                      {fileObj.compressedSize && (
                        <span style={{ color: 'var(--emerald-500)', marginLeft: '0.5rem', fontWeight: 600 }}>
                          &rarr; {formatSize(fileObj.compressedSize)} ({((1 - fileObj.compressedSize / fileObj.originalSize) * 100).toFixed(0)}% saved)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {fileObj.compressedUrl && (
                    <button 
                      onClick={() => triggerSingleDownload(fileObj)} 
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                      title="Download compressed image"
                    >
                      <Download style={{ width: '13px', height: '13px' }} />
                    </button>
                  )}
                  <button 
                    onClick={() => removeFile(fileObj.id)}
                    className="modal-close-btn"
                    aria-label="Remove file"
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

          {/* Compression Presets & Custom Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="quality-slider" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Target Quality: {quality}%
              </label>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {QUALITY_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setQuality(preset.value)}
                    className={`btn btn-secondary-solid ${quality === preset.value ? 'active' : ''}`}
                    style={{
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.75rem',
                      background: quality === preset.value ? 'var(--emerald-600)' : 'var(--bg-secondary)',
                      color: quality === preset.value ? '#ffffff' : 'var(--text-main)',
                      borderColor: quality === preset.value ? 'var(--emerald-600)' : 'var(--border-color)'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <input 
              id="quality-slider"
              type="range" 
              min="10" 
              max="100" 
              value={quality} 
              onChange={(e) => setQuality(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--emerald-500)', marginBottom: '1.5rem' }}
            />

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                onClick={compressImages} 
                disabled={processing}
                className="btn btn-secondary-solid" 
                style={{ flex: 1, padding: '0.75rem' }}
              >
                {processing ? <Loader className="spin" style={{ width: '15px', height: '15px' }} /> : <Sliders style={{ width: '15px', height: '15px' }} />}
                <span>Compress Images ({quality}%)</span>
              </button>

              <button 
                onClick={compileToPDF} 
                disabled={processing}
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.75rem' }}
              >
                {processing ? <Loader className="spin" style={{ width: '15px', height: '15px' }} /> : <FileText style={{ width: '15px', height: '15px' }} />}
                <span>Compile to PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
