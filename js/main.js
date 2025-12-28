// ========================================
// 도담한의원 - JavaScript
// ========================================

// DOM 요소
const header = document.getElementById('header');
const navMenu = document.getElementById('navMenu');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const topBtn = document.getElementById('topBtn');
const consultationForm = document.getElementById('consultationForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initHeroSlider();
});

// 히어로 슬라이더 초기화
function initHeroSlider() {
    const heroSwiper = new Swiper('.heroSwiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 스크롤 이벤트
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 모바일 메뉴
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // 네비게이션 링크 클릭 시 메뉴 닫기
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // 맨 위로 버튼
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 상담 폼 제출
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(consultationForm);
            const name = formData.get('name');
            const phone = formData.get('phone');

            // 여기에 실제 폼 제출 로직 추가 가능
            console.log('상담 신청:', { name, phone });

            // 토스트 알림 표시
            showToast(`${name}님, 상담 신청이 완료되었습니다!`);

            // 폼 초기화
            consultationForm.reset();
        });
    }

    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// 토스트 알림
function showToast(message) {
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
