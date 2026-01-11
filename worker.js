/**
 * Cloudflare Worker for handling contact form submissions
 * This worker stores messages in Cloudflare D1 (SQLite) database
 * and provides API endpoints for the admin panel
 */

// CORS headers for allowing requests from your GitHub Pages domain
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Replace with your domain: 'https://yourusername.github.io'
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Simple authentication token (you should change this to a strong password)
const ADMIN_TOKEN = 'Al-Zabeer-Admin-Token'; // IMPORTANT: Change this!

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: CORS_HEADERS
      });
    }

    try {
      // Route: Submit contact form
      if (path === '/api/contact' && request.method === 'POST') {
        return await handleContactSubmission(request, env);
      }

      // Route: Get all messages (admin)
      if (path === '/api/messages' && request.method === 'GET') {
        return await handleGetMessages(request, env);
      }

      // Route: Get single message (admin)
      if (path.startsWith('/api/messages/') && request.method === 'GET') {
        const id = path.split('/')[3];
        return await handleGetMessage(request, env, id);
      }

      // Route: Update message status (admin)
      if (path.startsWith('/api/messages/') && request.method === 'PUT') {
        const id = path.split('/')[3];
        return await handleUpdateMessage(request, env, id);
      }

      // Route: Delete message (admin)
      if (path.startsWith('/api/messages/') && request.method === 'DELETE') {
        const id = path.split('/')[3];
        return await handleDeleteMessage(request, env, id);
      }

      // Explicit route for admin-messages page
      if (path === '/admin-messages') {
        return await env.ASSETS.fetch(new URL('/admin-messages.html', request.url));
      }

      // Serve static assets for all other routes
      // This includes index.html, CSS, JS, images, etc.
      try {
        const assetResponse = await env.ASSETS.fetch(request);
        
        // If asset exists, return it
        if (assetResponse.status !== 404) {
          return assetResponse;
        }
        
        // For non-API routes that don't exist, serve index.html (SPA fallback)
        if (!path.startsWith('/api/')) {
          return await env.ASSETS.fetch(new URL('/index.html', request.url));
        }
        
        // API route not found
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'API endpoint not found' 
        }), {
          status: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
        
      } catch (assetError) {
        // If ASSETS binding fails, return error
        return new Response('Asset serving error: ' + assetError.message, {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
        });
      }

    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Handle contact form submission
 */
async function handleContactSubmission(request, env) {
  try {
    const data = await request.json();
    const { name, email, phone, message } = data;

    // Validate input
    if (!name || !email || !message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Name, email, and message are required'
      }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // Insert into database
    const result = await env.DB.prepare(
      'INSERT INTO messages (name, email, phone, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(
      name,
      email,
      phone || '',
      message,
      'unread',
      new Date().toISOString()
    )
    .run();

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        messageId: result.meta.last_row_id
      }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to save message');
    }

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to submit message: ' + error.message
    }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle getting all messages (admin only)
 */
async function handleGetMessages(request, env) {
  // Check authentication
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get query parameters for filtering
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = 'SELECT * FROM messages';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      success: true,
      messages: result.results,
      count: result.results.length
    }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch messages: ' + error.message
    }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle getting single message (admin only)
 */
async function handleGetMessage(request, env, id) {
  // Check authentication
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await env.DB.prepare('SELECT * FROM messages WHERE id = ?')
      .bind(id)
      .first();

    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message not found'
      }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: result
    }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch message: ' + error.message
    }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle updating message status (admin only)
 */
async function handleUpdateMessage(request, env, id) {
  // Check authentication
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const { status } = data;

    if (!['unread', 'read', 'archived'].includes(status)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid status. Must be: unread, read, or archived'
      }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    const result = await env.DB.prepare('UPDATE messages SET status = ? WHERE id = ?')
      .bind(status, id)
      .run();

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Message status updated'
      }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to update message');
    }

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update message: ' + error.message
    }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle deleting message (admin only)
 */
async function handleDeleteMessage(request, env, id) {
  // Check authentication
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await env.DB.prepare('DELETE FROM messages WHERE id = ?')
      .bind(id)
      .run();

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Message deleted'
      }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to delete message');
    }

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete message: ' + error.message
    }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}
