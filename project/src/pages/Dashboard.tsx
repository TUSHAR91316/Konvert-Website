import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, RefreshCw, CheckCircle, AlertTriangle, Play, HelpCircle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

export const Dashboard: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('konvert_test_backend_url') || 'http://localhost:5000';
  });
  const [testing, setTesting] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addLog = (type: 'info' | 'success' | 'error', message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ timestamp: time, type, message }, ...prev]);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setBackendUrl(value);
    localStorage.setItem('konvert_test_backend_url', value);
  };

  const testPing = async () => {
    if (!backendUrl) {
      addLog('error', 'Backend URL cannot be empty.');
      return;
    }

    setTesting(true);
    setPingStatus('idle');
    setLatency(null);
    addLog('info', `Initiating ping test to: ${backendUrl}`);

    const startTime = Date.now();
    try {
      // Clean up trailing slash
      const url = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      
      // Perform a ping check. We make a GET request to /convert.
      // Since it's a POST endpoint, the server will return 405 Method Not Allowed if online,
      // which is a success because it proves the server is reachable and active.
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      addLog('info', 'Sending preflight checks...');
      
      const response = await fetch(`${url}/convert`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'ngrok-skip-browser-warning': 'true' // Skip ngrok warnings if user is using ngrok
        }
      });
      
      clearTimeout(id);
      const duration = Date.now() - startTime;
      setLatency(duration);

      // 405 Method Not Allowed or 422 Unprocessable Entity mean the server is running and CORS is configured
      if (response.status === 405 || response.status === 422) {
        setPingStatus('success');
        addLog('success', `Connection successful! Latency: ${duration}ms (Response status: ${response.status})`);
      } else {
        setPingStatus('warning');
        addLog('success', `Server reachable, but returned unexpected code: ${response.status}. Cors and API are active.`);
      }
    } catch (err: any) {
      setPingStatus('error');
      
      if (err.name === 'AbortError') {
        addLog('error', `Connection timed out after 8s. Check if your Docker container is frozen or proxy is slow.`);
      } else {
        addLog('error', `Network error: ${err.message || 'Connection refused.'}`);
        addLog('error', `Troubleshooting: Make sure the container is running and CORS is configured to allow queries from this domain.`);
      }
    } finally {
      setTesting(false);
    }
  };

  const runMockConversion = async () => {
    if (!backendUrl) {
      addLog('error', 'Backend URL cannot be empty.');
      return;
    }

    setTesting(true);
    addLog('info', 'Starting mock end-to-end document conversion test...');
    
    try {
      const url = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      
      // Create a mock txt file client-side
      const mockText = "Hello Konvert! This is a test conversion document generated locally by the web dashboard to check LibreOffice compile integrity.";
      const blob = new Blob([mockText], { type: 'text/plain' });
      const file = new File([blob], 'mock_test_doc.txt', { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('file', file);

      addLog('info', 'Uploading test text document to /convert?target_format=pdf...');
      
      const startTime = Date.now();
      const response = await fetch(`${url}/convert?target_format=pdf`, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      const duration = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No detail');
        throw new Error(`Server returned error code ${response.status}: ${errorText}`);
      }

      // Check if output is a PDF
      const blobResult = await response.blob();
      addLog('info', `Received response. Content-Type: ${blobResult.type}, Size: ${(blobResult.size / 1024).toFixed(2)} KB`);

      if (blobResult.type.includes('pdf') || blobResult.size > 100) {
        addLog('success', `Mock conversion succeeded in ${duration}ms! LibreOffice compiled the TXT file into a PDF successfully.`);
      } else {
        addLog('error', `Success response, but response type is not a PDF: ${blobResult.type}`);
      }
    } catch (err: any) {
      addLog('error', `Mock conversion failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <main className="page-container" style={{ paddingBottom: '4rem' }}>
      <Link to="/self-hosting" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Self-Hosting Guide
      </Link>

      <section className="page-hero reveal visible" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Backend Connection Tester
        </h1>
        <p className="section-subtitle">Validate that your local Docker microservice and Ngrok/Cloudflare tunnels are working correctly.</p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }} className="reveal visible">
        {/* Left Side Settings */}
        <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="backend-url-input" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Self-Hosted Server URL
            </label>
            <input 
              id="backend-url-input"
              type="text" 
              placeholder="e.g. http://localhost:5000" 
              value={backendUrl}
              onChange={handleUrlChange}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'var(--glass-border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text-main)', outline: 'none' }}
            />
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Use <code style={{ fontFamily: 'monospace' }}>http://localhost:5000</code> for local desk tests, or your ngrok address for external check tunnels.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn" 
              onClick={testPing} 
              disabled={testing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
            >
              <RefreshCw className={testing ? 'spin' : ''} style={{ width: '16px', height: '16px' }} />
              Ping Check
            </button>
            <button 
              className="btn btn-outline" 
              onClick={runMockConversion} 
              disabled={testing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              <Play style={{ width: '16px', height: '16px' }} />
              Test Conversion
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: 'var(--glass-border)', margin: '0.5rem 0' }} />

          {/* Connection Status Panel */}
          <div>
            <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity style={{ width: '18px', height: '18px' }} />
              Connection Diagnostics
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Status Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Server Status:</span>
                {pingStatus === 'idle' && <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Not Tested</span>}
                {pingStatus === 'success' && (
                  <span style={{ color: 'var(--emerald-500)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle style={{ width: '16px', height: '16px' }} /> Online
                  </span>
                )}
                {pingStatus === 'warning' && (
                  <span style={{ color: '#eab308', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertTriangle style={{ width: '16px', height: '16px' }} /> Warning
                  </span>
                )}
                {pingStatus === 'error' && (
                  <span style={{ color: '#ef4444', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertTriangle style={{ width: '16px', height: '16px' }} /> Offline
                  </span>
                )}
              </div>

              {/* Latency Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Response Latency:</span>
                <span style={{ fontWeight: 600 }}>{latency !== null ? `${latency} ms` : '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Logging console */}
        <div className="card" style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '1.5rem', overflow: 'hidden' }}>
          <div style={{ background: '#1e293b', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#cbd5e1', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: testing ? '#eab308' : '#10b981', display: 'inline-block' }}></span>
              Diagnostic logs
            </span>
            <button 
              onClick={() => setLogs([])}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Clear Console
            </button>
          </div>

          <div style={{ padding: '1.5rem', minHeight: '300px', maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column-reverse', gap: '0.75rem', color: '#e2e8f0' }}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} style={{ borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', marginRight: '0.5rem' }}>[{log.timestamp}]</span>
                  <span style={{ 
                    color: log.type === 'success' ? '#10b981' : log.type === 'error' ? '#f87171' : '#38bdf8',
                    fontWeight: log.type !== 'info' ? 600 : 'normal'
                  }}>
                    {log.message}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', margin: 'auto' }}>
                Console idle. Run ping check or conversion test to check responses.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Troubleshooting guide */}
      <section className="reveal visible" style={{ marginTop: '3rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <HelpCircle className="text-emerald" />
          Common Connection Issues
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1.5rem', borderRadius: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>1. CORS Blocks (Cross-Origin Request Blocked)</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Browsers block client requests if the server does not allow CORS. The official Docker container includes CORS wildcard config by default. If using custom proxies, verify CORS filters are enabled.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1.5rem', borderRadius: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>2. Mixed Content Errors (HTTPS vs HTTP)</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              If this website is loaded over HTTPS, testing a backend URL using HTTP (<code style={{ fontFamily: 'monospace' }}>http://localhost:5000</code>) might be blocked by browser security guidelines. Use secure tunnels like Ngrok (HTTPS) to verify.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--card-bg)', border: 'var(--glass-border)', padding: '1.5rem', borderRadius: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>3. Port binding issues</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Make sure that port 5000 is not being blocked by another app on your machine. You can bind to a different port when starting Docker, e.g., <code style={{ fontFamily: 'monospace' }}>-p 8080:5000</code>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
