import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, ShieldAlert, CheckCircle2, Download, Sparkles, 
  X, Loader, FileText, Sliders, Trash2 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { 
  type UploadedFile, 
  QUALITY_PRESETS, 
  formatFileSize, 
  compressSingleImage, 
  compileImagesToPdf, 
  revokeFileUrls 
} from '../services/converterService';

export const ConverterWidget: React.FC = () => {
  const { showToast } = useToast();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quality, setQuality] = useState<number>(75);
  const [processing, setProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<UploadedFile[]>(files);
  filesRef.current = files;

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      filesRef.current.forEach(revokeFileUrls);
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
        revokeFileUrls(target);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach(revokeFileUrls);
    setFiles([]);
    setStatusMessage(null);
    showToast('Queue cleared', 'info');
  };

  // Client-Side Image Compression
  const compressImages = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      let totalSaved = 0;
      const updatedFiles: UploadedFile[] = [];

      for (const fileObj of files) {
        const result = await compressSingleImage(fileObj, quality);
        totalSaved += result.savedBytes;
        updatedFiles.push(result.file);
      }

      setFiles(updatedFiles);
      setStatusMessage({
        type: 'success',
        text: `Successfully compressed ${files.length} images! Reduced total size by ${formatFileSize(totalSaved)}.`
      });
      showToast(`Compression finished! Saved ${formatFileSize(totalSaved)}`, 'success');
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'An error occurred during local image processing.'
      });
      showToast('Image compression encountered an error', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Client-Side PDF Compilation
  const compilePdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const pdfBlob = await compileImagesToPdf(files);
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `konvert-compiled-${Date.now()}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      setStatusMessage({
        type: 'success',
        text: `Compiled ${files.length} pages into a unified PDF document.`
      });
      showToast('PDF compiled & downloaded!', 'success');
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to compile images to PDF document.'
      });
      showToast('Failed to compile PDF', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const totalOriginalSize = files.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressedSize = files.reduce((acc, f) => acc + (f.compressedSize || f.originalSize), 0);
  const hasCompressedFiles = files.some(f => f.compressedUrl);

  return (
    <div className="card" style={{ padding: '2rem' }}>
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleFiles(e.target.files)} 
        multiple 
        accept="image/png, image/jpeg, image/webp" 
        style={{ display: 'none' }} 
      />

      {/* Drag and Drop Zone */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerInput}
        style={{
          border: `2px dashed ${dragActive ? 'var(--emerald-500)' : 'var(--border-color)'}`,
          background: dragActive ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary)',
          borderRadius: '0.75rem',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '2rem'
        }}
      >
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
          <Upload className="text-emerald" style={{ width: '26px', height: '26px' }} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Drop images here or click to browse
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
          Supports PNG, JPG, and WEBP. Processed 100% inside your browser memory.
        </p>
      </div>

      {/* Controls & Queue Section */}
      {files.length > 0 && (
        <div>
          {/* Quality Presets & Slider */}
          <div className="solid-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.925rem' }}>
                <Sliders style={{ width: '16px', height: '16px', color: 'var(--emerald-500)' }} />
                <span>Compression Quality: <strong className="text-emerald">{quality}%</strong></span>
              </div>

              {/* Quality Presets */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {QUALITY_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => setQuality(preset.value)}
                    className={`category-pill-btn${quality === preset.value ? ' active' : ''}`}
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <input 
              type="range" 
              id="quality-slider"
              min="10" 
              max="95" 
              value={quality} 
              onChange={(e) => setQuality(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--emerald-500)', cursor: 'pointer' }}
            />
          </div>

          {/* Queue Statistics Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>{files.length} file(s) loaded &bull; Original Total: <strong>{formatFileSize(totalOriginalSize)}</strong></span>
              {hasCompressedFiles && (
                <span style={{ marginLeft: '0.5rem', color: 'var(--emerald-500)' }}>
                  &rarr; Compressed: <strong>{formatFileSize(totalCompressedSize)}</strong>
                </span>
              )}
            </div>

            <button 
              onClick={clearAll}
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 style={{ width: '13px', height: '13px' }} />
              <span>Clear All</span>
            </button>
          </div>

          {/* File Items Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {files.map((fileObj) => (
              <div 
                key={fileObj.id} 
                className="solid-card" 
                style={{ position: 'relative', overflow: 'hidden', padding: '0.65rem', display: 'flex', flexDirection: 'column' }}
              >
                <button 
                  onClick={() => removeFile(fileObj.id)}
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    right: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X style={{ width: '14px', height: '14px' }} />
                </button>

                <div style={{ height: '110px', background: 'var(--bg-secondary)', borderRadius: '0.375rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <img 
                    src={fileObj.previewUrl} 
                    alt={fileObj.file.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.2rem' }}>
                  {fileObj.file.name}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{formatFileSize(fileObj.originalSize)}</span>
                  {fileObj.compressedSize && (
                    <span className="text-emerald" style={{ fontWeight: 600 }}>
                      {formatFileSize(fileObj.compressedSize)}
                    </span>
                  )}
                </div>

                {fileObj.compressedUrl && (
                  <a 
                    href={fileObj.compressedUrl} 
                    download={`compressed-${fileObj.file.name}`}
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem', padding: '0.35rem', fontSize: '0.75rem', width: '100%' }}
                  >
                    <Download style={{ width: '12px', height: '12px' }} />
                    <span>Download</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Action Execution Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button 
              onClick={compressImages} 
              disabled={processing}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '200px' }}
            >
              {processing ? (
                <Loader className="spin" style={{ width: '16px', height: '16px' }} />
              ) : (
                <Sparkles style={{ width: '16px', height: '16px' }} />
              )}
              <span>{processing ? 'Processing in Memory...' : `Compress ${files.length} Image(s)`}</span>
            </button>

            <button 
              onClick={compilePdf} 
              disabled={processing}
              className="btn btn-secondary-solid"
              style={{ flex: 1, minWidth: '200px' }}
            >
              {processing ? (
                <Loader className="spin" style={{ width: '16px', height: '16px' }} />
              ) : (
                <FileText style={{ width: '16px', height: '16px' }} />
              )}
              <span>Compile into Multi-Page PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Status Feedback Message */}
      {statusMessage && (
        <div 
          style={{
            padding: '0.85rem 1.15rem',
            borderRadius: '0.5rem',
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.875rem',
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            color: statusMessage.type === 'success' ? 'var(--emerald-500)' : '#ef4444'
          }}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 style={{ width: '17px', height: '17px', flexShrink: 0 }} />
          ) : (
            <ShieldAlert style={{ width: '17px', height: '17px', flexShrink: 0 }} />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};
