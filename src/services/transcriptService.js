// src/services/transcriptService.js
const { YoutubeTranscript } = require('youtube-transcript');

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube video URL
 * @returns {string} Video ID
 */
const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  throw new Error('Invalid YouTube URL');
};

/**
 * Fetch transcript from YouTube video
 * @param {string} videoUrl - YouTube video URL
 * @returns {object} Transcript data
 */
const fetchTranscript = async (videoUrl) => {
  try {
    // Extract video ID
    const videoId = extractVideoId(videoUrl);

    // Fetch transcript
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptData || transcriptData.length === 0) {
      throw new Error('No transcript available for this video');
    }

    // Format transcript
    const transcript = transcriptData
      .map(item => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Get video metadata (basic info from URL)
    const videoInfo = {
      videoId,
      url: videoUrl,
      transcript,
      transcriptSegments: transcriptData.length
    };

    return videoInfo;
  } catch (error) {
    if (error.message.includes('Invalid YouTube URL')) {
      throw error;
    }
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }
};

/**
 * Validate YouTube URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid YouTube URL
 */
const isValidYouTubeUrl = (url) => {
  try {
    extractVideoId(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  fetchTranscript,
  extractVideoId,
  isValidYouTubeUrl
};