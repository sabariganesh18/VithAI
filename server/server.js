/**
 * VithAI Backend API & Google OAuth Server (Port 5000)
 * Built with zero external runtime dependencies using Node.js standard library.
 * Supports CORS for http://localhost:5173, Google OAuth verification, and health check.
 */

import http from 'http';
import url from 'url';
import https from 'https';

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const CALLBACK_URL = `http://localhost:${PORT}/api/auth/google/callback`;

// Safe CORS headers helper
function setCorsHeaders(req, res) {
  const origin = req.headers.origin || FRONTEND_URL;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// JSON response helper
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);

  // Handle pre-flight CORS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`[VithAI Backend 5000] ${req.method} ${pathname}`);

  // 1. Health & Server Status Endpoint
  if (pathname === '/api/health' || pathname === '/health') {
    return sendJson(res, 200, {
      status: 'healthy',
      app: 'VithAI Backend API',
      port: PORT,
      frontendUrl: FRONTEND_URL,
      googleOAuthConfigured: Boolean(GOOGLE_CLIENT_ID),
      timestamp: new Date().toISOString()
    });
  }

  // 2. Initiate Google OAuth Flow
  if (pathname === '/api/auth/google') {
    if (!GOOGLE_CLIENT_ID) {
      // If client ID not provided, gracefully redirect to frontend mock selector
      return res.writeHead(302, {
        Location: `${FRONTEND_URL}/login?notice=google_dev_mode`
      }).end();
    }

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', CALLBACK_URL);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    res.writeHead(302, { Location: googleAuthUrl.toString() });
    return res.end();
  }

  // 3. Google OAuth Callback Endpoint
  if (pathname === '/api/auth/google/callback') {
    const { code, error, error_description } = parsedUrl.query;

    if (error) {
      console.error('[Google OAuth Backend Error]:', error, error_description);
      res.writeHead(302, {
        Location: `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}`
      });
      return res.end();
    }

    if (!code) {
      res.writeHead(302, {
        Location: `${FRONTEND_URL}/auth/callback?error=missing_code`
      });
      return res.end();
    }

    // In local development mode without client secret, redirect with test token
    if (!GOOGLE_CLIENT_SECRET) {
      res.writeHead(302, {
        Location: `${FRONTEND_URL}/auth/callback?token=dev_token_${Date.now()}&email=learner@vithai.edu&name=VithAI+Learner`
      });
      return res.end();
    }

    // Exchange code for Google access token
    try {
      const tokenParams = new URLSearchParams({
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: CALLBACK_URL,
        grant_type: 'authorization_code'
      });

      const tokenReq = https.request('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }, (tokenRes) => {
        let body = '';
        tokenRes.on('data', chunk => body += chunk);
        tokenRes.on('end', () => {
          try {
            const tokenData = JSON.parse(body);
            if (tokenData.error) {
              res.writeHead(302, {
                Location: `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(tokenData.error_description || tokenData.error)}`
              });
              return res.end();
            }

            // Redirect back to frontend callback with token
            res.writeHead(302, {
              Location: `${FRONTEND_URL}/auth/callback?token=${encodeURIComponent(tokenData.access_token || 'authenticated')}`
            });
            res.end();
          } catch (e) {
            res.writeHead(302, {
              Location: `${FRONTEND_URL}/auth/callback?error=token_parse_failed`
            });
            res.end();
          }
        });
      });

      tokenReq.on('error', (err) => {
        res.writeHead(302, {
          Location: `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(err.message)}`
        });
        res.end();
      });

      tokenReq.write(tokenParams.toString());
      tokenReq.end();
    } catch (err) {
      res.writeHead(302, {
        Location: `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(err.message)}`
      });
      res.end();
    }
    return;
  }

  // 4. Fallback Default Route
  if (pathname === '/' || pathname === '/api') {
    return sendJson(res, 200, {
      message: 'VithAI Backend OAuth & Learning API',
      status: 'online',
      version: '1.0.0',
      port: PORT,
      routes: [
        'GET /api/health',
        'GET /api/auth/google',
        'GET /api/auth/google/callback'
      ]
    });
  }

  // 404 handler
  return sendJson(res, 404, { error: 'Not Found', pathname });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✓ VithAI Backend API listening on http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for Frontend at: ${FRONTEND_URL}`);
  console.log(`✓ Google Callback: ${CALLBACK_URL}`);
  console.log(`======================================================\n`);
});
