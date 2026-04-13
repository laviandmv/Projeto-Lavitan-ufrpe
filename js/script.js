document.addEventListener('DOMContentLoaded', () => {
    // Current year in footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1, // trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Smooth Scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lógica Genérica para Modais
    const setupModal = (modalId, btnId) => {
        const modal = document.getElementById(modalId);
        const btn = document.getElementById(btnId);
        if (!modal || !btn) return;

        const closeBtn = modal.querySelector('.close-modal');

        const openModal = (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden'; 
        };

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            document.body.style.overflow = ''; 
        };

        btn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
        });
    };

    // Inicializar Modais
    setupModal('modal-sites', 'btn-sites-importantes');
    setupModal('modal-manuais', 'btn-manuais');
    setupModal('modal-apresentacao', 'btn-apresentacao');
    setupModal('modal-materiais', 'btn-materiais');
    setupModal('modal-comunidade', 'btn-comunidade');
    setupModal('modal-monitoramento', 'btn-monitoramento');

    // --- Modal de Educação em Saúde + Carrossel de Fotos ---
    const modalEducacao = document.getElementById('modal-educacao-saude');
    const btnEducacao = document.getElementById('btn-educacao-saude');

    if (modalEducacao && btnEducacao) {
        const track = document.getElementById('carousel-track');
        const slides = track ? track.querySelectorAll('.carousel-slide') : [];
        const dotsContainer = document.getElementById('carousel-dots');
        const counter = document.getElementById('carousel-counter');
        const btnPrev = document.getElementById('carousel-prev');
        const btnNext = document.getElementById('carousel-next');
        const total = slides.length;
        let current = 0;

        // Criar dots
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            });
        }

        function updateCarousel() {
            if (track) track.style.transform = `translateX(-${current * 100}%)`;
            if (counter) counter.textContent = `${current + 1} / ${total}`;
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === current);
                });
            }
        }

        function goTo(index) {
            current = (index + total) % total;
            updateCarousel();
        }

        if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1));
        if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1));

        // Teclado (setas esquerda/direita)
        window.addEventListener('keydown', (e) => {
            if (!modalEducacao.classList.contains('show')) return;
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        });

        // Swipe no touch
        let touchStartX = 0;
        if (track) {
            track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
            track.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
            }, { passive: true });
        }

        // Abrir modal
        const openModalEducacao = (e) => {
            e.preventDefault();
            current = 0;
            updateCarousel();
            modalEducacao.style.display = 'flex';
            setTimeout(() => modalEducacao.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
        };
        const closeModalEducacao = () => {
            modalEducacao.classList.remove('show');
            setTimeout(() => { modalEducacao.style.display = 'none'; }, 300);
            document.body.style.overflow = '';
        };

        btnEducacao.addEventListener('click', openModalEducacao);
        const closeBtn = modalEducacao.querySelector('.close-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeModalEducacao);
        window.addEventListener('click', (e) => { if (e.target === modalEducacao) closeModalEducacao(); });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalEducacao.classList.contains('show')) closeModalEducacao(); });
    }
});
