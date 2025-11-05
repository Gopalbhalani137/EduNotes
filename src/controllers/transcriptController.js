// src/controllers/transcriptController.js
const transcriptService = require('../services/transcriptService');
const Video = require('../models/videoModel');

/**
 * @desc    Fetch transcript from YouTube video
 * @route   POST /api/transcript/fetch
 * @access  Private
 */
const getTranscript = async (req, res, next) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required'
      });
    }

    // Validate YouTube URL
    if (!transcriptService.isValidYouTubeUrl(videoUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    // Fetch transcript
    const videoData = await transcriptService.fetchTranscript(videoUrl);

    // Check if video already exists in database
    let video = await Video.findOne({ videoId: videoData.videoId });

    if (!video) {
      // Save video to database
      video = await Video.create({
        videoId: videoData.videoId,
        url: videoUrl,
        title: req.body.title || `Video ${videoData.videoId}`,
        transcript: videoData.transcript,
        uploadedBy: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transcript fetched successfully',
      data: {
        videoId: video.videoId,
        title: video.title,
        transcript: video.transcript,
        transcriptLength: video.transcript.length,
        _id: video._id
      }
    });
  } catch (error) {
    console.error('Transcript fetch error:', error.message);
    next(error);
  }
};

/**
 * @desc    Get video by ID
 * @route   GET /api/transcript/:videoId
 * @access  Private
 */
const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { video }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTranscript,
  getVideoById
};