// Mobile menu
(function initMobileMenu() {
    const burgerButton = document.getElementById('burgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');

    if (!burgerButton || !mobileMenu || !backdrop) return;

    const setOpen = (open) => {
        document.body.classList.toggle('menu-open', open);
        burgerButton.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    const toggle = () => setOpen(!document.body.classList.contains('menu-open'));
    const close = () => setOpen(false);

    burgerButton.addEventListener('click', toggle);
    backdrop.addEventListener('click', close);

    mobileMenu.addEventListener('click', (e) => {
        const target = e.target;
        if (target instanceof HTMLAnchorElement) close();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();

// Fade-in sections on scroll
(function initRevealOnScroll() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = Array.from(document.querySelectorAll('main section, body > section, section'));

    // Avoid breaking layout: only decorate real page sections once.
    const uniqueSections = Array.from(new Set(sections));
    uniqueSections.forEach((el) => el.classList.add('reveal'));

    if (prefersReducedMotion) {
        uniqueSections.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    if (!('IntersectionObserver' in window)) {
        uniqueSections.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { root: null, threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    uniqueSections.forEach((el) => observer.observe(el));
})();

// Toggle extended plans modal
function toggleExtendedPlans() {
    const modal = document.getElementById('extendedPlansModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('extendedPlansModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// Coach data (HTML in strings is static, controlled by site author)
const coaches = [
    {
        id: 0,
        name: 'Подоляко Аркадий',
        rank: '🥋 Черный пояс · 8+ лет опыта',
        image: 'images/arkady.jpg',
        lead: 'Сертифицированный инструктор с международным признанием. <strong>Черный пояс</strong> и <strong>8+ лет</strong> на татами: от базовой техники до соревновательной подготовки.',
        achievements: [
            '<strong>Серебряный призёр</strong> чемпионата Европы по джиу-джитсу',
            'Победы и призовые места в лигах <strong>ACBJJ, AJP, JJIF и UWW</strong>',
            'Ученики — <strong>действующие чемпионы и призёры</strong> чемпионатов России и Европы'
        ],
        paragraphs: [
            'На тренировках вы получаете <strong>понятную систему</strong>: работа на ногах, проходы защиты, сильный гард и работа под давлением.',
            'Спокойная атмосфера и <strong>индивидуальный подход</strong>: новичкам — уверенный старт, опытным — точечная доработка слабых мест и план на соревнования.'
        ],
        focus: '<strong>Направленность:</strong> чистая техника, последовательная подготовка и результат на соревнованиях.',
        socialLink: 'https://vk.com/id91910624'
    },
    {
        id: 1,
        name: 'Подоляко Тимур',
        rank: '🟣 Пурпурный пояс · КМС · 10+ лет опыта',
        image: 'images/timur.jpg',
        lead: '<strong>КМС по джиу-джитсу</strong> и действующий спортсмен с <strong>более чем 10-летним опытом</strong>.',
        achievements: [
            '<strong>Призёр чемпионата и Кубка России.</strong> <strong>3-кратный победитель ЮФО.</strong>',
            '<strong>Двукратный чемпион мира</strong> по лиге <strong>ACBJJ</strong> — одной из самых конкурентных лиг в BJJ.'
        ],
        paragraphs: [
            'Под его руководством ученики <strong>быстро выходят на уровень соревнований</strong> и занимают <strong>призовые места</strong>.',
            'Даже если ученик начинает <strong>с нуля</strong> — уже через <strong>несколько месяцев</strong> он получает <strong>уверенность, силу и базовую технику</strong>.'
        ],
        focus: '<strong>Направленность:</strong> быстрый прогресс, грамотная техника и результат.',
        socialLink: 'https://vk.com/poodolyakko'
    }
];

let currentCoachIndex = 0;

function createCoachCard(coach) {
    const achievementsHtml = coach.achievements && coach.achievements.length
        ? `<p class="coach-achievements-title">Достижения</p>
           <ul class="coach-achievements">${coach.achievements.map((item) => `<li>${item}</li>`).join('')}</ul>`
        : '';
    const paragraphsHtml = (coach.paragraphs || []).map((p) => `<p class="coach-text">${p}</p>`).join('');
    const focusHtml = coach.focus ? `<div class="coach-focus">${coach.focus}</div>` : '';
    return `
        <div class="coach-card">
            <div class="coach-image">
                <img src="${coach.image}" alt="${coach.name} - тренер по БЖЖ">
            </div>
            <div class="coach-info">
                <h3>${coach.name}</h3>
                <p class="coach-rank">${coach.rank}</p>
                <p class="coach-lead">${coach.lead}</p>
                ${achievementsHtml}
                ${paragraphsHtml}
                ${focusHtml}
                <a href="${coach.socialLink}" target="_blank" rel="noopener noreferrer" class="coach-cta">Записаться на тренировку</a>
            </div>
        </div>
    `;
}

function updateCarousel() {
    const mainContainer = document.getElementById('coachMainContainer');
    const counterElement = document.getElementById('coachCounter');
    
    const mainCoach = coaches[currentCoachIndex];
    
    mainContainer.innerHTML = createCoachCard(mainCoach);
    counterElement.textContent = `${currentCoachIndex + 1}/${coaches.length}`;
}

function scrollCoaches(direction) {
    currentCoachIndex = (currentCoachIndex + direction + coaches.length) % coaches.length;
    updateCarousel();
}

// Initialize carousel
updateCarousel();

// Smooth scroll for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('cta-button') || this.classList.contains('cta-button-fixed')) {
            // Action feedback
            console.log('Кнопка записи нажата');
        }
    });
});
