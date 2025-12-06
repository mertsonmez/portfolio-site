/**
 * Blog Detail Page JavaScript
 * Tek bir blog yazısının detayını gösterir
 */

// API URL
const API_URL = 'https://portfolio-api-production-d4e9.up.railway.app';

/**
 * Sayfa yüklendiğinde
 */
document.addEventListener('DOMContentLoaded', () => {
    const blogId = getBlogId();
    
    if (!blogId) {
        showError('Blog ID bulunamadı. Lütfen blog listesinden bir yazı seçin.');
        return;
    }
    
    loadBlog(blogId);
});

/**
 * URL'den blog ID'sini al
 */
function getBlogId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Blog yazısını API'den yükle
 */
async function loadBlog(id) {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/api/blogs/${id}`);
        const result = await response.json();
        
        if (result.success) {
            displayBlog(result.data);
        } else {
            showError(result.message || 'Blog yazısı bulunamadı');
        }
    } catch (error) {
        console.error('API hatası:', error);
        showError('API bağlantısı başarısız: ' + error.message);
    }
}

/**
 * Blog yazısını ekranda göster
 */
function displayBlog(blog) {
    const container = document.getElementById('articleContainer');
    
    const date = formatDate(blog.publishedDate);
    const pageUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog.title);

    // Sayfa başlığını güncelle
    document.title = `${blog.title} - Portfolio`;

    container.innerHTML = `
        <article>
            <header class="article-header">
                <div class="article-category">${blog.category}</div>
                <h1 class="article-title">${blog.title}</h1>
                <div class="article-meta">
                    <span>👤 ${blog.author}</span>
                    <span>📅 ${date}</span>
                    <span>⏱️ ${blog.readTimeMinutes} dakikalık okuma</span>
                </div>
                <div class="article-tags">
                    ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </header>

            <div class="article-content">
                <div class="article-summary">
                    <strong>Özet:</strong> ${blog.summary}
                </div>
                <div class="article-body">
                    ${formatContent(blog.content)}
                </div>
            </div>

            <div class="share-section">
                <h3>Bu yazıyı paylaş</h3>
                <div class="share-buttons">
                    <a href="https://twitter.com/intent/tweet?text=${title}&url=${pageUrl}" 
                       target="_blank" 
                       class="share-btn share-twitter">
                        🐦 Twitter
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" 
                       target="_blank" 
                       class="share-btn share-linkedin">
                        💼 LinkedIn
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" 
                       target="_blank" 
                       class="share-btn share-facebook">
                        📘 Facebook
                    </a>
                </div>
            </div>
        </article>
    `;
}

/**
 * İçeriği formatla
 * Paragrafları ve satır sonlarını işle
 */
function formatContent(content) {
    // Boş satırlarla ayrılmış paragrafları işle
    return content
        .split('\n\n')
        .map(para => {
            const trimmed = para.trim();
            if (trimmed) {
                return `<p>${trimmed}</p>`;
            }
            return '';
        })
        .filter(Boolean)
        .join('');
}

/**
 * Tarihi formatla
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Yükleniyor mesajını göster
 */
function showLoading() {
    const container = document.getElementById('articleContainer');
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Blog yazısı yükleniyor...</p>
        </div>
    `;
}

/**
 * Hata mesajını göster
 */
function showError(message) {
    const container = document.getElementById('articleContainer');
    container.innerHTML = `
        <div class="error">
            <h2>❌ Bir hata oluştu</h2>
            <p>${message}</p>
            <p style="margin-top: 20px;">
                <a href="blog.html" style="color: var(--accent); text-decoration: none; font-weight: 600;">
                    ← Blog listesine dön
                </a>
            </p>
        </div>
    `;
}