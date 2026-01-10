/**
 * Admin Panel JavaScript
 * Handles authentication, message fetching, and CRUD operations
 */

// Configuration
const WORKER_URL = 'https://your-worker-name.your-subdomain.workers.dev'; // Update this with your worker URL
let adminToken = localStorage.getItem('adminToken');
let currentFilter = 'all';
let allMessages = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (adminToken) {
        // User already logged in
        showAdminPanel();
        loadMessages();
    } else {
        // Show login modal
        showLoginModal();
    }
    
    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('refreshBtn').addEventListener('click', () => loadMessages());
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterMessages();
        });
    });
});

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const token = document.getElementById('adminToken').value;
    
    if (token) {
        adminToken = token;
        localStorage.setItem('adminToken', token);
        showAdminPanel();
        loadMessages();
    }
}

function handleLogout() {
    adminToken = null;
    localStorage.removeItem('adminToken');
    allMessages = [];
    showLoginModal();
}

function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('adminPanel').style.display = 'block';
}

// Load Messages from API
async function loadMessages() {
    showLoading();
    
    try {
        const response = await fetch(`${WORKER_URL}/api/messages`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (response.status === 401) {
            // Unauthorized - token is invalid
            alert('Invalid admin token. Please login again.');
            handleLogout();
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            allMessages = data.messages || [];
            updateStats();
            filterMessages();
        } else {
            showError('Failed to load messages: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        showError('Failed to load messages. Please check your connection and worker URL.');
    } finally {
        hideLoading();
    }
}

// Update Statistics
function updateStats() {
    const unread = allMessages.filter(m => m.status === 'unread').length;
    const read = allMessages.filter(m => m.status === 'read').length;
    const total = allMessages.length;
    
    document.getElementById('unreadCount').textContent = unread;
    document.getElementById('readCount').textContent = read;
    document.getElementById('totalCount').textContent = total;
}

// Filter Messages
function filterMessages() {
    let filtered = allMessages;
    
    if (currentFilter !== 'all') {
        filtered = allMessages.filter(m => m.status === currentFilter);
    }
    
    // Apply search filter if search input has value
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(m => 
            m.name.toLowerCase().includes(searchTerm) ||
            m.email.toLowerCase().includes(searchTerm)
        );
    }
    
    displayMessages(filtered);
}

// Search Handler
function handleSearch(e) {
    filterMessages();
}

// Display Messages in Table
function displayMessages(messages) {
    const tbody = document.getElementById('messagesTableBody');
    const emptyState = document.getElementById('emptyState');
    
    tbody.innerHTML = '';
    
    if (messages.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    messages.forEach(message => {
        const row = document.createElement('tr');
        row.className = `message-row status-${message.status}`;
        
        const statusBadge = getStatusBadge(message.status);
        const date = formatDate(message.created_at);
        const truncatedMessage = message.message.length > 50 
            ? message.message.substring(0, 50) + '...' 
            : message.message;
        
        row.innerHTML = `
            <td>${statusBadge}</td>
            <td><strong>${escapeHtml(message.name)}</strong></td>
            <td>${escapeHtml(message.email)}</td>
            <td>${escapeHtml(message.phone || '-')}</td>
            <td class="message-preview">${escapeHtml(truncatedMessage)}</td>
            <td>${date}</td>
            <td class="actions">
                <button class="btn-icon" onclick="viewMessage(${message.id})" title="View">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <button class="btn-icon" onclick="markAsRead(${message.id})" title="Mark as Read">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteMessage(${message.id})" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// View Message Details
function viewMessage(id) {
    const message = allMessages.find(m => m.id === id);
    if (!message) return;
    
    const modal = document.getElementById('messageModal');
    const details = document.getElementById('messageDetails');
    
    details.innerHTML = `
        <div class="detail-row">
            <strong>Status:</strong>
            ${getStatusBadge(message.status)}
        </div>
        <div class="detail-row">
            <strong>Name:</strong>
            <span>${escapeHtml(message.name)}</span>
        </div>
        <div class="detail-row">
            <strong>Email:</strong>
            <a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a>
        </div>
        <div class="detail-row">
            <strong>Phone:</strong>
            <a href="tel:${escapeHtml(message.phone || '')}">${escapeHtml(message.phone || 'N/A')}</a>
        </div>
        <div class="detail-row">
            <strong>Date:</strong>
            <span>${formatDate(message.created_at)}</span>
        </div>
        <div class="detail-row full-width">
            <strong>Message:</strong>
            <div class="message-content">${escapeHtml(message.message).replace(/\n/g, '<br>')}</div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-primary" onclick="markAsRead(${message.id}); closeMessageModal();">Mark as Read</button>
            <button class="btn btn-warning" onclick="updateMessageStatus(${message.id}, 'archived'); closeMessageModal();">Archive</button>
            <button class="btn btn-danger" onclick="deleteMessage(${message.id}); closeMessageModal();">Delete</button>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('active');
}

// Mark as Read
async function markAsRead(id) {
    await updateMessageStatus(id, 'read');
}

// Update Message Status
async function updateMessageStatus(id, status) {
    try {
        const response = await fetch(`${WORKER_URL}/api/messages/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update local data
            const message = allMessages.find(m => m.id === id);
            if (message) {
                message.status = status;
            }
            updateStats();
            filterMessages();
        } else {
            alert('Failed to update message: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating message:', error);
        alert('Failed to update message. Please try again.');
    }
}

// Delete Message
async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${WORKER_URL}/api/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Remove from local data
            allMessages = allMessages.filter(m => m.id !== id);
            updateStats();
            filterMessages();
        } else {
            alert('Failed to delete message: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
    }
}

// Helper Functions
function getStatusBadge(status) {
    const badges = {
        unread: '<span class="badge badge-unread">Unread</span>',
        read: '<span class="badge badge-read">Read</span>',
        archived: '<span class="badge badge-archived">Archived</span>'
    };
    return badges[status] || badges.unread;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showLoading() {
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('emptyState').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
}

function showError(message) {
    alert(message);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('messageModal');
    if (event.target === modal) {
        closeMessageModal();
    }
}
