const router = require('express').Router();
const https = require('https');
const config = require('../config');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// GET /api/youtube/videos  — returns latest videos from configured channel
router.get('/videos', async (req, res) => {
  const { apiKey, channelId } = config.youtube;

  if (!apiKey || !channelId) {
    return res.json({ success: false, message: 'YouTube not configured', data: [] });
  }

  try {
    const maxResults = Math.min(parseInt(req.query.limit) || 12, 24);

    // Step 1: get uploads playlist ID from channel
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelData = await httpsGet(channelUrl);

    if (!channelData.items?.length) {
      return res.json({ success: false, message: 'Channel not found', data: [] });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Step 2: get videos from uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
    const playlistData = await httpsGet(playlistUrl);

    const videos = (playlistData.items || []).map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));

    return res.json({ success: true, data: videos });
  } catch (err) {
    console.error('YouTube API error:', err.message);
    return res.json({ success: false, message: 'Failed to fetch videos', data: [] });
  }
});

module.exports = router;
