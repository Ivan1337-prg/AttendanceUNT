import { API_SERVER_URL } from '@env';
import { NativeModules, Platform } from 'react-native';

const TUNNEL_BYPASS_HEADERS = {
  Accept: 'application/json',
  'bypass-tunnel-reminder': 'true',
};

function normalizeBaseUrl(url) {
  return url ? url.replace(/\/$/, '') : null;
}

function getDevServerHost() {
  const scriptUrl = NativeModules?.SourceCode?.scriptURL;

  if (!scriptUrl || typeof scriptUrl !== 'string') {
    return null;
  }

  const match = scriptUrl.match(/^[a-z]+:\/\/([^/:]+)(?::\d+)?/i);
  return match?.[1] || null;
}

function isReachableLanHost(host) {
  if (!host) {
    return false;
  }

  if (/^(localhost|127\.0\.0\.1)$/i.test(host)) {
    return false;
  }

  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) {
    return true;
  }

  return /\.local$/i.test(host);
}

function buildCandidateBaseUrls() {
  const candidateBaseUrls = [];
  const devServerHost = getDevServerHost();

  if (API_SERVER_URL) {
    candidateBaseUrls.push(API_SERVER_URL);
  }

  if (isReachableLanHost(devServerHost)) {
    candidateBaseUrls.push(`http://${devServerHost}:5000`);
  }

  if (Platform.OS === 'android') {
    candidateBaseUrls.push('http://10.0.2.2:5000');
  }

  candidateBaseUrls.push('http://localhost:5000');

  return [...new Set(candidateBaseUrls.map(normalizeBaseUrl).filter(Boolean))];
}

function buildUrl(baseUrl, path) {
  return `${baseUrl}${path}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const error = new Error('The backend returned an HTML page instead of JSON. Check the backend URL or restart Expo so it reconnects to your laptop.');
    error.isRetryableConnectionError = true;
    throw error;
  }

  const payload = await response.json();

  if (!response.ok) {
    const detail = Array.isArray(payload?.detail)
      ? payload.detail.map((item) => item.msg || JSON.stringify(item)).join(', ')
      : payload?.detail;
    const error = new Error(detail || payload.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function requestWithFallback(path, options = {}) {
  const candidateBaseUrls = buildCandidateBaseUrls();
  let lastError = null;

  for (const baseUrl of candidateBaseUrls) {
    try {
      const response = await fetch(buildUrl(baseUrl, path), options);
      return await parseResponse(response);
    } catch (error) {
      const isNetworkError = error instanceof TypeError;
      const isRetryableConnectionError = Boolean(error?.isRetryableConnectionError);

      if (!isNetworkError && !isRetryableConnectionError) {
        throw error;
      }

      lastError = error;
    }
  }

  throw lastError || new Error('Could not reach the backend. Make sure the backend is running on your laptop and restart Expo.');
}

function buildLocationQuery(latitude, longitude) {
  return `latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
}

export function getAttendanceErrorMessage(error) {
  if (error?.status === 403) {
    return 'You are outside the allowed attendance area.';
  }

  if (error?.status === 409) {
    return 'This session does not have a classroom location. Ask your teacher to create a new session.';
  }

  if (error?.status === 422) {
    return 'Your location could not be validated. Retrieve your location and try again.';
  }

  return error?.message || 'Unable to complete attendance check-in.';
}

export async function validateStudentSession({ sessionId, studentCode, latitude, longitude }) {
  const locationQuery = buildLocationQuery(latitude, longitude);

  return requestWithFallback(
    `/session/${encodeURIComponent(sessionId)}/student/${encodeURIComponent(studentCode)}?${locationQuery}`,
    {
      headers: TUNNEL_BYPASS_HEADERS,
    },
  );
}

export async function submitFaceValidation({ sessionId, studentCode, imageBlob, latitude, longitude }) {
  const locationQuery = buildLocationQuery(latitude, longitude);

  return requestWithFallback(
    `/session/${encodeURIComponent(sessionId)}/validate/${encodeURIComponent(studentCode)}?${locationQuery}`,
    {
      method: 'POST',
      headers: {
        ...TUNNEL_BYPASS_HEADERS,
        'Content-Type': imageBlob.type || 'image/jpeg',
      },
      body: imageBlob,
    },
  );
}
