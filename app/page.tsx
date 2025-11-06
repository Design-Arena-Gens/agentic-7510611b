"use client";

import { useEffect, useMemo, useState } from 'react';
import { saveSearchToHistory } from '@/lib/history';
import { getFormatsForUrl, type FormatOption, requestDownload } from '@/lib/downloaderClient';
import { addDownloadRecord } from '@/lib/downloads';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [formats, setFormats] = useState<FormatOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tryClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && /https?:\/\//i.test(text)) {
          setUrl(text);
        }
      } catch {}
    };
    tryClipboard();
  }, []);

  const supported = useMemo(
    () => [
      'YouTube', 'Facebook', 'Instagram', 'TikTok', 'Vimeo', 'Dailymotion', 'Twitter/X', 'Twitch', 'Reddit'
    ],
    []
  );

  const onAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setFormats(null);
    try {
      const res = await getFormatsForUrl(url.trim());
      setFormats(res.formats);
      await saveSearchToHistory(url.trim());
    } catch (e: any) {
      setError(e?.message || 'Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  const onDownload = async (format: FormatOption) => {
    try {
      const { blob, filename, mimeType } = await requestDownload(url.trim(), format.itag);
      const objectUrl = URL.createObjectURL(blob);

      // Offer Save File dialog
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      await addDownloadRecord({
        sourceUrl: url.trim(),
        title: filename,
        thumbnail: '',
        formatLabel: format.label,
        sizeBytes: blob.size,
        mimeType,
        objectUrl,
        createdAt: Date.now()
      });
    } catch (e: any) {
      alert(e?.message || 'Download failed');
    }
  };

  return (
    <div className="grid" style={{gap: 16}}>
      <div className="card">
        <h1>Download videos from popular platforms</h1>
        <p className="meta">Paste a video URL to analyze and download. Multiple qualities and formats supported.</p>
        <div className="sep" />
        <label className="a11yHidden" htmlFor="url">Video URL</label>
        <div className="grid" style={{gap: 8}}>
          <input id="url" className="input" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
          <div className="row" style={{gap: 8}}>
            <button className="btn btnPrimary" onClick={onAnalyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
            <button className="btn" onClick={() => setUrl('')}>Clear</button>
          </div>
        </div>
        <div className="sep" />
        <div>
          <div className="meta" style={{marginBottom: 8}}>Supported platforms</div>
          <div className="chips">
            {supported.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      </div>

      {error && <div className="card" style={{borderColor: '#7f1d1d'}}>Error: {error}</div>}

      {formats && (
        <div className="card">
          <h2>Available formats</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Quality</th>
                <th>Format</th>
                <th>Approx. Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formats.map((f) => (
                <tr key={f.itag}>
                  <td>{f.qualityLabel}</td>
                  <td><span className="badge">{f.container}</span> {f.label}</td>
                  <td>{f.sizeLabel}</td>
                  <td><button className="btn btnPrimary" onClick={() => onDownload(f)}>Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
