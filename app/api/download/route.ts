import { NextRequest } from 'next/server';

// In demo mode, we stream a sample video/audio file from a public CDN and set filename accordingly.

const SAMPLE_MAP: Record<string, { url: string; filename: string; contentType: string }> = {
  'mp4-360': { url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', filename: 'sample-360p.mp4', contentType: 'video/mp4' },
  'mp4-720': { url: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4', filename: 'sample-720p.mp4', contentType: 'video/mp4' },
  'webm-1080': { url: 'https://samplelib.com/lib/preview/webm/sample-10s.webm', filename: 'sample-1080p.webm', contentType: 'video/webm' },
  'mp3-128': { url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3', filename: 'sample-128kbps.mp3', contentType: 'audio/mpeg' }
};

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');
  const itag = req.nextUrl.searchParams.get('itag') || 'mp4-360';
  if (!urlParam) return new Response('Missing url', { status: 400 });

  const sample = SAMPLE_MAP[itag];
  if (!sample) return new Response('Unknown itag', { status: 400 });

  const upstream = await fetch(sample.url, { cache: 'no-store' });
  if (!upstream.ok || !upstream.body) return new Response('Upstream failed', { status: 502 });

  return new Response(upstream.body, {
    headers: {
      'Content-Type': sample.contentType,
      'Content-Disposition': `attachment; filename="${sample.filename}"`,
      'Cache-Control': 'no-store'
    }
  });
}
