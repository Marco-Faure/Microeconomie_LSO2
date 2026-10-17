/* Outils interactifs, microéconomie LSO2 — © 2026 Marc-Antoine Faure Colonna d'Istria
   Fichier commun à toutes les pages : plan du site, menu, outils partagés.
   Pour ajouter un outil ou un chapitre, il suffit de compléter SITE ci-dessous
   et de téléverser la nouvelle page avec ce fichier. */

const SITE = {
  titre: 'Outils interactifs, microéconomie LSO2',
  auteur: "© 2026 Marc-Antoine Faure Colonna d'Istria",
  chapitres: [
    { id: 'ch1', n: 1, titre: 'Équilibres et optimalités', pages: [
      // [fichier, titre court, notion du cours, durée en minutes]
      ['surplus.html', 'Surplus et perte sèche', 'Les surplus et la perte sèche', 15],
      ['edgeworth.html', "Boîte d'Edgeworth", "L'équilibre général et les théorèmes du bien-être", 20],
      ['pareto.html', 'Optimum de Pareto', "L'optimum de Pareto", 10],
      ['fiscalite.html', 'Incidence fiscale', 'La fiscalité et son incidence', 15],
      ['dilemme-prisonnier.html', 'Dilemme du prisonnier', 'Théorie des jeux : le dilemme du prisonnier', 15] ] },
    { id: 'ch2', n: 2, titre: 'Les effets externes', pages: [
      ['ch2-externalites.html', 'Coût privé, coût social', 'Effet externe, coût privé et coût social', 10],
      ['ch2-pigou.html', 'Taxe et subvention', 'Logique interventionniste : taxe pigouvienne, subvention, transferts forfaitaires', 15],
      ['ch2-fusion.html', 'Fusion et profit joint', 'Logique transformatrice : fusion et internalisation', 15],
      ['ch2-coase.html', 'Droits de propriété', 'Logique transformatrice : droits de propriété et théorème de Coase', 15] ] }
  ],
  reviser: { id: 'reviser', titre: 'Réviser', pages: [
      ['cartes.html', 'Cartes et QCM'],
      ['exercices.html', "Générateur d'exercices"],
      ['lexique.html', 'Lexique'] ] }
};

/* ---------- Mesure d'audience anonyme ---------- */
(() => {
  if (location.protocol === 'file:') return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = 'https://micro-lso2.goatcounter.com/count';
  document.head.appendChild(s);
})();

