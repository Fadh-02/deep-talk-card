const questionDatabase = [
    { id: 1, category: "Pasangan", text: "Apa perkara pertama yang buat kau tertarik dengan aku?", color: "bg-pink-500", icon: "heart" },
    { id: 2, category: "Pasangan", text: "Kalau kita boleh pindah ke mana-mana negara esok, kau nak pergi mana?", color: "bg-pink-500", icon: "heart" },
    { id: 3, category: "Pasangan", text: "Apa 'love language' kau yang paling utama yang aku patut tahu?", color: "bg-pink-500", icon: "heart" },
    { id: 4, category: "Pasangan", text: "Apa memori temu janji kita yang paling kau suka?", color: "bg-pink-500", icon: "heart" },
    { id: 5, category: "Pasangan", text: "Bagaimana aku boleh jadi pasangan yang lebih baik untuk kau?", color: "bg-pink-500", icon: "heart" },
    
    { id: 6, category: "Kawan", text: "Apa tanggapan pertama kau bila pertama kali kita jumpa?", color: "bg-blue-500", icon: "users" },
    { id: 7, category: "Kawan", text: "Apa satu kualiti dalam diri aku yang kau rasa tak ada pada orang lain?", color: "bg-blue-500", icon: "users" },
    { id: 8, category: "Kawan", text: "Kalau kita terdampar di pulau terpencil, apa peranan kau untuk kita survive?", color: "bg-blue-500", icon: "users" },
    { id: 9, category: "Kawan", text: "Apa satu rahsia kecil yang kau tak pernah beritahu sesiapa kecuali aku?", color: "bg-blue-500", icon: "users" },
    { id: 10, category: "Kawan", text: "Apa aktiviti paling gila yang kau nak kita buat sama-sama?", color: "bg-blue-500", icon: "users" },

    { id: 11, category: "Deep", text: "Apa satu perkara yang kau paling takut orang tahu tentang diri kau?", color: "bg-purple-600", icon: "brain" },
    { id: 12, category: "Deep", text: "Adakah kau rasa kau sudah menjadi versi terbaik diri kau sekarang?", color: "bg-purple-600", icon: "brain" },
    { id: 13, category: "Deep", text: "Apa penyesalan yang paling banyak mengajar kau tentang kehidupan?", color: "bg-purple-600", icon: "brain" },
    { id: 14, category: "Deep", text: "Kalau kau mati esok, apa perkara yang kau rasa belum sempat kau selesaikan?", color: "bg-purple-600", icon: "brain" },
    { id: 15, category: "Deep", text: "Siapa individu yang paling banyak beri kesan dalam hidup kau (baik atau buruk)?", color: "bg-purple-600", icon: "brain" },
  
    { id: 16, category: "Deep", text: "Apa memori masa kecil yang paling kau rindu?", color: "bg-purple-600", icon: "brain" },
    { id: 17, category: "Pasangan", text: "Apa satu tabiat aku yang sebenarnya kau rasa comel tapi kau tak pernah cakap?", color: "bg-pink-500", icon: "heart" },
    { id: 18, category: "Kawan", text: "Apa maksud persahabatan sejati bagi kau?", color: "bg-blue-500", icon: "users" },
    { id: 19, category: "Deep", text: "Kalau kau boleh tukar satu perkara dalam sejarah hidup kau, apa dia?", color: "bg-purple-600", icon: "brain" },
    { id: 20, category: "Kawan", text: "Bila kali terakhir kau rasa betul-betul bangga dengan aku?", color: "bg-blue-500", icon: "users" }
];

let currentMode = 'Semua';
let currentQuestion = null;
let favorites = [];
let history = [];
let isFlipping = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

function setMode(mode) {
    currentMode = mode;
    currentQuestion = null;
    
    // Update UI buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === mode);
    });

    // Reset Card
    document.getElementById('main-card').classList.remove('is-flipped');
    document.getElementById('next-btn').classList.add('hidden');
}

function handleCardClick() {
    if (isFlipping) return;
    const card = document.getElementById('main-card');
    
    if (!currentQuestion) {
        drawCard();
    }
}

function drawCard() {
    isFlipping = true;
    const card = document.getElementById('main-card');
    const refreshIcon = document.getElementById('refresh-icon');
    
    if (refreshIcon) refreshIcon.classList.add('animate-spin');
    card.classList.add('is-flipped');

    setTimeout(() => {
        const filtered = currentMode === 'Semua' 
            ? questionDatabase 
            : questionDatabase.filter(q => q.category === currentMode);

        let nextQ;
        do {
            nextQ = filtered[Math.floor(Math.random() * filtered.length)];
        } while (currentQuestion && nextQ.id === currentQuestion.id && filtered.length > 1);

        currentQuestion = nextQ;
        updateCardUI(nextQ);
        
        // Add to history
        history = [nextQ, ...history.filter(i => i.id !== nextQ.id)].slice(0, 10);
        
        card.classList.remove('is-flipped');
        document.getElementById('next-btn').classList.remove('hidden');
        if (refreshIcon) refreshIcon.classList.remove('animate-spin');
        isFlipping = false;
    }, 600);
}

function updateCardUI(q) {
    document.getElementById('display-question').innerText = `"${q.text}"`;
    document.getElementById('badge-text').innerText = q.category;
    
    const badge = document.getElementById('card-badge');
    badge.className = `category-badge ${q.color}`;
    
    // Update Star Icon
    const isFav = favorites.some(f => f.id === q.id);
    document.getElementById('star-icon').style.fill = isFav ? "#facc15" : "none";
    document.getElementById('star-icon').style.color = isFav ? "#facc15" : "#94a3b8";
    
    lucide.createIcons();
}

function toggleFavorite(e) {
    e.stopPropagation();
    if (!currentQuestion) return;

    const index = favorites.findIndex(f => f.id === currentQuestion.id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(currentQuestion);
    }
    updateCardUI(currentQuestion);
}

function changeView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${viewName}`).classList.remove('hidden');
    
    if (viewName === 'favorites') renderFavorites();
    if (viewName === 'history') renderHistory();
}

function renderFavorites() {
    const container = document.getElementById('favorites-list');
    if (favorites.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#555; padding:40px;">Tiada soalan kegemaran.</p>`;
        return;
    }
    container.innerHTML = favorites.map(q => `
        <div class="list-item">
            <div>
                <small style="color:var(--primary)">${q.category}</small>
                <p>${q.text}</p>
            </div>
            <i data-lucide="star" style="fill:#facc15; color:#facc15"></i>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderHistory() {
    const container = document.getElementById('history-list');
    if (history.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#555; padding:40px;">Belum ada sejarah.</p>`;
        return;
    }
    container.innerHTML = history.map(q => `
        <div class="list-item">
            <div style="display:flex; gap:15px; align-items:center;">
                <div style="width:4px; height:30px; border-radius:2px;" class="${q.color}"></div>
                <div>
                    <small>${q.category}</small>
                    <p style="font-size:0.9rem; color:#cbd5e1">${q.text}</p>
                </div>
            </div>
        </div>
    `).join('');
}