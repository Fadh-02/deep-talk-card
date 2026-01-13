const questionDatabase = [
    { id: 1, category: "Pasangan", text: "Apa perkara pertama yang buat kau tertarik dengan aku?", color: "bg-pink", icon: "heart" },
    { id: 2, category: "Pasangan", text: "Kalau kita boleh pindah ke mana-mana negara esok, kau nak pergi mana?", color: "bg-pink", icon: "heart" },
    { id: 3, category: "Pasangan", text: "Apa 'love language' kau yang paling utama yang aku patut tahu?", color: "bg-pink", icon: "heart" },
    { id: 4, category: "Pasangan", text: "Apa memori temu janji kita yang paling kau suka?", color: "bg-pink", icon: "heart" },
    { id: 5, category: "Pasangan", text: "Bagaimana aku boleh jadi pasangan yang lebih baik untuk kau?", color: "bg-pink", icon: "heart" },
    
    { id: 6, category: "Kawan", text: "Apa tanggapan pertama kau bila pertama kali kita jumpa?", color: "bg-blue", icon: "users" },
    { id: 7, category: "Kawan", text: "Apa satu kualiti dalam diri aku yang kau rasa tak ada pada orang lain?", color: "bg-blue", icon: "users" },
    { id: 8, category: "Kawan", text: "Kalau kita terdampar di pulau terpencil, apa peranan kau untuk kita survive?", color: "bg-blue", icon: "users" },
    { id: 9, category: "Kawan", text: "Apa satu rahsia kecil yang kau tak pernah beritahu sesiapa kecuali aku?", color: "bg-blue", icon: "users" },
    { id: 10, category: "Kawan", text: "Apa aktiviti paling gila yang kau nak kita buat sama-sama?", color: "bg-blue", icon: "users" },

    { id: 11, category: "Deep", text: "Apa satu perkara yang kau paling takut orang tahu tentang diri kau?", color: "bg-purple", icon: "brain" },
    { id: 12, category: "Deep", text: "Adakah kau rasa kau sudah menjadi versi terbaik diri kau sekarang?", color: "bg-purple", icon: "brain" },
    { id: 13, category: "Deep", text: "Apa penyesalan yang paling banyak mengajar kau tentang kehidupan?", color: "bg-purple", icon: "brain" },
    { id: 14, category: "Deep", text: "Kalau kau mati esok, apa perkara yang kau rasa belum sempat kau selesaikan?", color: "bg-purple", icon: "brain" },
    { id: 15, category: "Deep", text: "Siapa individu yang paling banyak beri kesan dalam hidup kau (baik atau buruk)?", color: "bg-purple", icon: "brain" },
  
    { id: 16, category: "Deep", text: "Apa memori masa kecil yang paling kau rindu?", color: "bg-purple", icon: "brain" },
    { id: 17, category: "Pasangan", text: "Apa satu tabiat aku yang sebenarnya kau rasa comel tapi kau tak pernah cakap?", color: "bg-pink", icon: "heart" },
    { id: 18, category: "Kawan", text: "Apa maksud persahabatan sejati bagi kau?", color: "bg-blue", icon: "users" },
    { id: 19, category: "Deep", text: "Kalau kau boleh tukar satu perkara dalam sejarah hidup kau, apa dia?", color: "bg-purple", icon: "brain" },
    { id: 20, category: "Kawan", text: "Bila kali terakhir kau rasa betul-betul bangga dengan aku?", color: "bg-blue", icon: "users" }
];

let currentMode = 'Semua';
let currentQuestion = null;
let favorites = [];
let history = [];
let isFlipping = false;

// Initialize Lucide Icons on load
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

function setMode(mode, btn) {
    if (isFlipping) return;
    
    currentMode = mode;
    currentQuestion = null;
    
    // Update UI buttons active state
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Reset Card to initial state (Back of card)
    const card = document.getElementById('main-card');
    card.classList.remove('is-flipped');
    
    // Hide next button during reset
    document.getElementById('next-btn').classList.add('hidden');

    // Optional: Update back of card text based on mode
    const backQuote = document.getElementById('back-quote');
    const backTitle = document.getElementById('back-title');
    if (mode === 'Pasangan') {
        backTitle.innerText = "Mod Pasangan";
        backQuote.innerText = "Mari kenali hati pasangan anda.";
    } else if (mode === 'Kawan') {
        backTitle.innerText = "Mod Kawan";
        backQuote.innerText = "Persahabatan yang jujur bermula di sini.";
    } else if (mode === 'Deep') {
        backTitle.innerText = "Mod Deep";
        backQuote.innerText = "Sedia untuk perbualan yang bermakna?";
    } else {
        backTitle.innerText = "Deep Talk";
        backQuote.innerText = "Sesuatu yang hebat bermula dari satu soalan yang jujur.";
    }
}

function handleCardClick() {
    if (isFlipping) return;
    
    // If card is not showing a question yet, draw one
    if (!currentQuestion) {
        drawCard();
    }
}

function drawCard() {
    if (isFlipping) return;
    isFlipping = true;

    const card = document.getElementById('main-card');
    const refreshIcon = document.getElementById('refresh-icon');
    
    // 1. If card is already flipped (showing a question), flip it back first
    if (card.classList.contains('is-flipped')) {
        card.classList.remove('is-flipped');
        if (refreshIcon) refreshIcon.classList.add('animate-spin');
        
        // Wait for it to flip back before changing content and flipping again
        setTimeout(() => {
            processDrawing();
        }, 400); 
    } else {
        processDrawing();
    }
}

function processDrawing() {
    const card = document.getElementById('main-card');
    const refreshIcon = document.getElementById('refresh-icon');

    // Filter questions
    const filtered = currentMode === 'Semua' 
        ? questionDatabase 
        : questionDatabase.filter(q => q.category === currentMode);

    // Pick a random question that isn't the same as current
    let nextQ;
    do {
        nextQ = filtered[Math.floor(Math.random() * filtered.length)];
    } while (currentQuestion && nextQ.id === currentQuestion.id && filtered.length > 1);

    currentQuestion = nextQ;
    
    // Update the UI content while the card is facing away or mid-flip
    updateCardUI(nextQ);
    
    // Add to history
    history = [nextQ, ...history.filter(i => i.id !== nextQ.id)].slice(0, 10);
    
    // Flip the card to show the question
    card.classList.add('is-flipped');
    
    // Show the "Next" button
    document.getElementById('next-btn').classList.remove('hidden');
    
    // Cleanup
    setTimeout(() => {
        if (refreshIcon) refreshIcon.classList.remove('animate-spin');
        isFlipping = false;
    }, 600);
}

function
