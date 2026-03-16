const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.ogg', '.mkv', '.avi', '.m4v'];

export const resolveMediaUrl = (path) => {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_ORIGIN}${path}`;
};

export const isVideoMedia = (path = '') => {
  const lower = path.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
};
