"use client";

import { useEffect, useMemo, useState } from 'react';
import { clearSearchHistory, deleteSearchItem, getSearchHistory } from '@/lib/history';

export default function HistoryPage() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<{ url: string; createdAt: number }[]>([]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) => i.url.toLowerCase().includes(needle));
  }, [q, items]);

  const reload = async () => setItems(await getSearchHistory());

  useEffect(() => { reload(); }, []);

  return (
    <div className="grid" style={{gap: 16}}>
      <div className="card">
        <h1>Search history</h1>
        <div className="row" style={{justifyContent: 'space-between'}}>
          <input className="input" placeholder="Filter..." value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn" onClick={async () => { await clearSearchHistory(); await reload(); }}>Clear all</button>
        </div>
        <div className="sep" />
        <div>
          {filtered.map((i) => (
            <div key={i.createdAt + i.url} className="item">
              <div className="thumb" />
              <div>
                <div style={{fontWeight: 600}}>{i.url}</div>
                <div className="meta">{new Date(i.createdAt).toLocaleString()}</div>
              </div>
              <div className="row">
                <a className="btn" href={`/?prefill=${encodeURIComponent(i.url)}`}>Re-download</a>
                <button className="btn" onClick={async () => { await deleteSearchItem(i.createdAt); await reload(); }}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="meta">No history</div>}
        </div>
      </div>
    </div>
  );
}
