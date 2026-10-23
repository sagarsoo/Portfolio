// ============================================================================
// 1. INITIAL PORTFOLIO DATA (Video Editing, Motion Graphics, Graphic Design)
// ============================================================================
const defaultMediaItems = [
    // Video Editing Projects
    {
        id: 'vid-1',
        category: 'video',
        title: 'Botanical Essence — Commercial Cut',
        desc: '60-second luxury skincare film edited with rhythmic match-cuts and natural sound design.',
        mediaType: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-cream-on-her-face-39878-large.mp4',
        thumb: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'vid-2',
        category: 'video',
        title: 'Urban Pulse — Documentary Short',
        desc: 'Fast-paced narrative montage blending handheld street cinematography and L-cut audio transitions.',
        mediaType: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80'
    },
    // Motion Graphics Projects
    {
        id: 'mot-1',
        category: 'motion',
        title: 'Kinetic Serif — Title Sequence',
        desc: 'Editorial typography in motion with fluid bezier easing, procedural grain, and optical flares.',
        mediaType: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-golden-particles-floating-in-dark-space-42466-large.mp4',
        thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'mot-2',
        category: 'motion',
        title: 'Monolith Brand — 2D/3D Ident',
        desc: 'Minimalist geometric brand reveal crafted for broadcast and social media bumpers.',
        mediaType: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-in-slow-motion-229-large.mp4',
        thumb: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80'
    },
    // Graphic Design Gallery Projects
    {
        id: 'gfx-1',
        category: 'graphics',
        title: 'Sage Botanicals — Packaging & Identity',
        desc: 'Minimalist apothecary label system pairing high-contrast editorial serifs with warm earth tones.',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1608248597359-0e6d526a6c58?auto=format&fit=crop&w=1200&q=85',
        thumb: 'https://images.unsplash.com/photo-1608248597359-0e6d526a6c58?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'gfx-2',
        category: 'graphics',
        title: 'Nocturne Film Festival — Key Art Poster',
        desc: 'Swiss-grid exhibition poster series featuring custom typographic lockups and tactile paper textures.',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
        thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'gfx-3',
        category: 'graphics',
        title: 'Koma Studio — Editorial Lookbook',
        desc: 'Art direction and print layout design exploring architectural negative space.',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
        thumb: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80'
    }
];

let portfolioItems = JSON.parse(localStorage.getItem('sagar_soni_portfolio_v2')) || defaultMediaItems;

function saveToStorage() {
    try {
        localStorage.setItem('sagar_soni_portfolio_v2', JSON.stringify(portfolioItems));
    } catch (e) {
        console.warn('Local file exceeds localStorage quota; kept in session memory.');
    }
}

// ============================================================================
// 2. SPA PAGE SWITCHING
// ============================================================================
function switchPage(pageKey) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${pageKey}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    }

    document.querySelectorAll('.nav-pill').forEach(btn => btn.classList.remove('active-nav'));
    const activeNav = document.getElementById(`nav-${pageKey}`);
    if (activeNav) activeNav.classList.add('active-nav');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderAllGrids();
    bindHoverSlowdown();
}

