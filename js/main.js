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

// Authentication State Management
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authBtnContainers = document.querySelectorAll('.header-btns');

    authBtnContainers.forEach(container => {
        if (isLoggedIn) {
            container.innerHTML = `
                <div class="user-info" style="display: flex; align-items: center; gap: 15px;">
                    <span class="user-name" style="font-weight: 600; color: var(--color-secondary);">박승재 님</span>
                    <button class="btn btn-outline" onclick="handleLogout()" style="padding: 8px 16px;">로그아웃</button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html" class="btn btn-primary">로그인</a>
            `;
        }
    });
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    alert('로그아웃되었습니다.');
    window.location.reload();
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    handlePopup();
    setupEventListeners();
    initHeroSlider();
});

// Popup Logic
function handlePopup() {
    const popup = document.getElementById('mainPopup');
    const noShowToday = localStorage.getItem('noShowPopup');
    const today = new Date().toDateString();

    if (noShowToday === today) {
        if (popup) popup.style.display = 'none';
    } else {
        if (popup) {
            setTimeout(() => {
                popup.style.display = 'flex';
            }, 1000); // 1 second delay for better UX
        }
    }
}

function closePopup() {
    const popup = document.getElementById('mainPopup');
    const noShowCheckbox = document.getElementById('noShowToday');

    if (noShowCheckbox && noShowCheckbox.checked) {
        const today = new Date().toDateString();
        localStorage.setItem('noShowPopup', today);
    }

    if (popup) popup.style.display = 'none';
}

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


// ========================================
// Reservation Calendar Logic
// ========================================
let currentDate = new Date();
let selectedDate = new Date();

function handleReservation() {
    const calendarDays = document.getElementById('calendarDays');
    const monthYearTitle = document.getElementById('currentMonthYear');
    const selectedDateTitle = document.getElementById('selectedDateTitle');

    if (!calendarDays || !monthYearTitle) return;

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearTitle.textContent = `${year}.${String(month + 1).padStart(2, '0')}`;

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        // Empty slots for previous month's days
        for (let i = 0; i < firstDay; i++) {
            const div = document.createElement('div');
            div.classList.add('day', 'empty');
            calendarDays.appendChild(div);
        }

        // Days of current month
        for (let i = 1; i <= lastDate; i++) {
            const div = document.createElement('div');
            div.classList.add('day');
            div.textContent = i;

            const isToday = i === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

            const isSelected = i === selectedDate.getDate() &&
                month === selectedDate.getMonth() &&
                year === selectedDate.getFullYear();

            if (isToday) div.classList.add('today');
            if (isSelected) div.classList.add('selected');

            div.addEventListener('click', () => {
                selectedDate = new Date(year, month, i);
                updateSelectedView();
                renderCalendar();
                generateRandomSlots();
            });

            calendarDays.appendChild(div);
        }
    }

    function updateSelectedView() {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const formatted = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 (${days[selectedDate.getDay()]})`;
        if (selectedDateTitle) selectedDateTitle.textContent = formatted;
    }

    function generateRandomSlots() {
        const slotsGrid = document.getElementById('reservationSlots');
        if (!slotsGrid) return;

        const times = ['09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
        slotsGrid.innerHTML = '';

        times.forEach(time => {
            const isFull = Math.random() > 0.6; // Randomly set some as full
            const slot = document.createElement('div');
            slot.classList.add('slot-item', isFull ? 'full' : 'available');
            slot.innerHTML = `
                <span class="time">${time}</span>
                <span class="status">${isFull ? '예약마감' : '예약가능'}</span>
            `;

            if (!isFull) {
                slot.addEventListener('click', () => {
                    alert(`${time} 예약을 위해 네이버 예약 페이지로 이동합니다.`);
                    window.open('https://m.booking.naver.com/booking/13/bizes/857699?theme=place&service-target=map-pc&lang=ko&area=pll', '_blank');
                });
            }
            slotsGrid.appendChild(slot);
        });
    }

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
    updateSelectedView();
}

// Update initialization
const originalInit = document.addEventListener;
document.addEventListener('DOMContentLoaded', () => {
    // Other initializations...
    handleReservation();
});
