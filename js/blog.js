/**
 * Blog List Page JavaScript
 * API'den blog yazılarını çeker ve listeler
 */

// API URL - Railway üzerindeki backend API
const API_URL = 'https://portfolio-api-production-d4e9.up.railway.app';

// Global değişkenler
let allBlogs = [];
let filteredBlogs = [];
let currentCategory = 'all';

/**
 * Sayfa yüklendiğinde çalışacak fonksiyonlar
 */
document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
    loadCategories();
});

/**
 * Blog yazılarını API'den yükle
 */
async function loadBlogs() {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/api/blogs`);
        const result = await response.json();
        
        if (result.success) {
            allBlogs = result.data;
            filteredBlogs = allBlogs;
            displayBlogs(filteredBlogs);
        } else {
            showError('Blog yazıları yüklenemedi');
        }
    } catch (error) {
        console.error('API hatası:', error);
        showError('API bağlantısı başarısız: ' + error.message);
    }
}

/**
 * Kategorileri API'den yükle
 */
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        const result = await response.json();
        
        if (result.success) {
            displayCategories(result.data);
        }
    } catch (error) {
        console.error('Kategoriler yüklenemedi:', error);
    }
}

/**
 * Kategori butonlarını oluştur ve göster
 */
function displayCategories(categories) {
    const filterContainer = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.onclick = () => filterByCategory(category);
        filterContainer.appendChild(btn);
    });
}

/**
 * Kategoriye göre blog yazılarını filtrele
 */
async function filterByCategory(category) {
    currentCategory = category;
    
    // Aktif butonu güncelle
    updateActiveButton(category);

    if (category === 'all') {
        filteredBlogs = allBlogs;
    } else {
        try {
            showLoading();
            
            const response = await fetch(`${API_URL}/api/blogs/category/${encodeURIComponent(category)}`);
            const result = await response.json();
            
            if (result.success) {
                filteredBlogs = result.data;
            }
        } catch (error) {
            console.error('Filtreleme hatası:', error);
            showError('Filtreleme sırasında bir hata oluştu');
            return;
        }
    }
    
    displayBlogs(filteredBlogs);
}

/**
 * Aktif kategori butonunu güncelle
 */
function updateActiveButton(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category || (category === 'all' && btn.textContent === 'Tümü')) {
            btn.classList.add('active');
        }
    });
}

/**
 * Blog arama fonksiyonu
 */
async function searchBlogs() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (query === '') {
        filterByCategory(currentCategory);
        return;
    }

    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/api/blogs/search?query=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        if (result.success) {
            filteredBlogs = result.data;
            displayBlogs(filteredBlogs);
        }
    } catch (error) {
        console.error('Arama hatası:', error);
        showError('Arama sırasında bir hata oluştu');
    }
}

/**
 * Blog yazılarını ekranda göster
 */
function displayBlogs(blogs) {
    const container = document.getElementById('blogContainer');
    
    if (blogs.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>Sonuç bulunamadı</h3>
                <p>Farklı bir arama terimi veya kategori deneyin.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '<div class="blog-grid"></div>';
    const grid = container.querySelector('.blog-grid');

    blogs.forEach(blog => {
        const card = createBlogCard(blog);
        grid.appendChild(card);
    });
}

/**
 * Tek bir blog kartı oluştur
 */
function createBlogCard(blog) {
    const date = formatDate(blog.publishedDate);
    
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.onclick = () => window.location.href = `blog-detail.html?id=${blog.id}`;
    
    card.innerHTML = `
        <div class="blog-header">
            📝
            <div class="blog-category">${blog.category}</div>
        </div>
        <div class="blog-content">
            <h3 class="blog-title">${blog.title}</h3>
            <div class="blog-meta">
                <span>👤 ${blog.author}</span>
                <span>📅 ${date}</span>
                <span>⏱️ ${blog.readTimeMinutes} dk</span>
            </div>
            <p class="blog-summary">${blog.summary}</p>
            <div class="blog-tags">
                ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="blog-detail.html?id=${blog.id}" class="read-more">Devamını Oku →</a>
        </div>
    `;
    
    return card;
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
    const container = document.getElementById('blogContainer');
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Blog yazıları yükleniyor...</p>
        </div>
    `;
}

/**
 * Hata mesajını göster
 */
function showError(message) {
    const container = document.getElementById('blogContainer');
    container.innerHTML = `
        <div class="error">
            <h3>❌ Bir hata oluştu</h3>
            <p>${message}</p>
            <p style="margin-top: 10px;">Lütfen daha sonra tekrar deneyin.</p>
        </div>
    `;
}