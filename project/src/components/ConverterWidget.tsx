import React, { useState, useRef } from 'react';
import { Upload, ShieldAlert, CheckCircle, Download, Sparkles, X, Loader } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  compressedUrl?: string;
  compressedSize?: number;
  originalSize: number;
}

export const ConverterWidget: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [processing, setProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList) => {
    const validImages = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    
    if (validImages.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please select valid image files (PNG, JPG, WEBP, etc.)' });
      return;
    }

    const fileObjects = validImages.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      originalSize: file.size
    }));

    setFiles(prev => [...prev, ...fileObjects]);
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
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Helper: load image onto HTMLImageElement
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
    setStatusMessage({ type: 'success', text: 'Processing compression studio offline...' });

    try {
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
      setStatusMessage({ type: 'success', text: 'Compression completed offline! Download your optimized files below.' });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Offline compression failed. Ensure images are not corrupted.' });
    } finally {
      setProcessing(false);
    }
  };

  // 2. Client-Side PDF Compiler
  const compileToPDF = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setStatusMessage({ type: 'success', text: 'Compiling PDF document locally...' });

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
        // If they compressed it, use the compressed image version
        const imgSrc = fileObj.compressedUrl || fileObj.previewUrl;
        const img = await loadImage(imgSrc);

        // Calculate aspect-ratio bounding dimensions inside A4 page limits
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const ratio = imgWidth / imgHeight;

        let finalWidth = pdfWidth - 20; // 10mm padding on sides
        let finalHeight = finalWidth / ratio;

        if (finalHeight > (pdfHeight - 20)) {
          finalHeight = pdfHeight - 20;
          finalWidth = finalHeight * ratio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        if (i > 0) {
          doc.addPage();
        }

        // Draw image onto PDF page
        doc.addImage(imgSrc, 'JPEG', x, y, finalWidth, finalHeight);
      }

      doc.save('konvert_offline_compiled.pdf');
      setStatusMessage({ type: 'success', text: 'PDF compiled successfully! File downloaded automatically.' });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to compile PDF locally. Check file integrity.' });
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
  };

  return (
    <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '2rem', borderRadius: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Sparkles className="text-emerald" style={{ width: '22px', height: '22px' }} />
        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Local Offline Studio (Guest Preview)</h3>
      </div>
      
      {/* Informative Alert */}
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
        <span>All operations below run <strong>100% on-device</strong> inside your browser. Your files never leave your device.</span>
      </div>

      {/* Drag & Drop Area */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerInput}
        style={{
          border: dragActive ? '2px dashed var(--emerald-500)' : '2px dashed var(--border-color)',
          background: dragActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0,0,0,0.15)',
          padding: '2.5rem 1.5rem',
          borderRadius: '1rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        <Upload className="text-emerald" style={{ width: '40px', height: '40px', margin: '0 auto 1rem auto' }} />
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Drag &amp; Drop Images here</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supports PNG, JPG, WEBP (Max 20MB per file)</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          multiple 
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '0.75rem 1rem', 
          borderRadius: '0.75rem', 
          fontSize: '0.9rem',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: statusMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
          color: statusMessage.type === 'success' ? 'var(--emerald-500)' : '#f87171'
        }}>
          {statusMessage.type === 'success' ? <CheckCircle style={{ width: '18px', height: '18px' }} /> : <ShieldAlert style={{ width: '18px', height: '18px' }} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Selected Files ({files.length})</span>
            <button onClick={clearAll} style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '0.85rem', cursor: 'pointer' }}>Clear All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {files.map(fileObj => (
              <div 
                key={fileObj.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem', 
                  background: 'rgba(0,0,0,0.15)', 
                  border: 'var(--glass-border)', 
                  borderRadius: '0.75rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <img src={fileObj.previewUrl} alt="Thumbnail" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem', border: 'var(--glass-border)' }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>{fileObj.file.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Size: {formatSize(fileObj.originalSize)}</span>
                      {fileObj.compressedSize && (
                        <span style={{ color: 'var(--emerald-500)', marginLeft: '0.5rem' }}>
                          → {formatSize(fileObj.compressedSize)} ({((1 - fileObj.compressedSize / fileObj.originalSize) * 100).toFixed(0)}% Saved)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {fileObj.compressedUrl && (
                    <button 
                      onClick={() => triggerSingleDownload(fileObj)} 
                      style={{ background: 'var(--primary-gradient)', border: 'none', borderRadius: '0.35rem', padding: '0.25rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'white' }}
                      title="Download compressed version"
                    >
                      <Download style={{ width: '14px', height: '14px' }} />
                    </button>
                  )}
                  <button 
                    onClick={() => removeFile(fileObj.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <X style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: 'var(--glass-border)', margin: '1.5rem 0' }} />

          {/* Settings & Core Commands */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="compression-slider" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Compression Quality: {quality}%</label>
            </div>
            <input 
              id="compression-slider"
              type="range" 
              min="10" 
              max="100" 
              value={quality} 
              onChange={(e) => setQuality(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--emerald-500)', marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={compressImages} 
                disabled={processing}
                className="btn btn-outline" 
                style={{ 
                  flex: 1, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  justifyContent: 'center', 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-main)' 
                }}
              >
                {processing ? <Loader className="spin" style={{ width: '16px', height: '16px' }} /> : null}
                Compress Images
              </button>
              <button 
                onClick={compileToPDF} 
                disabled={processing}
                className="btn" 
                style={{ 
                  flex: 1, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  justifyContent: 'center' 
                }}
              >
                {processing ? <Loader className="spin" style={{ width: '16px', height: '16px' }} /> : null}
                Compile to PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
