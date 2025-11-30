const APP_CONTENT = {
    images: {
        me_normal: "./assets/eu-normal.jpg",
        me_hurt:   "./assets/eu-dor.jpg",
        me_broken: "./assets/eu-machucado.jpg",
        video_explanation: "./assets/video-explicacao.mp4",
        final_photo: "./assets/nos-dois.jpg"
    },
    // Frases que aparecem enquanto segura o botão
    holdPhrases: ["Sinto sua falta", "Me perdoa", "Você é tudo", "Minha vida", "❤️", "🥺", "Volta pra mim", "Princesa", "Te amo"],
    
    screen1: {
        title: "O Idiota Sumido",
        subtitle: "Sei que você está chateada, e com toda razão. Pode descontar a raiva aqui. Pode me espancar à vontade kkkkkkk. Prometo que não vou reclamar.",
        avatar_emoji: "😤", avatar_hurt: "🤕", avatar_dead: "😵", btn_text: "Já aliviei a raiva..."
    },
    screen2: {
        title: "Onde eu estava...",
        text_paragraphs: [
            "Minha querida, eu nunca sumiria por maldade ou pra te deixar mal de propósito. Jamais.",
            "Fiquei sem celular (pra variar), sem internet, e isso virou uma bola de neve gigante. Acabei me isolando numa crise interna, perdi a noção de como voltar e travei. Ainda tá difícil compreender exatamente como agir, porque as coisas não estão saindo como eu gostaria.",
            "É um misto agoniante de querer fazer tudo e sentir que nada é feito. No fim, eu só quero o melhor pra você, e é meio foda lidar com a sensação de não estar sendo o melhor que você merece agora. Não foi descaso, foi um bloqueio. Mas meu coração esteve com você em cada segundo."
        ],
        btn_text: "Ler a carta..."
    },
    screen3: {
        title: "Suas Palavras", subtitle: "Toque em um envelope para ler.", btn_text: "O que eu sinto de verdade",
        letters: [
            { id: 1, preview: "Eu igual uma idiota... 📩", quote: "Bem divertido esperar tá, gosto tanto que estou já 3 semanas te esperando... sendo que VOCÊ deveria tomar uma atitude.", my_response: "Ler isso dói demais. Não foi diversão, Lari. Eu me enrolei com problemas e acabei me isolando, é muito mais complexo do que só 'sumir'. Ver você se sentindo assim me quebra, porque a última coisa que quero é te fazer de boba. Você é a pessoa mais importante pra mim." },
            { id: 2, preview: "Não é difícil me procurar... 📩", quote: "Você me chateou tanto... pelo menos uma satisfação é o que eu deveria receber.", my_response: "Saber que você chorou me destrói por dentro. Não sumi por falta de interesse, mas porque perdi o chão. Mesmo longe, meu pensamento estava 100% em você. Lembra daquele dia no quintal que te mandei beijo? Aquilo não foi só um gesto, foi uma tentativa de dizer: 'Eu ainda te amo, por favor, me espera só mais um pouco'." },
            { id: 3, preview: "Sobre nós... 📩", quote: "Não quero terminar com você por bobagem, mas isso ja passou do nível de bobagem.", my_response: "Você tem toda razão. Não foi bobagem, foi grave. Mas meu amor por nós é infinitamente maior que qualquer obstáculo. Quero cuidar de você como você merece. A gente já passou por tanta coisa e ainda estamos passando, sei que vamos passar por mais ainda. Mas seja o que for, quero sempre você ao meu lado, segurando minha mão." }
        ]
    },
    screen4: {
        title: "Larissa, minha princesa",
        main_message: "Você é a mulher da minha vida.",
        text_paragraphs: [
            "Nunca pensei em terminar. O silêncio foi resultado de uma situação que não soube lidar, jamais falta de amor.",
            "Uma vez eu garanti pra você que terminar, enjoar ou qualquer coisa assim é meio que impossível de acontecer comigo. Quando eu falei isso, foi com total consciência. Eu jamais faria promessas que machucariam seus sentimentos depois. Minha única certeza é que quero você."
        ]
    }
};