/* ---------- Menu et navigation ---------- */
const PAGE = (location.pathname.split('/').pop() || 'index.html');
function siteNav() {
  const R = SITE.reviser, rev = R.pages.some(p => p[0] === PAGE);
  const ch = rev ? R : SITE.chapitres.find(c => c.pages.some(p => p[0] === PAGE));
  const chs = SITE.chapitres.map(c => `<a href="index.html#${c.id}"${ch === c ? ' aria-current="true"' : ''}>Chapitre ${c.n}</a>`).join('')
    + `<a href="${R.pages[0][0]}"${rev ? ' aria-current="true"' : ''}>${R.titre}</a>`;
  let h = `<nav class="site" aria-label="Site"><a class="home" href="index.html"><b>${SITE.titre}</b><span>${SITE.auteur}</span></a><div class="chs">${chs}</div></nav>`;
  if (ch) h += `<nav class="subnav" aria-label="${ch.n ? 'Outils du chapitre ' + ch.n : ch.titre}"><span class="chl">${ch.n ? 'Chapitre ' + ch.n + ' · ' : ''}${ch.titre}</span>`
    + ch.pages.map(p => `<a href="${p[0]}"${p[0] === PAGE ? ' aria-current="page"' : ''}>${p[1]}</a>`).join('') + '</nav>';
  else h += '<div style="height:20px"></div>';
  return h;
}
function sitePager() {
  const all = SITE.chapitres.flatMap(c => c.pages.map(p => [...p, c]));
  const i = all.findIndex(p => p[0] === PAGE); if (i < 0) return '';
  const cur = all[i][2]; let s = '<nav class="pager" aria-label="Outil précédent ou suivant">';
  if (i > 0) { const [f, t, c] = all[i - 1]; s += `<a class="prev" href="${f}"><small>← Précédent${c !== cur ? ' · Chapitre ' + c.n : ''}</small><b>${t}</b></a>`; }
  if (i < all.length - 1) { const [f, t, c] = all[i + 1]; s += `<a class="next" href="${f}"><small>${c !== cur ? 'Chapitre ' + c.n + ' · ' : ''}Suivant →</small><b>${t}</b></a>`; }
  return s + '</nav>';
}
function siteFill() {
  const n = document.getElementById('site-nav'); if (n) n.outerHTML = siteNav();
  const p = document.getElementById('site-pager'); if (p) p.outerHTML = sitePager();
  const all = SITE.chapitres.flatMap(c => c.pages);
  // En-tête d'un outil : notion du cours et durée
  const me = all.find(x => x[0] === PAGE), h = document.querySelector('header.top > div');
  if (me && h && !h.querySelector('.kicker')) h.insertAdjacentHTML('afterbegin', `<p class="kicker"><span>Notion du cours : ${me[2]}</span><span>Environ ${me[3]} min</span></p>`);
  // Accueil : durée de chaque outil
  document.querySelectorAll('.tool a[href]').forEach(a => {
    const x = all.find(y => y[0] === a.getAttribute('href')), i = a.querySelector('.idx');
    if (x && i && !i.dataset.d) { i.dataset.d = 1; i.textContent += ` · ${x[3]} min`; }
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', siteFill); else siteFill();

/* ---------- Outils partagés ---------- */
const C = { navy:'#006EB8', brick:'#B6321C', forest:'#009B55', ink:'#1A2130', muted:'#5B6372', faint:'#A3A9B3', gray:'#8A909B' };
const $ = s => document.querySelector(s);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pop = el => { if (!el || reduce) return; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); };
const fr = (n, d = 2) => { const r = Math.round(n * 10 ** d) / 10 ** d, v = Object.is(r, -0) ? 0 : r; let [i, f] = Math.abs(v).toFixed(d).split('.'); f = f ? f.replace(/0+$/, '') : ''; i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return (v < 0 ? '−' : '') + i + (f ? ',' + f : ''); };
const NS = 'http://www.w3.org/2000/svg';
function Defis(n) {
  const done = Array(n).fill(false);
  const sync = () => {
    done.forEach((v, i) => { const d = $('#d' + i); if (d) d.classList.toggle('ok', v); });
    const k = done.filter(Boolean).length, dots = $('#dots');
    if (dots) dots.innerHTML = done.map((_, i) => `<i class="${i < k ? 'on' : ''}"></i>`).join('');
    const t = $('#scoreTxt'); if (t) t.textContent = k === n ? `Les ${n} défis sont réussis` : `${k} défi${k > 1 ? 's' : ''} réussi${k > 1 ? 's' : ''} sur ${n}`;
  };
  sync();
  return { done, sync, win(i, html) { if (done[i]) return false; done[i] = true; if (html != null) { const f = $('#f' + i); if (f) f.innerHTML = html; } sync(); pop($('#d' + i)); return true; } };
}
// Repère cartésien : X(q), Y(p), cadre et grille
function Frame(svg, o) {
  const W = o.W || 640, H = o.H || 440, L = o.L || 56, R = o.R || 22, T = o.T || 16, B = o.B || 44, PW = W - L - R, PH = H - T - B;
  const X = x => L + (x - (o.x0 || 0)) / (o.x1 - (o.x0 || 0)) * PW, Y = y => T + (1 - (y - (o.y0 || 0)) / (o.y1 - (o.y0 || 0))) * PH;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  let s = `<defs><clipPath id="${svg.id}cl"><rect x="${L}" y="${T}" width="${PW}" height="${PH}"/></clipPath>
    <marker id="${svg.id}ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${C.ink}"/></marker></defs>`;
  const fx = o.fx || (v => fr(v, 1)), fy = o.fy || (v => fr(v, 1));
  for (let v = (o.x0 || 0) + o.dx; v <= o.x1 + 1e-9; v += o.dx) s += `<line class="gl" x1="${X(v)}" y1="${T}" x2="${X(v)}" y2="${T + PH}"/><text x="${X(v)}" y="${T + PH + 18}" text-anchor="middle" fill="${C.muted}">${fx(v)}</text>`;
  for (let v = (o.y0 || 0) + o.dy; v < o.y1 - 1e-9; v += o.dy) s += `<line class="gl" x1="${L}" y1="${Y(v)}" x2="${L + PW}" y2="${Y(v)}"/><text x="${L - 8}" y="${Y(v) + 4.5}" text-anchor="end" fill="${C.muted}">${fy(v)}</text>`;
  s += `<line x1="${L}" y1="${T + PH}" x2="${L + PW}" y2="${T + PH}" stroke="${C.ink}" stroke-width="1.5"/><line x1="${L}" y1="${T}" x2="${L}" y2="${T + PH}" stroke="${C.ink}" stroke-width="1.5"/>`;
  if (o.xl) s += `<text class="lbl" x="${L + PW}" y="${T + PH + 38}" text-anchor="end" fill="${C.ink}">${o.xl}</text>`;
  if (o.yl) s += `<text class="lbl" x="${L - 8}" y="${T - 2}" text-anchor="end" fill="${C.ink}">${o.yl}</text>`;
  const base = s;
  const poly = pts => 'M' + pts.map(([a, b]) => `${X(a).toFixed(1)} ${Y(b).toFixed(1)}`).join('L') + 'Z';
  const seg = (a, b, c, d, col, w = 2.5, ex = '') => `<line x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${ex}/>`;
  const dot = (a, b, col, r = 5.5, sk = '#fff') => `<circle cx="${X(a)}" cy="${Y(b)}" r="${r}" fill="${col}" stroke="${sk}" stroke-width="2"/>`;
  const curve = (f, a, b, col, w = 2.6, ex = '', n = 80) => { let d = ''; for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); } return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" ${ex}/>`; };
  const draw = (inner, over = '') => { svg.innerHTML = base + `<g clip-path="url(#${svg.id}cl)">${inner}</g>${over}`; };
  const toData = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse()); return { x: (o.x0 || 0) + (q.x - L) / PW * (o.x1 - (o.x0 || 0)), y: (o.y0 || 0) + (1 - (q.y - T) / PH) * (o.y1 - (o.y0 || 0)) }; };
  return { X, Y, L, T, PW, PH, W, H, poly, seg, dot, curve, draw, toData, arrow: `url(#${svg.id}ar)` };
}
function drag(svg, F, cb) {
  let on = false;
  svg.addEventListener('pointerdown', e => { on = true; svg.setPointerCapture(e.pointerId); cb(F.toData(e)); e.preventDefault(); });
  svg.addEventListener('pointermove', e => { if (on) cb(F.toData(e)); });
  const off = () => on = false; svg.addEventListener('pointerup', off); svg.addEventListener('pointercancel', off);
}

