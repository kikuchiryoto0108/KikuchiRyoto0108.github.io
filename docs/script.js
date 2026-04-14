// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
  // ナビゲーションのアクティブ状態管理
  initActiveNavigation();
  
  // スムーススクロール
  initSmoothScroll();
  
  // カードのホバーエフェクト強化
  initCardEffects();
  
  // Worksの詳細表示
  initWorkDetails();
});

/**
 * ナビゲーションのアクティブ状態管理
 */
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observerOptions = {
    // 縦に長いセクションでも確実に反応するように調整
    threshold: 0.1,
    // 判定範囲をゆるくする
    rootMargin: '-80px 0px -20% 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        
        // 全てのnavリンクからactiveクラスを削除
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // 対応するnavリンクにactiveクラスを追加
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
}


/**
 * スムーススクロール機能
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * カードのホバーエフェクト強化
 */
function initCardEffects() {
  const cards = document.querySelectorAll('.work-card, .activity-card, .link-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-2px)';
    });
  });
}

// パフォーマンス向上のためのデバウンス関数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// スクロールイベントの最適化
const handleScroll = debounce(() => {
  // 必要に応じてスクロールイベントの処理を追加
}, 100);

window.addEventListener('scroll', handleScroll);

/**
 * 作品詳細モーダルの初期化
 */
function initWorkDetails() {
  const detailBtns = document.querySelectorAll('.detail-btn');

  // --- モーダルを開く ---
  detailBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const modal = document.getElementById(targetId);
      if (!modal) return;

      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
    });
  });

  // --- モーダルを閉じるヘルパー ---
  function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  // --- ✕ ボタンで閉じる ---
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function () {
      const modal = this.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  // --- オーバーレイ（背景暗幕）クリックで閉じる ---
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      // ウィンドウ本体ではなく背景をクリックした場合のみ閉じる
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // --- Escキーで閉じる ---
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay.is-open');
      if (openModal) closeModal(openModal);
    }
  });
}

// DOMContentLoaded 内に追加
document.addEventListener('DOMContentLoaded', function() {
  initActiveNavigation();
  initSmoothScroll();
  initCardEffects();
  initWorkDetails();
  initSliders();       // ← 追加
});

/**
 * モーダル内スライダーの初期化
 */
function initSliders() {
  const sliders = document.querySelectorAll('.modal-slider');

  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.slider-slide');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    let current = 0;

    if (slides.length <= 1) return;

    // ドット生成
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `スライド ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function goTo(index) {
      // 動画のスライドから離れるとき、iframe を止める
      const currentIframe = slides[current].querySelector('iframe');
      if (currentIframe) {
        const src = currentIframe.src;
        currentIframe.src = '';
        currentIframe.src = src;
      }

      slides[current].classList.remove('active');
      dots[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
  });
}