const app = {
    clickCount: 0, punchThreshold: 6,
    holdTimer: null, textSpawnTimer: null, isHolding: false, holdProgress: 0, holdDuration: 3500, // Aumentei um pouco pra dar tempo de ler as frases

    init: function() { this.loadContent(); this.setupEventListeners(); },

    loadContent: function() {
        // TELA 1
        document.getElementById('img-reaction-0').src = APP_CONTENT.images.me_normal;
        document.getElementById('img-reaction-1').src = APP_CONTENT.images.me_hurt;
        document.getElementById('img-reaction-2').src = APP_CONTENT.images.me_broken;
        document.getElementById('t1-title').innerText = APP_CONTENT.screen1.title;
        document.getElementById('t1-subtitle').innerText = APP_CONTENT.screen1.subtitle;
        document.getElementById('target-avatar').innerText = APP_CONTENT.screen1.avatar_emoji;
        document.getElementById('btn-screen-1').innerText = APP_CONTENT.screen1.btn_text;

        // TELA 2
        const videoElement = document.getElementById('video-explanation');
        videoElement.src = APP_CONTENT.images.video_explanation;
        videoElement.setAttribute('playsinline', ''); 
        document.getElementById('t2-title').innerText = APP_CONTENT.screen2.title;
        const btn2 = document.getElementById('btn-screen-2');
        btn2.innerText = APP_CONTENT.screen2.btn_text;
        const t2Container = document.getElementById('t2-text-container');
        t2Container.innerHTML = '';
        APP_CONTENT.screen2.text_paragraphs.forEach(p => { const pTag = document.createElement('p'); pTag.innerText = p; t2Container.appendChild(pTag); });

        // Slider Logic
        const slider = document.getElementById('frequency-slider');
        const noise = document.querySelector('.static-noise');
        const vid = document.querySelector('#video-explanation');
        const txt = document.getElementById('t2-text-container');
        const instruction = document.querySelector('.tuner-instruction');
        slider.value = 0;
        slider.oninput = function() {
            const val = this.value; const percentage = val / 100;
            noise.style.opacity = 0.8 - (0.8 * percentage);
            vid.style.filter = `grayscale(${100 - (100*percentage)}%) contrast(1.2) blur(${3 - (3*percentage)}px)`;
            txt.style.filter = `blur(${8 - (8*percentage)}px)`;
            txt.style.opacity = 0.5 + (0.5 * percentage);
            if (val > 95) {
                btn2.style.opacity = "1"; btn2.style.pointerEvents = "all"; instruction.innerText = "✅ Sinal Estabilizado"; instruction.style.color = "#25D366"; txt.classList.remove('blurred-text');
            } else {
                btn2.style.opacity = "0"; btn2.style.pointerEvents = "none"; instruction.innerText = "🎚️ Deslize para estabilizar o sinal"; instruction.style.color = "#9D4EDD";
            }
        };

        // TELA 3 e 4
        document.getElementById('t3-title').innerText = APP_CONTENT.screen3.title;
        document.getElementById('t3-subtitle').innerText = APP_CONTENT.screen3.subtitle;
        document.getElementById('btn-screen-3').innerText = APP_CONTENT.screen3.btn_text;
        document.getElementById('img-final').src = APP_CONTENT.images.final_photo;
        document.getElementById('t4-title').innerText = APP_CONTENT.screen4.title;
        document.getElementById('t4-main-msg').innerText = APP_CONTENT.screen4.main_message;
        const t4Container = document.getElementById('t4-body-container');
        APP_CONTENT.screen4.text_paragraphs.forEach(p => { const pTag = document.createElement('p'); pTag.innerText = p; t4Container.appendChild(pTag); });
        
        this.generateEnvelopes();
        this.setupHoldButton(); 
    },

    generateEnvelopes: function() {
        const container = document.getElementById('envelopes-container');
        container.innerHTML = ''; 
        APP_CONTENT.screen3.letters.forEach((letter, index) => {
            const env = document.createElement('div'); env.className = 'envelope-container';
            env.onclick = function() { app.toggleEnvelope(this) };
            env.innerHTML = `<div class="envelope-flap"></div><div class="envelope-base"><span class="envelope-preview">${letter.preview}</span></div><div class="letter-sheet"><p class="quote">"${letter.quote}"</p><div class="response"><p><strong>Eu:</strong> ${letter.my_response}</p></div></div>`;
            container.appendChild(env); setTimeout(() => env.classList.add('visible'), 100 + (index * 150));
        });
    },

    setupEventListeners: function() {
        const avatar = document.getElementById('target-avatar');
        avatar.addEventListener('pointerdown', (e) => { e.preventDefault(); this.handlePunch(e); });
    },

    handlePunch: function(e) {
        this.clickCount++; if (navigator.vibrate) navigator.vibrate([50, 30, 50]); 
        const flash = document.querySelector('.flash-overlay'); flash.classList.remove('active'); void flash.offsetWidth; flash.classList.add('active');
        const avatar = document.getElementById('target-avatar'); avatar.classList.add('punched'); setTimeout(() => avatar.classList.remove('punched'), 100);
        const container = document.querySelector('.container'); container.classList.remove('screen-shake'); void container.offsetWidth; container.classList.add('screen-shake');
        const pow = document.querySelector('.pow-effect');
        pow.style.setProperty('--tx', `${(Math.random() - 0.5) * 160}px`); pow.style.setProperty('--ty', `${(Math.random() - 0.5) * 160}px`); pow.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`);
        pow.classList.remove('active'); void pow.offsetWidth; pow.classList.add('active');
        this.spawnParticles();
        document.getElementById('counter-text').innerText = `Hits: ${this.clickCount}`;
        const reactionImgs = document.querySelectorAll('.reaction-img'); reactionImgs.forEach(r => { r.classList.remove('active'); r.classList.remove('bump'); });
        let currentImgId = 'img-reaction-0';
        if (this.clickCount > 4 && this.clickCount < 12) { avatar.innerText = APP_CONTENT.screen1.avatar_hurt; currentImgId = 'img-reaction-1'; } 
        else if (this.clickCount >= 12) { avatar.innerText = APP_CONTENT.screen1.avatar_dead; currentImgId = 'img-reaction-2'; }
        const activeImg = document.getElementById(currentImgId); activeImg.classList.add('active'); void activeImg.offsetWidth; activeImg.classList.add('bump');
        if (this.clickCount === this.punchThreshold) {
            const btn = document.getElementById('btn-screen-1'); btn.style.display = "block"; btn.style.animation = "slideUp 0.5s forwards"; btn.onclick = () => this.nextScreen(2);
        }
    },

    spawnParticles: function() {
        const wrapper = document.querySelector('.avatar-container');
        for (let i = 0; i < 3; i++) {
            const p = document.createElement('div'); p.className = 'particle';
            p.innerText = this.clickCount > 8 ? (Math.random() > 0.5 ? '🩸' : '💢') : '💦'; 
            p.style.setProperty('--px', (Math.random() - 0.5) * 200 + 'px'); p.style.setProperty('--py', (Math.random() - 0.5) * 200 + 'px');
            wrapper.appendChild(p); setTimeout(() => p.remove(), 600);
        }
    },

    // --- HOLD BUTTON & FLOATING TEXT ---
    setupHoldButton: function() {
        const btnHold = document.getElementById('btn-hold-action');
        btnHold.addEventListener('pointerdown', (e) => { e.preventDefault(); this.startHold(); });
        btnHold.addEventListener('pointerup', (e) => { e.preventDefault(); this.stopHold(); });
        btnHold.addEventListener('pointerleave', (e) => { e.preventDefault(); this.stopHold(); });
    },

    startHold: function() {
        if (this.isHolding) return;
        this.isHolding = true;
        document.getElementById('btn-hold-action').classList.add('holding');
        if (navigator.vibrate) navigator.vibrate(50); 

        const startTime = Date.now();
        const circle = document.querySelector('.progress-ring__circle');
        const circumference = 339.29; 

        // Timer de Progresso
        this.holdTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            this.holdProgress = Math.min(elapsed / this.holdDuration, 1);
            const offset = circumference - (this.holdProgress * circumference);
            circle.style.strokeDashoffset = offset;
            if (this.holdProgress >= 1) this.completeHold();
        }, 16);

        // Timer de Frases Flutuantes (A cada 400ms)
        this.textSpawnTimer = setInterval(() => {
            this.spawnFloatingText();
            if (navigator.vibrate) navigator.vibrate(10); // Vibraçãozinha a cada frase
        }, 400);
    },

    spawnFloatingText: function() {
        const container = document.getElementById('screen-4');
        const phrase = APP_CONTENT.holdPhrases[Math.floor(Math.random() * APP_CONTENT.holdPhrases.length)];
        
        const el = document.createElement('div');
        el.className = 'floating-phrase';
        el.innerText = phrase;
        
        // Posição aleatória na tela (evitando bordas extremas)
        const x = 20 + Math.random() * 60; // 20% a 80%
        const y = 40 + Math.random() * 30; // 40% a 70% (perto do botão)
        
        el.style.left = x + '%';
        el.style.top = y + '%';
        
        container.appendChild(el);
        setTimeout(() => el.remove(), 1500); // Remove após animação
    },

    stopHold: function() {
        if (!this.isHolding || this.holdProgress >= 1) return;
        this.isHolding = false;
        clearInterval(this.holdTimer);
        clearInterval(this.textSpawnTimer); // Para as frases
        
        document.getElementById('btn-hold-action').classList.remove('holding');
        const circle = document.querySelector('.progress-ring__circle');
        circle.style.transition = 'stroke-dashoffset 0.3s ease'; 
        circle.style.strokeDashoffset = 339.29;
        setTimeout(() => { circle.style.transition = 'stroke-dashoffset 0.1s linear'; }, 300); 
        this.holdProgress = 0;
    },

    completeHold: function() {
        clearInterval(this.holdTimer);
        clearInterval(this.textSpawnTimer);
        this.isHolding = false;
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
        
        const interactionArea = document.getElementById('hold-interaction-area');
        interactionArea.style.animation = "fadeUp 0.5s reverse forwards"; 
        setTimeout(() => {
            interactionArea.style.display = 'none';
            const successMsg = document.getElementById('final-success-container');
            successMsg.style.display = 'flex';
            this.launchConfetti(); 
        }, 500);
    },

    launchConfetti: function() {
        const container = document.querySelector('.final-content');
        const colors = ['#9D4EDD', '#25D366', '#FFD700', '#FF6B6B']; 
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.left = (50 + (Math.random() - 0.5) * 20) + '%';
            c.style.top = (50 + (Math.random() - 0.5) * 20) + '%';
            c.style.setProperty('--cx', (Math.random() - 0.5) * 300 + 'px');
            c.style.setProperty('--cy', (Math.random() * -400) + 'px'); 
            c.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(c);
            setTimeout(() => c.remove(), 2500);
        }
    },

    goToInstagram: function() {
        // Tenta abrir direto no app via deep link, se falhar vai pro browser
        // ig.me é o encurtador oficial do Meta para DMs
        window.location.href = "https://ig.me/m/_kuroashisanji";
    },

    toggleEnvelope: function(element) {
        const all = document.querySelectorAll('.envelope-container');
        const isOpening = !element.classList.contains('open');
        all.forEach(e => { e.classList.remove('open'); e.classList.remove('blur-out'); });
        if (isOpening) {
            element.classList.add('open');
            all.forEach(e => { if (e !== element) e.classList.add('blur-out'); });
            setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
        }
    },
    nextScreen: function(n) {
        const cur = document.querySelector('.screen.active');
        cur.style.opacity = '0'; cur.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            cur.classList.remove('active'); cur.style = '';
            const next = document.getElementById(`screen-${n}`); next.classList.add('active');
            if(n === 3) this.generateEnvelopes();
            window.scrollTo(0,0);
        }, 500);
    },
    restart: function() { location.reload(); }
};

document.addEventListener('DOMContentLoaded', () => app.init());
