/**
 * Cloudflare Pages Middleware
 * This file is automatically used by Pages Functions
 */

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Admin authentication token
const ADMIN_TOKEN = 'Al-Zabeer-Admin-Token';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS
    });
  }

  // Handle API routes
  if (path.startsWith('/api/')) {
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
      if (path.match(/^\/api\/messages\/\d+$/) && request.method === 'GET') {
        const id = path.split('/')[3];
        return await handleGetMessage(request, env, id);
      }

      // Route: Update message status (admin)
      if (path.match(/^\/api\/messages\/\d+$/) && request.method === 'PUT') {
        const id = path.split('/')[3];
        return await handleUpdateMessage(request, env, id);
      }

      // Route: Delete message (admin)
      if (path.match(/^\/api\/messages\/\d+$/) && request.method === 'DELETE') {
        const id = path.split('/')[3];
        return await handleDeleteMessage(request, env, id);
      }

      // API route not found
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'API endpoint not found' 
      }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });

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

  // For non-API routes, continue to static assets
  return await next();
}

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

    if (result) {
      return new Response(JSON.stringify({
        success: true,
        message: result
      }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message not found'
      }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

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
 * Handle updating message (admin only)
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

    if (!status || !['read', 'unread'].includes(status)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid status. Must be "read" or "unread"'
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
        message: 'Message updated'
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
