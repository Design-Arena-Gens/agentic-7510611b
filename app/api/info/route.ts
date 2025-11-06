import { NextRequest, NextResponse } from 'next/server';

// DEMO metadata and formats. In production, proxy to an extractor service.
function demoFormats(url: string) {
  const base: any = {
    title: 'Sample Video',
    thumb: '',
    formats: [
      { itag: 'mp4-360', label: 'H.264 + AAC', container: 'mp4', qualityLabel: '360p', sizeLabel: '~5 MB' },
      { itag: 'mp4-720', label: 'H.264 + AAC', container: 'mp4', qualityLabel: '720p', sizeLabel: '~15 MB' },
      { itag: 'webm-1080', label: 'VP9 + Opus', container: 'webm', qualityLabel: '1080p', sizeLabel: '~30 MB' },
      { itag: 'mp3-128', label: 'Audio only', container: 'mp3', qualityLabel: 'Audio 128kbps', sizeLabel: '~3 MB' }
    ]
  };
  if (/youtu|youtube|youtu\.be/i.test(url)) base.title = 'YouTube Sample';
  if (/tiktok/i.test(url)) base.title = 'TikTok Sample';
  if (/instagram|fb|facebook|twitter|x\.com/i.test(url)) base.title = 'Social Sample';
  return base;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  // For this deployment we return demo formats. Replace with real extractor integration.
  return NextResponse.json(demoFormats(url));
}
