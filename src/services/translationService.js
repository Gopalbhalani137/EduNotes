// src/services/translationService.js
const axios = require('axios');

/**
 * Translate text using Google Translate API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'es', 'fr', 'hi')
 * @param {string} sourceLang - Source language (default: 'en')
 * @returns {object} Translation result
 */
const translateText = async (text, targetLang, sourceLang = 'en') => {
    try {
        // Using Google Translate API
        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

        if (!apiKey) {
            throw new Error('Google Translate API key not configured');
        }

        const url = `https://translation.googleapis.com/language/translate/v2`;

        const response = await axios.post(url, {
            q: text,
            target: targetLang,
            source: sourceLang,
            format: 'text'
        }, {
            params: {
                key: apiKey
            }
        });

        const translatedText = response.data.data.translations[0].translatedText;
        const detectedSourceLang = response.data.data.translations[0].detectedSourceLanguage || sourceLang;

        return {
            translatedText,
            sourceLang: detectedSourceLang,
            targetLang
        };
    } catch (error) {
        console.error('Translation error:', error.message);

        // Fallback: Return original text if translation fails
        if (error.response?.status === 403 || !process.env.GOOGLE_TRANSLATE_API_KEY) {
            console.warn('Translation API not available, using fallback');
            return {
                translatedText: text,
                sourceLang,
                targetLang,
                fallback: true
            };
        }

        throw new Error(`Translation failed: ${error.message}`);
    }
};

/**
 * Detect language of text
 * @param {string} text - Text to analyze
 * @returns {object} Language detection result
 */
const detectLanguage = async (text) => {
    try {
        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

        if (!apiKey) {
            return { language: 'en', confidence: 0 };
        }

        const url = `https://translation.googleapis.com/language/translate/v2/detect`;

        const response = await axios.post(url, {
            q: text.substring(0, 1000) // Use first 1000 chars for detection
        }, {
            params: {
                key: apiKey
            }
        });

        const detection = response.data.data.detections[0][0];

        return {
            language: detection.language,
            confidence: detection.confidence
        };
    } catch (error) {
        console.error('Language detection error:', error.message);
        return { language: 'en', confidence: 0 };
    }
};

/**
 * Get list of supported languages
 * @returns {array} List of supported languages
 */
const getSupportedLanguages = () => {
    return [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'hi', name: 'Hindi' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'it', name: 'Italian' }
    ];
};

module.exports = {
    translateText,
    detectLanguage,
    getSupportedLanguages
};