// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
  // ナビゲーションのアクティブ状態管理
  initActiveNavigation();
  
  // スムーススクロール
  initSmoothScroll();
  
  // カードのホバーエフェクト強化
  initCardEffects();
});

/**
 * ナビゲーションのアクティブ状態管理
 */
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
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
