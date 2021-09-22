export default function getYouTubeAPIKey() {
    const youtube_api_keys = require(__dirname + '/../settings');
    const keys = youtube_api_keys["youtube_api_keys"];
    return keys[Math.floor(Math.random() * keys.length)];
}