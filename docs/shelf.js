// ========================================
// shelf.js ― 作品棚デザインの動き
//   ・ヒーロー: 作品カードの映像/画像を順番に流す
//   ・作品カード: ホバー(スマホは画面中央)でプレイ映像を再生
//   ・Works の絞り込み
//   ・ヘッダー: ヒーローを過ぎたら地の色にする
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [...document.querySelectorAll('.game')];

  initReel();
  initCardVideos();
  initFilters();
  initHeader();

  // ---- ヒーローの映像リール ----
  function initReel() {
    const reel = document.getElementById('reel');
    const ticks = document.getElementById('ticks');
    if (!reel || !ticks || cards.length === 0) return;

    const games = cards.map(card => ({
      id: card.id,
      title: card.dataset.title,
      genre: card.dataset.genre,
      poster: card.dataset.poster,
      video: card.dataset.video,
      color: card.style.getPropertyValue('--c'),
    }));
    const layers = [0, 1].map(() => {
      const layer = document.createElement('div');
      layer.className = 'reel-layer';
      reel.append(layer);
      return layer;
    });
    const nowTitle = document.getElementById('nowTitle');
    const nowGenre = document.getElementById('nowGenre');
    let current = -1;
    let front = 0;
    let timer;

    games.forEach((game, i) => {
      const tick = document.createElement('button');
      tick.className = 'tick';
      tick.style.setProperty('--c', game.color);
      tick.setAttribute('aria-label', `${game.title}の映像を流す`);
      tick.addEventListener('click', () => show(i));
      ticks.append(tick);
    });
    document.getElementById('now').hidden = false;

    function show(i) {
      if (i === current) return;
      current = i;
      const game = games[i];
      const back = layers[1 - front];
      const oldVideo = layers[front].querySelector('video');

      back.innerHTML = game.video && !reduceMotion
        ? `<video src="${game.video}" poster="${game.poster}" muted autoplay loop playsinline></video>`
        : `<img src="${game.poster}" alt="">`;

      let revealed = false;
      const reveal = () => {
        if (revealed || current !== i) return;
        revealed = true;
        back.classList.add('is-on');
        layers[front].classList.remove('is-on');
        front = 1 - front;
        // 裏に回った映像は止めて、通信と負荷を抑える
        if (oldVideo) setTimeout(() => oldVideo.pause(), 1000);
      };
      const video = back.querySelector('video');
      if (video) {
        video.addEventListener('playing', reveal, { once: true });
        setTimeout(reveal, 1500); // 自動再生できない環境でもポスターで切り替える
      } else {
        reveal();
      }

      nowTitle.textContent = game.title;
      nowTitle.href = '#' + game.id;
      nowGenre.textContent = game.genre;
      [...ticks.children].forEach((tick, n) => tick.classList.toggle('is-on', n === i));

      clearTimeout(timer);
      if (!reduceMotion) timer = setTimeout(() => show((current + 1) % games.length), 6000);
    }

    show(0);
  }

  // ---- 作品カードのプレイ映像 ----
  function initCardVideos() {
    if (reduceMotion) return;

    function play(card, on) {
      const video = card.querySelector('.media video');
      if (!video) return;
      if (on) {
        if (!video.src) video.src = video.dataset.src;
        video.play().then(() => card.classList.add('is-playing')).catch(() => {});
      } else {
        video.pause();
        card.classList.remove('is-playing');
      }
    }

    if (matchMedia('(hover: hover)').matches) {
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => play(card, true));
        card.addEventListener('mouseleave', () => play(card, false));
      });
    } else if ('IntersectionObserver' in window) {
      // スマホ: 画面の真ん中あたりにあるカードだけ再生
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => play(entry.target, entry.isIntersecting));
      }, { rootMargin: '-35% 0px -35% 0px' });
      cards.forEach(card => io.observe(card));
    }
  }

  // ---- 絞り込み ----
  function initFilters() {
    const shelf = document.querySelector('.shelf');
    const filters = document.querySelectorAll('.filter');
    filters.forEach(btn => btn.addEventListener('click', () => {
      const kind = btn.dataset.f;
      filters.forEach(b => {
        b.classList.toggle('is-on', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      shelf.classList.toggle('is-filtered', kind !== 'all');
      cards.forEach(card => card.classList.toggle('is-hidden', kind !== 'all' && card.dataset.kind !== kind));
    }));
  }

  // ---- ヘッダー ----
  function initHeader() {
    const header = document.getElementById('header');
    const hero = document.querySelector('.hero');
    if (!header || !hero || !('IntersectionObserver' in window)) {
      header && header.classList.add('is-solid');
      return;
    }
    new IntersectionObserver(([entry]) => header.classList.toggle('is-solid', !entry.isIntersecting), {
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    }).observe(hero);
  }
});