/* ---------- Exercices tirés au hasard ----------
   gen() renvoie { enonce, q: [{ label, ans, tol? }], sol } */
function lireNombre(s) {
  s = String(s).trim().replace(/[\s  ]/g, '').replace('−', '-').replace(/,/g, '.').replace(/%$/, '');
  if (!s) return NaN;
  const m = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (m) return +m[1] / +m[2];
  return /^-?\d*\.?\d+$/.test(s) ? +s : NaN;
}
function Exercice(sel, gen, o = {}) {
  const root = typeof sel === 'string' ? $(sel) : sel; if (!root) return;
  let ex, k = 0, reussis = 0;
  const uid = 'x' + Math.random().toString(36).slice(2, 7);
  root.innerHTML = (o.bare ? '' : `<h2>S'entraîner</h2>
    <p class="intro">${o.intro || 'Un exercice avec de nouvelles valeurs à chaque tirage. Donne tes réponses arrondies à deux décimales ; une fraction comme 10/3 est acceptée.'}</p>`) + `
    <div class="card pad exo">
      <div class="exo-head"><span class="exo-n"></span><button class="btn ghost" data-a="new">${o.bare ? 'Nouvelles valeurs' : 'Nouvel exercice'}</button></div>
      <div class="exo-enonce"></div><ol class="exo-q"></ol>
      <div class="row"><button class="btn" data-a="check">Vérifier</button><button class="btn ghost" data-a="sol">Voir la correction</button></div>
      <div class="fbk" hidden aria-live="polite"></div>
      <div class="exo-sol" hidden></div>
    </div>`;
  const q = s => root.querySelector(s);
  function draw() {
    ex = gen(); k++;
    q('.exo-n').textContent = o.titre || (`Exercice n° ${k}` + (reussis ? ` · ${reussis} réussi${reussis > 1 ? 's' : ''} sans faute` : ''));
    q('.exo-enonce').innerHTML = ex.enonce;
    q('.exo-q').innerHTML = ex.q.map((x, i) => `<li><label for="${uid}${i}">${x.label}</label><input id="${uid}${i}" inputmode="decimal" autocomplete="off"><span class="mk" aria-live="polite"></span><small class="dg" hidden></small></li>`).join('');
    q('.fbk').hidden = true; const so = q('.exo-sol'); so.hidden = true;
    so.innerHTML = `<h4>Correction</h4>${ex.sol}` + (ex.graph ? `<figure class="exo-fig"><svg class="ch" id="${uid}g${k}" aria-label="Graphique de l'exercice"></svg>${ex.legende ? `<figcaption>${ex.legende}</figcaption>` : ''}</figure>` : '');
    if (ex.graph) ex.graph(so.querySelector('svg'));
    ex.done = false;
    q('[data-a="sol"]').textContent = 'Voir la correction';
  }
  function check() {
    let n = 0, vide = 0;
    ex.q.forEach((x, i) => {
      const li = q('.exo-q').children[i], v = lireNombre(li.querySelector('input').value);
      li.classList.remove('ok', 'ko'); const mk = li.querySelector('.mk'), dg = li.querySelector('.dg'); dg.hidden = true;
      if (isNaN(v)) { vide++; mk.textContent = ''; return; }
      const near = (u, w) => Math.abs(u - w) <= (x.tol != null ? x.tol : Math.max(0.011, 0.002 * Math.abs(w)));
      const ok = near(v, x.ans);
      li.classList.add(ok ? 'ok' : 'ko'); mk.textContent = ok ? '✓' : '✗'; if (ok) n++;
      if (!ok && x.diag) { const d = x.diag.find(([w]) => isFinite(w) && !near(w, x.ans) && near(v, w)); if (d) { dg.innerHTML = d[1]; dg.hidden = false; } }
    });
    const f = q('.fbk'); f.hidden = false;
    const tot = ex.q.length;
    if (n === tot) {
      f.className = 'fbk ok'; f.innerHTML = '<b>Tout est juste.</b> ' + (ex.graph ? 'Affiche la correction pour voir le graphique de l\'exercice, ou tire-en un nouveau.' : 'Tire un nouvel exercice pour t\'entraîner encore.');
      if (!ex.done) { ex.done = true; reussis++; if (!o.titre) q('.exo-n').textContent = `Exercice n° ${k} · ${reussis} réussi${reussis > 1 ? 's' : ''} sans faute`; if (o.onWin) o.onWin(); }
      pop(f);
    } else {
      f.className = 'fbk ko';
      f.innerHTML = `<b>${n} bonne${n > 1 ? 's' : ''} réponse${n > 1 ? 's' : ''} sur ${tot}.</b> ` + (vide ? `${vide} question${vide > 1 ? 's' : ''} sans réponse. ` : '') + 'Corrige les cases en rouge, ou affiche la correction.';
    }
  }
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'new') draw();
    if (b.dataset.a === 'check') check();
    if (b.dataset.a === 'sol') { const s = q('.exo-sol'); s.hidden = !s.hidden; b.textContent = s.hidden ? 'Voir la correction' : 'Masquer la correction'; }
  });
  root.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('.exo-q input')) check(); });
  draw();
  return { get ex() { return ex; }, draw };
}
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const m = s => `<span class="m">${s}</span>`;