function scrollToContact() {
    switchPage('home');
    setTimeout(() => {
        const contactEl = document.getElementById('contact-section');
        if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// ============================================================================
// 3. RENDER GALLERIES (Play, Edit, Delete for Video, Motion & Graphic Design)
// ============================================================================
function renderAllGrids() {
    renderCategoryGrid('video', 'grid-video');
    renderCategoryGrid('motion', 'grid-motion');
    renderCategoryGrid('graphics', 'grid-graphics');
}

function renderCategoryGrid(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = portfolioItems.filter(item => item.category === category);

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-span-full glass-card rounded-3xl p-12 text-center space-y-4">
                <p class="font-serif-editorial text-3xl text-[#2B2825]">No projects in this section yet.</p>
                <button onclick="openUploadModal('${category}')" class="glass-sage-btn px-6 py-2.5 rounded-full text-xs font-medium">+ Upload First Item</button>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => {
        const isGraphic = category === 'graphics';
        const aspectClass = isGraphic ? 'aspect-[4/4.8]' : 'aspect-video';
        const actionLabel = item.mediaType === 'video' ? '&#9654; Play' : '&#10022; View';

        return `
            <div class="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 hover:shadow-xl">
                <div>
                    <div class="${aspectClass} rounded-2xl overflow-hidden bg-[#D9D4CC] relative mb-4 shadow-inner">
                        ${item.mediaType === 'video' ? `
                            <video src="${item.url}" poster="${item.thumb || ''}" muted loop playsinline 
                                   onmouseenter="this.play()" onmouseleave="this.pause()"
                                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>
                        ` : `
                            <img src="${item.url}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                        `}
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onclick="openPlayerModal('${item.id}')" class="glass-cta px-6 py-2.5 rounded-full text-white text-xs sm:text-sm font-medium tracking-wide">
                                ${actionLabel}
                            </button>
                        </div>
                    </div>
                    <h3 class="font-serif-editorial text-2xl sm:text-3xl text-[#2B2825] leading-snug">${item.title}</h3>
                    <p class="text-xs sm:text-sm text-[#5A554E] mt-1 font-light leading-relaxed">${item.desc || ''}</p>
                </div>

                <div class="flex items-center justify-between pt-4 mt-4 border-t border-[#2B2825]/10">
                    <button onclick="openPlayerModal('${item.id}')" class="glass-outline-btn px-4 py-1.5 rounded-full text-xs font-medium">
                        ${item.mediaType === 'video' ? 'Play Reel' : 'Inspect Full'}
                    </button>
                    <div class="flex items-center gap-2">
                        <button onclick="openEditModal('${item.id}')" class="glass-cta px-3.5 py-1.5 rounded-full text-xs text-[#2B2825]">Edit</button>
                        <button onclick="deleteMediaItem('${item.id}')" class="glass-cta px-3.5 py-1.5 rounded-full text-xs text-red-800 hover:bg-red-500/20">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    bindHoverSlowdown();
}

// ============================================================================
// 4. UPLOAD, EDIT, DELETE & PLAY HANDLERS
// ============================================================================
function openUploadModal(defaultCat = 'video') {
    document.getElementById('modal-title').textContent = 'Add New Project';
    document.getElementById('edit-item-id').value = '';
    document.getElementById('item-category').value = defaultCat;
    document.getElementById('item-title').value = '';
    document.getElementById('item-desc').value = '';
    document.getElementById('item-file').value = '';
    document.getElementById('item-url').value = '';

    const modal = document.getElementById('media-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function openEditModal(itemId) {
    const item = portfolioItems.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('modal-title').textContent = 'Edit Project';
    document.getElementById('edit-item-id').value = item.id;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-title').value = item.title;
    document.getElementById('item-desc').value = item.desc || '';
    document.getElementById('item-file').value = '';
    document.getElementById('item-url').value = item.url.startsWith('blob:') ? '' : item.url;

    const modal = document.getElementById('media-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeUploadModal() {
    const modal = document.getElementById('media-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function handleMediaSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-item-id').value;
    const category = document.getElementById('item-category').value;
    const title = document.getElementById('item-title').value.trim();
    const desc = document.getElementById('item-desc').value.trim();
    const fileInput = document.getElementById('item-file');
    const urlInput = document.getElementById('item-url').value.trim();

    let finalUrl = urlInput;
    let mediaType = category === 'graphics' ? 'image' : 'video';

    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        finalUrl = URL.createObjectURL(file);
        mediaType = file.type.startsWith('video') ? 'video' : 'image';
    } else if (urlInput) {
        const isVideoUrl = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(urlInput);
        mediaType = isVideoUrl ? 'video' : (category === 'graphics' ? 'image' : 'video');
    }

    if (editId) {
        const idx = portfolioItems.findIndex(i => i.id === editId);
        if (idx > -1) {
            portfolioItems[idx].category = category;
            portfolioItems[idx].title = title;
            portfolioItems[idx].desc = desc;
            if (finalUrl) {
                portfolioItems[idx].url = finalUrl;
                portfolioItems[idx].mediaType = mediaType;
            }
        }
    } else {
        if (!finalUrl) {
            finalUrl = category === 'graphics'
                ? 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80'
                : 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4';
        }
        portfolioItems.unshift({
            id: 'item-' + Date.now(),
            category,
            title,
            desc,
            mediaType,
            url: finalUrl,
            thumb: ''
        });
    }

    saveToStorage();
    closeUploadModal();
    switchPage(category);
}

function deleteMediaItem(itemId) {
    portfolioItems = portfolioItems.filter(i => i.id !== itemId);
    saveToStorage();
    renderAllGrids();
}

function openPlayerModal(itemId) {
    const item = portfolioItems.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('player-category').textContent = item.category.toUpperCase();
    document.getElementById('player-title').textContent = item.title;
    document.getElementById('player-desc').textContent = item.desc || '';

    const container = document.getElementById('player-container');
    if (item.mediaType === 'video') {
        container.innerHTML = `<video src="${item.url}" controls autoplay class="w-full max-h-[72vh] object-contain"></video>`;
    } else {
        container.innerHTML = `<img src="${item.url}" alt="${item.title}" class="w-full max-h-[72vh] object-contain">`;
    }

    const modal = document.getElementById('player-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePlayerModal() {
    const container = document.getElementById('player-container');
    container.innerHTML = '';
    const modal = document.getElementById('player-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// ============================================================================
// 5. PERSISTENT LIGHT / DARK THEME SWITCH
// ============================================================================
function applyTheme(theme, persist = true) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    document.body.dataset.theme = nextTheme;

    const toggle = document.getElementById('theme-toggle');
    const label = document.getElementById('theme-toggle-label');
    const icon = document.getElementById('theme-toggle-icon');
    const isDark = nextTheme === 'dark';

    if (toggle) {
        const actionLabel = `Switch to ${isDark ? 'light' : 'dark'} mode`;
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', actionLabel);
        toggle.setAttribute('title', actionLabel);
        toggle.setAttribute('data-tooltip', actionLabel);
    }
    if (icon) icon.textContent = isDark ? '☾' : '☼';

    if (persist) {
        try { localStorage.setItem('sagar_soni_theme', nextTheme); }
        catch (error) { /* Theme still works for this page view when storage is unavailable. */ }
    }
}

function toggleTheme() {
    applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
}

// ============================================================================
// 6. FLOATING BLOB CURSOR + SLOW-MOTION PARTICLE SYSTEM ON BUTTON HOVER
// ============================================================================
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

let cw = window.innerWidth;
let ch = window.innerHeight;

function resizeCanvas() {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const pointer = { x: cw / 2, y: ch / 2 };
const blob = { x: cw / 2, y: ch / 2, radius: 18, phase: 0 };
let isHoveringInteractive = false;
const particles = [];

window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

function bindHoverSlowdown() {
    const targets = document.querySelectorAll('button, a, select, input, .cursor-pointer');
    targets.forEach(el => {
        el.onmouseenter = () => { isHoveringInteractive = true; };
        el.onmouseleave = () => { isHoveringInteractive = false; };
    });
}

class BlobParticle {
    constructor(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.65 + 0.2;
        this.x = x + (Math.random() - 0.5) * 12;
        this.y = y + (Math.random() - 0.5) * 12;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * 2.6 + 1.1;
        this.alpha = 0.75;
        this.decay = Math.random() * 0.007 + 0.004;
    }

    update(speedScale) {
        this.x += this.vx * speedScale;
        this.y += this.vy * speedScale;
        this.alpha -= this.decay * speedScale;
    }

    draw(context) {
        if (this.alpha <= 0) return;
        context.save();
        const isDark = document.body.dataset.theme === 'dark';
        context.fillStyle = isDark
            ? `rgba(244, 242, 238, ${Math.max(0, this.alpha)})`
            : `rgba(122, 132, 113, ${Math.max(0, this.alpha)})`;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }
}

function animateCursor() {
    ctx.clearRect(0, 0, cw, ch);

    // Slow down dramatically when reacting with a button or hover target
    const followSpeed = isHoveringInteractive ? 0.035 : 0.14;
    const particleSpeedFactor = isHoveringInteractive ? 0.12 : 0.55;
    const emitProbability = isHoveringInteractive ? 0.18 : 0.55;

    blob.x += (pointer.x - blob.x) * followSpeed;
    blob.y += (pointer.y - blob.y) * followSpeed;
    blob.phase += isHoveringInteractive ? 0.02 : 0.06;

    const targetRadius = isHoveringInteractive ? 28 : 17;
    blob.radius += (targetRadius - blob.radius) * 0.08;

    // Draw organic morphing floating blob
    ctx.save();
    ctx.translate(blob.x, blob.y);
    ctx.beginPath();
    const points = 24;
    for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        const wobble = Math.sin(theta * 3 + blob.phase) * 2.4 + Math.cos(theta * 2 - blob.phase) * 1.8;
        const r = blob.radius + wobble;
        const px = Math.cos(theta) * r;
        const py = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    const isDarkTheme = document.body.dataset.theme === 'dark';
    ctx.fillStyle = isDarkTheme
        ? (isHoveringInteractive ? 'rgba(255, 255, 255, 0.20)' : 'rgba(255, 255, 255, 0.13)')
        : (isHoveringInteractive ? 'rgba(122, 132, 113, 0.22)' : 'rgba(166, 144, 128, 0.26)');
    ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Continuously emit slow-moving particles
    if (Math.random() < emitProbability) {
        particles.push(new BlobParticle(blob.x, blob.y));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(particleSpeedFactor);
        particles[i].draw(ctx);
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateCursor);
}

window.addEventListener('DOMContentLoaded', () => {
    let savedTheme = 'light';
    try {
        const storedTheme = localStorage.getItem('sagar_soni_theme');
        if (storedTheme === 'dark' || storedTheme === 'light') savedTheme = storedTheme;
    } catch (error) { /* Default to light mode if browser storage is unavailable. */ }
    applyTheme(savedTheme, false);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    renderAllGrids();
    bindHoverSlowdown();
    animateCursor();
});
