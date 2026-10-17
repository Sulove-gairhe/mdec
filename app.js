(() => {
  'use strict';
  const cfg = window.FESTIVAL_CONFIG;
  const $ = (sel) => document.querySelector(sel);
  const ns = 'http://www.w3.org/2000/svg';
  const landing = $('#landing');
  const spinPage = $('#spin');
  const wheelRotor = $('#wheel-rotor');
  const wheelBulbs = $('#wheel-bulbs');
  const status = $('#spin-status');
  const spinnerCopy = $('#spinning-copy');
  const result = $('#win-result');
  const nextCustomer = $('#next-customer');
  let spinning = false;
  let spinTimer = null;
  let visitSequence = 0;
  let wonIndex = null;
  let confettiFrame = 0;
  let confettiParticles = [];
  let lastConfettiStamp = 0;

  function svgElement(tag, attrs = {}) {
    const el = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    return el;
  }

  function socialIcon(type) {
    const node = document.createElement('span');
    node.className = `social-icon ${type}`;
    node.setAttribute('aria-hidden', 'true');
    const icon = svgElement('svg', {
      class:'social-icon-mark',
      viewBox:'0 0 24 24',
      focusable:'false'
    });
    if (type === 'facebook') {
      icon.appendChild(svgElement('path', {
        d:'M13.35 21v-8.2h2.76l.41-3.2h-3.17V7.56c0-.93.26-1.56 1.59-1.56h1.69V3.14A22 22 0 0 0 14.17 3c-2.44 0-4.11 1.49-4.11 4.23V9.6H7.3v3.2h2.76V21z',
        fill:'currentColor'
      }));
    } else if (type === 'tiktok') {
      icon.append(
        svgElement('path', {
          d:'M15 3v11.15a4.12 4.12 0 1 1-3.3-4.04v3.48a.92.92 0 1 0 .18.56V3h3.12c.19 1.56 1.07 2.77 2.7 3.42v3.27A8.06 8.06 0 0 1 15 8.57',
          fill:'none', stroke:'#8acfd0', 'stroke-width':2.1,
          'stroke-linecap':'round', 'stroke-linejoin':'round',
          transform:'translate(-.65 .35)'
        }),
        svgElement('path', {
          d:'M15 3v11.15a4.12 4.12 0 1 1-3.3-4.04v3.48a.92.92 0 1 0 .18.56V3h3.12c.19 1.56 1.07 2.77 2.7 3.42v3.27A8.06 8.06 0 0 1 15 8.57',
          fill:'none', stroke:'currentColor', 'stroke-width':1.8,
          'stroke-linecap':'round', 'stroke-linejoin':'round'
        })
      );
    } else if (type === 'google') {
      icon.append(
        svgElement('path', {
          d:'M21 12.2c0-.68-.06-1.36-.18-2H12v3.8h5.05a4.32 4.32 0 0 1-1.87 2.84v2.47h3.02c1.77-1.63 2.8-4.04 2.8-7.11',
          fill:'#4285f4'
        }),
        svgElement('path', {
          d:'M12 21.3c2.52 0 4.63-.84 6.17-2.28l-3.02-2.47c-.84.57-1.91.91-3.15.91-2.42 0-4.48-1.63-5.22-3.83H3.66v2.55A9.3 9.3 0 0 0 12 21.3',
          fill:'#34a853'
        }),
        svgElement('path', {
          d:'M6.78 13.63a5.6 5.6 0 0 1 0-3.56V7.52H3.66a9.3 9.3 0 0 0 0 8.66z',
          fill:'#fbbc05'
        }),
        svgElement('path', {
          d:'M12 6.24c1.37 0 2.6.47 3.57 1.4l2.68-2.68A8.96 8.96 0 0 0 12 2.7a9.3 9.3 0 0 0-8.34 4.82l3.12 2.55C7.52 7.87 9.58 6.24 12 6.24',
          fill:'#ea4335'
        })
      );
    }
    node.appendChild(icon);
    return node;
  }

  function buildQR() {
    const grid = $('#qr-grid');
    grid.replaceChildren();
    cfg.qr.forEach(qr => {
      const card = document.createElement('div');
      card.className = `qr-card qr-${qr.id}`;
      const title = document.createElement('div');
      title.className = 'qr-card-title';
      title.appendChild(socialIcon(qr.id));
      const name = document.createElement('span');
      name.textContent = qr.label;
      title.appendChild(name);
      const img = document.createElement('img');
      img.className = 'qr-art';
      img.src = qr.image;
      img.alt = `${qr.label} QR code for Modern Digital Electronics`;
      const cap = document.createElement('span');
      cap.className = 'qr-caption';
      cap.textContent = qr.caption || 'SCAN ME';
      card.append(title, img, cap);
      grid.appendChild(card);
    });
  }

  function sectorPath(cx, cy, r, a0, a1) {
    const xy = a => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
    const [x0, y0] = xy(a0), [x1, y1] = xy(a1);
    return `M${cx} ${cy} L${x0.toFixed(3)} ${y0.toFixed(3)} A${r} ${r} 0 0 1 ${x1.toFixed(3)} ${y1.toFixed(3)} Z`;
  }

  function buildWheel() {
    const colors = [
      ['#f3ebd8', true], ['#195bac', false], ['#e6f0fa', true],
      ['#0e468f', false], ['#d0e4f8', true]
    ];
    wheelRotor.replaceChildren();
    cfg.prizes.forEach((prize, i) => {
      const segment = svgElement('g', {transform:`rotate(${i * 72} 400 400)`});
      segment.appendChild(svgElement('path', {
        d:sectorPath(400,400,348,-36,36), fill:colors[i][0],
        stroke:'#e6be73', 'stroke-width':3, 'stroke-linejoin':'round'
      }));
      // Light decorative arcs keep the wheel designed, without crowding product shapes.
      segment.appendChild(svgElement('path', {
        d:'M298 181 Q400 115 502 181', fill:'none', stroke:colors[i][1]?'#c7a56d':'#f0ce91',
        'stroke-opacity':'.6', 'stroke-width':'2'
      }));
      const icon = svgElement('image', {href:prize.image, x:328, y:94, width:144, height:161,
        preserveAspectRatio:'xMidYMid meet', class:'wheel-prize-icon'});
      segment.appendChild(icon);
      const label = svgElement('text', {x:400, y:278,
        class:`wheel-prize-label${colors[i][1]?' dark':''}`});
      const words = prize.english.split(' ');
      const lines = words.length > 1
        ? [words.slice(0, -1).join(' '), words[words.length - 1]]
        : words;
      if (lines.length === 1) label.setAttribute('y', '290');
      lines.forEach((line, lineIndex) => {
        const textLine = svgElement('tspan', {
          x:400,
          dy:lineIndex === 0 ? 0 : 24
        });
        textLine.textContent = line;
        label.appendChild(textLine);
      });
      segment.appendChild(label);
      wheelRotor.appendChild(segment);
    });
    wheelBulbs.replaceChildren();
    for (let i = 0; i < 32; i++) {
      const a = i * 360 / 32;
      const x = 400 + 375 * Math.sin(a * Math.PI / 180);
      const y = 400 - 375 * Math.cos(a * Math.PI / 180);
      wheelBulbs.appendChild(svgElement('circle', {cx:x.toFixed(2), cy:y.toFixed(2), r:7.3,
        fill:'url(#bulbGradient)', stroke:'#8c6028', 'stroke-width':1.1}));
    }
    const list = $('#prize-list');
    list.replaceChildren();
    cfg.prizes.forEach(prize => {
      const item = document.createElement('div');
      item.className = 'prize-mini';
      item.dataset.prizeId = prize.id;
      const img = document.createElement('img'); img.src=prize.image; img.alt='';
      const text = document.createElement('span'); text.textContent = prize.english;
      item.append(img,text); list.append(item);
    });
  }

  function randomIndex(max) {
    if (window.crypto && crypto.getRandomValues) {
      const values = new Uint32Array(1);
      const limit = Math.floor(4294967296 / max) * max;
      do {crypto.getRandomValues(values);} while (values[0] >= limit);
      return values[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function gotoLanding() {
    if (location.hash !== '#/') location.hash = '#/';
    else displayLanding();
  }
  function gotoSpin() {
    if (location.hash !== '#/spin') location.hash = '#/spin';
    else displaySpin();
  }

  function clearSpinTimer() {
    if (spinTimer !== null) {clearTimeout(spinTimer); spinTimer = null;}
  }
  function resetWheel() {
    clearSpinTimer();
    spinning = false; wonIndex = null;
    wheelRotor.style.transition='none';
    wheelRotor.style.transform='rotate(0deg)';
    spinnerCopy.classList.remove('hidden');
    result.classList.add('hidden');
    $('.prize-mini.selected')?.classList.remove('selected');
    status.textContent='घुम्न तयार छ…';
    nextCustomer.disabled=false;
  }
  function displayLanding() {
    visitSequence += 1;
    resetWheel(); stopConfetti();
    landing.classList.remove('hidden');
    spinPage.classList.add('hidden');
    document.title='Modern Digital Electronics | दशैं तिहार २०८३';
  }
  function displaySpin() {
    visitSequence += 1;
    const currentVisit=visitSequence;
    resetWheel(); stopConfetti();
    landing.classList.add('hidden');
    spinPage.classList.remove('hidden');
    document.title='SPIN & WIN | Modern Digital Electronics';
    status.textContent='अब चक्का घुम्दैछ…';
    nextCustomer.disabled = true;
    // Reveal the new page first, then automatically start the wheel.
    spinTimer = window.setTimeout(() => {
      if (currentVisit === visitSequence && location.hash === '#/spin') startSpin();
    }, 750);
  }
  function onRoute() {
    if (location.hash === '#/spin') displaySpin();
    else displayLanding();
  }

  function startSpin() {
    if (spinning) return;
    clearSpinTimer();
    spinning = true;
    const picked = randomIndex(cfg.prizes.length);
    wonIndex = picked;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1800 : cfg.spinDurationMs;
    // Sector i sits at i*72° clockwise; place its middle beneath the top pointer.
    const smallOffset = (randomIndex(13) - 6);
    const finalDegrees = cfg.spinRounds * 360 - picked * (360 / cfg.prizes.length) + smallOffset;
    status.textContent = 'तपाईंको उपहार छनोट हुँदैछ…';
    wheelRotor.getBoundingClientRect();
    wheelRotor.style.transition = `transform ${duration}ms cubic-bezier(.14,.80,.09,1)`;
    requestAnimationFrame(() => {
      wheelRotor.style.transform = `rotate(${finalDegrees}deg)`;
    });
    const currentVisit = visitSequence;
    spinTimer = window.setTimeout(() => {
      if (currentVisit === visitSequence && location.hash === '#/spin') finishSpin(picked);
    }, duration + 150);
  }

  function finishSpin(index) {
    clearSpinTimer(); spinning=false;
    const prize = cfg.prizes[index];
    spinnerCopy.classList.add('hidden');
    $('#result-image').src = prize.image;
    $('#result-image').alt = prize.english;
    $('#result-title').textContent = prize.english;
    $('#result-english').textContent = prize.english;
    result.classList.remove('hidden');
    status.textContent = `Congratulations! You won ${prize.english}.`;
    const selected = document.querySelector(`[data-prize-id="${prize.id}"]`);
    if (selected) selected.classList.add('selected');
    nextCustomer.disabled = false;
    startConfetti();
    // Dispatched for optional future POS/CRM wiring. This static demo does not save prizes.
    window.dispatchEvent(new CustomEvent('festival:prize-selected', {detail:{prizeId:prize.id, prizeName:prize.english}}));
  }

  const canvas = $('#confetti');
  const ctx = canvas.getContext('2d',{alpha:true});
  const colors = ['#f2d58c','#fffbeb','#82c3ff','#275eab','#f9b34d','#ffffff','#58a6e5'];
  let confettiWidth = 0, confettiHeight = 0, confettiScale = 1;
  function resizeConfetti() {
    confettiScale = Math.min(devicePixelRatio || 1, 2);
    confettiWidth = innerWidth; confettiHeight = innerHeight;
    canvas.width = Math.floor(confettiWidth * confettiScale);
    canvas.height = Math.floor(confettiHeight * confettiScale);
    ctx.setTransform(confettiScale,0,0,confettiScale,0,0);
  }
  function particle() {
    const partySide = Math.random() < .5;
    return {x:partySide ? -15 : confettiWidth + 15,
      y:confettiHeight * (.23 + Math.random()*.42),
      vx:(partySide?1:-1) * (2 + Math.random()*6), vy:-4-Math.random()*7,
      angle:Math.random()*6.28, spin:(Math.random()-.5)*.19,
      w:5+Math.random()*8, h:7+Math.random()*10,
      color:colors[Math.floor(Math.random()*colors.length)], life:0};
  }
  function animateConfetti(time) {
    if (!confettiFrame) return;
    confettiFrame = requestAnimationFrame(animateConfetti);
    if (time - lastConfettiStamp < 30) return; // cap paint at ~30 FPS on TV hardware
    lastConfettiStamp = time;
    ctx.clearRect(0,0,confettiWidth,confettiHeight);
    // Continuous side poppers; keep looping for as long as the prize page stays open.
    for(let i=0;i<6 && confettiParticles.length<175;i++) confettiParticles.push(particle());
    confettiParticles=confettiParticles.filter(p => p.y<confettiHeight+35 && p.life<250);
    for (const p of confettiParticles) {
      p.x+=p.vx; p.y+=p.vy; p.vy+=.16; p.vx*=.993; p.angle+=p.spin; p.life++;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle);
      ctx.fillStyle=p.color;ctx.globalAlpha=Math.min(1,(250-p.life)/70);
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
    }
  }
  function startConfetti() {
    if(confettiFrame) return;
    resizeConfetti();
    canvas.style.display='block';
    confettiParticles=[];
    // Create an initial burst; later frames keep both party poppers alive indefinitely.
    for(let i=0;i<100;i++) confettiParticles.push(particle());
    confettiFrame=requestAnimationFrame(animateConfetti);
  }
  function stopConfetti() {
    if (confettiFrame) cancelAnimationFrame(confettiFrame);
    confettiFrame=0;confettiParticles=[];
    ctx.clearRect(0,0,confettiWidth,confettiHeight);
    canvas.style.display='none';
  }

  $('#open-gift').addEventListener('click', gotoSpin);
  nextCustomer.addEventListener('click', gotoLanding);
  window.addEventListener('hashchange', onRoute);
  window.addEventListener('resize', () => {if (confettiFrame) resizeConfetti();});
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key.toLowerCase() === 'n') {
      if (location.hash === '#/spin') {event.preventDefault();gotoLanding();}
    } else if ((event.key === 'Enter' || event.key === ' ') && location.hash !== '#/spin') {
      if (event.target?.tagName !== 'BUTTON') {event.preventDefault(); gotoSpin();}
    }
  });
  buildQR(); buildWheel();
  onRoute();
})();
