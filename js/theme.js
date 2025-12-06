/**
 * Theme Manager
 * Tüm sayfalarda kullanılacak tema yönetimi
 */

// Tema değiştirme fonksiyonu
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    console.log(`Tema değiştirildi: ${newTheme}`);
}

// Sayfa yüklendiğinde kaydedilmiş temayı uygula
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    console.log(`Tema yüklendi: ${savedTheme}`);
}

// Sayfa yüklendiğinde tema initialize et
document.addEventListener('DOMContentLoaded', initTheme);

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});