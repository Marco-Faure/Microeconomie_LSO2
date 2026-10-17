/* Outils interactifs, microéconomie LSO2 — © 2026 Marc-Antoine Faure Colonna d'Istria
   Générateurs d'exercices à valeurs aléatoires, partagés par les outils et par le générateur d'exercices.
   Chaque générateur renvoie { enonce, q: [{ label, ans, tol? }], sol }. */

const GEN = {};

/* ---------- Graphiques des corrections ---------- */
const niceStep = mx => { const r = mx / 6, p = 10 ** Math.floor(Math.log10(r)); return [1, 2, 2.5, 5, 10].find(k => k * p >= r) * p; };
function grBase(svg, o) {
  const sx = niceStep(o.x1), sy = niceStep(o.y1);
  const F = Frame(svg, { x1: Math.ceil(o.x1 / sx - 1e-9) * sx, y1: Math.ceil(o.y1 / sy - 1e-9) * sy, dx: sx, dy: sy, xl: o.xl || 'q', yl: o.yl || 'p', H: 360, fx: v => fr(v, 2), fy: v => fr(v, 2) });
  const [g, t] = o.draw(F); F.draw(g, t);
}
const zone = (F, pts, col, op) => `<path d="${F.poly(pts)}" fill="${col}" fill-opacity="${op}"/>`;
const etq = (F, x, y, txt, col, anchor = 'start', dx = 7, dy = -7) => `<text class="lbl" x="${F.X(x) + dx}" y="${F.Y(y) + dy}" text-anchor="${anchor}" fill="${col}">${txt}</text>`;
const BIG = 1e5;

/* ---------- Surplus et prix plafond ---------- */
GEN.surplus = { ch: 1, titre: 'Surplus et prix plafond', gen: () => {
  const k1 = v => v === 1 ? '' : v;
  let a, b, c, d, ps, qs, k;
  for (;;) {
    c = rnd(1, 4); b = rnd(1, 4); ps = rnd(15, 40); if (c * ps < 40) continue; d = rnd(10, c * ps - 20); qs = c * ps - d; a = qs + b * ps;
    const kmax = Math.min(Math.floor(ps - d / c) - 1, Math.floor((qs - 1) / c), 12);
    if (kmax >= 2) { k = rnd(2, kmax); break; }
  }
  const pmax = a / b, pmin = d / c, SC = qs * qs / (2 * b), SP = qs * qs / (2 * c);
  const pb = ps - k, qb = qs - c * k, pq = (a - qb) / b, DW = 0.5 * (pq - pb) * (qs - qb);
  return {
    enonce: `<p>Sur un marché concurrentiel, la demande est ${m(`D(p) = ${a} − ${k1(b)}p`)} et l'offre ${m(`O(p) = ${k1(c)}p − ${d}`)}.</p><p>L'État fixe ensuite un prix plafond ${m(`p̄ = ${pb}`)}.</p>`,
    q: [
      { label: `Prix d'équilibre ${m('p*')}`, ans: ps },
      { label: `Quantité d'équilibre ${m('q*')}`, ans: qs },
      { label: 'Surplus du consommateur à l\'équilibre', ans: SC, diag: [[2 * SC, 'Tu as oublié de diviser par 2 : le surplus est l\'aire d\'un triangle.'], [SP, 'C\'est le surplus du producteur. Celui du consommateur est le triangle au-dessus du prix.']] },
      { label: 'Surplus du producteur à l\'équilibre', ans: SP, diag: [[2 * SP, 'Tu as oublié de diviser par 2 : le surplus est l\'aire d\'un triangle.'], [SC, 'C\'est le surplus du consommateur. Celui du producteur est le triangle sous le prix.']] },
      { label: 'Quantité échangée avec le prix plafond', ans: qb, diag: [[a - b * pb, 'C\'est la quantité demandée. Les producteurs n\'offrent que O(p̄) : on échange la plus petite des deux.']] },
      { label: 'Perte sèche due au prix plafond', ans: DW, diag: [[2 * DW, 'Tu as oublié de diviser par 2.'], [0.5 * (ps - pb) * (qs - qb), 'Il manque une partie : la hauteur du triangle va de l\'offre à la demande, pas du prix plafond au prix d\'équilibre.'], [0.5 * (pq - ps) * (qs - qb), 'Il manque une partie : la hauteur du triangle va de l\'offre à la demande, pas du prix d\'équilibre à la demande.']] }],
    graph: svg => grBase(svg, { x1: a, y1: pmax * 1.06, draw: F => {
      const pO = q => (q + d) / c, X1 = F.X(0);
      let g = zone(F, [[0, pmax], [qb, pq], [qb, pb], [0, pb]], C.navy, .2) + zone(F, [[0, pb], [qb, pb], [qb, pO(qb)], [0, pmin]], C.forest, .24) + zone(F, [[qb, pq], [qs, ps], [qb, pO(qb)]], C.brick, .32);
      g += F.seg(0, pmax, a, 0, C.brick, 2.6) + F.seg(0, pmin, c * BIG - d, BIG, C.navy, 2.6) + F.seg(0, pb, BIG, pb, C.ink, 1.5, 'stroke-dasharray="6 5"');
      return [g, F.dot(qs, ps, '#fff', 5, C.muted) + F.dot(qb, pb, C.ink) + etq(F, 0, pb, 'p̄', C.ink, 'start', 6, 18) + etq(F, a * 0.86, pmax * 0.14, 'D', C.brick, 'start', 6, -8) + etq(F, qs, ps, 'E', C.muted, 'start', 8, 4)];
    } }),
    legende: 'Avec le prix plafond : surplus du consommateur en bleu, surplus du producteur en vert, perte sèche en rouge. E est l\'équilibre sans intervention.',
    sol: `<ol>
      <li>À l'équilibre, ${m(`${a} − ${k1(b)}p = ${k1(c)}p − ${d}`)}, d'où ${m(`p* = ${ps}`)} et ${m(`q* = ${qs}`)}.</li>
      <li>La demande s'annule en ${m(`p<sub>max</sub> = ${a}/${b} = ${fr(pmax)}`)}, l'offre en ${m(`p<sub>min</sub> = ${d}/${c} = ${fr(pmin)}`)}.</li>
      <li>${m(`S<sub>cons</sub> = (p<sub>max</sub> − p*) × q* / 2 = (${fr(pmax)} − ${ps}) × ${qs} / 2 = ${fr(SC)}`)}</li>
      <li>${m(`S<sub>prod</sub> = (p* − p<sub>min</sub>) × q* / 2 = (${ps} − ${fr(pmin)}) × ${qs} / 2 = ${fr(SP)}`)}</li>
      <li>Au prix ${pb}, les producteurs n'offrent que ${m(`O(${pb}) = ${qb}`)} : c'est la quantité échangée, la demande ${m(`D(${pb}) = ${a - b * pb}`)} n'est pas servie en entier.</li>
      <li>Pour ${qb} unités, les acheteurs paieraient jusqu'à ${m(`(${a} − ${qb}) / ${b} = ${fr(pq)}`)}. Perte sèche : ${m(`(${fr(pq)} − ${pb}) × (${qs} − ${qb}) / 2 = ${fr(DW)}`)}.</li></ol>`
  };
} };

/* ---------- Incidence d'une taxe unitaire ---------- */
GEN.fiscalite = { ch: 1, titre: 'Incidence d\'une taxe unitaire', gen: () => {
  const k1 = v => v === 1 ? '' : v;
  let a, b, c, d, ps, qs, n, t, pp, pc, qt;
  for (;;) {
    c = rnd(1, 4); b = rnd(1, 4); ps = rnd(15, 40); if (c * ps < 40) continue; d = rnd(10, c * ps - 20); qs = c * ps - d; a = qs + b * ps;
    n = rnd(1, 4); t = n * (b + c); pp = ps - b * n; pc = pp + t; qt = qs - b * c * n;
    if (qt >= 5 && pp > d / c + 1) break;
  }
  const RF = t * qt, DW = 0.5 * t * (qs - qt), part = 100 * c / (b + c);
  return {
    enonce: `<p>Sur un marché concurrentiel, la demande est ${m(`D(p) = ${a} − ${k1(b)}p`)} et l'offre ${m(`O(p) = ${k1(c)}p − ${d}`)}. Sans taxe, l'équilibre est ${m(`p* = ${ps}`)}, ${m(`q* = ${qs}`)}.</p><p>L'État instaure une taxe unitaire ${m(`t = ${t}`)}, versée par les producteurs.</p>`,
    q: [
      { label: `Prix reçu par les producteurs ${m('p<sub>p</sub>')}`, ans: pp, diag: [[pc, 'C\'est le prix payé par les consommateurs : les producteurs reçoivent ce prix moins la taxe.'], [ps - t, 'La taxe ne retombe pas entièrement sur les producteurs : résous O(p<sub>p</sub>) = D(p<sub>p</sub> + t).']] },
      { label: `Prix payé par les consommateurs ${m('p<sub>c</sub>')}`, ans: pc, diag: [[pp, 'C\'est le prix reçu par les producteurs.'], [ps + t, 'La taxe ne retombe pas entièrement sur les consommateurs : résous O(p<sub>p</sub>) = D(p<sub>p</sub> + t).']] },
      { label: `Quantité échangée ${m('q<sub>t</sub>')}`, ans: qt },
      { label: 'Recette fiscale', ans: RF, diag: [[t * qs, 'La recette se calcule avec la quantité échangée après la taxe, q<sub>t</sub>, pas q*.']] },
      { label: 'Perte sèche', ans: DW, diag: [[2 * DW, 'Tu as oublié de diviser par 2.'], [t * qt, 'C\'est la recette fiscale. La perte sèche est le triangle entre q<sub>t</sub> et q*.']] },
      { label: 'Part de la taxe supportée par les consommateurs, en %', ans: part, tol: 0.6, diag: [[100 - part, 'C\'est la part des producteurs. Celle des consommateurs vaut (p<sub>c</sub> − p*) / t.']] }],
    graph: svg => grBase(svg, { x1: a, y1: a / b * 1.06, draw: F => {
      const pmax = a / b, pmin = d / c;
      let g = zone(F, [[0, pmax], [qt, pc], [0, pc]], C.navy, .2) + zone(F, [[0, pc], [qt, pc], [qt, pp], [0, pp]], C.gray, .35) + zone(F, [[0, pp], [qt, pp], [0, pmin]], C.forest, .24) + zone(F, [[qt, pc], [qs, ps], [qt, pp]], C.brick, .32);
      g += F.seg(0, pmax, a, 0, C.brick, 2.6) + F.seg(0, pmin, c * BIG - d, BIG, C.navy, 2.6) + F.seg(0, pmin + t, c * BIG - d, BIG + t, C.navy, 1.8, 'stroke-dasharray="6 5"');
      return [g, F.dot(qs, ps, '#fff', 5, C.muted) + F.dot(qt, pc, C.ink) + F.dot(qt, pp, C.ink) + etq(F, 0, pc, 'p<tspan dy="4" font-size="12">c</tspan>', C.ink, 'start', 6, -6) + etq(F, 0, pp, 'p<tspan dy="4" font-size="12">p</tspan>', C.ink, 'start', 6, 20) + etq(F, a * 0.86, pmax * 0.14, 'D', C.brick, 'start', 6, -8)];
    } }),
    legende: 'Surplus du consommateur en bleu, recette fiscale en gris, surplus du producteur en vert, perte sèche en rouge. Les pointillés montrent l\'offre décalée de la taxe.',
    sol: `<ol>
      <li>On pose ${m(`p<sub>c</sub> = p<sub>p</sub> + ${t}`)} et ${m(`O(p<sub>p</sub>) = D(p<sub>p</sub> + ${t})`)} : ${m(`${k1(c)}p<sub>p</sub> − ${d} = ${a} − ${k1(b)}(p<sub>p</sub> + ${t})`)}.</li>
      <li>D'où ${m(`p<sub>p</sub> = (${a} + ${d} − ${b * t}) / ${b + c} = ${pp}`)} et ${m(`p<sub>c</sub> = ${pp} + ${t} = ${pc}`)}.</li>
      <li>${m(`q<sub>t</sub> = O(${pp}) = ${qt}`)}. Vérification : ${m(`D(${pc}) = ${a - b * pc}`)}.</li>
      <li>${m(`RF = t × q<sub>t</sub> = ${t} × ${qt} = ${RF}`)}, calculée avec ${m('q<sub>t</sub>')} et non ${m('q*')}.</li>
      <li>${m(`PS = t × (q* − q<sub>t</sub>) / 2 = ${t} × ${qs - qt} / 2 = ${fr(DW)}`)}</li>
      <li>Les consommateurs paient ${pc - ps} de plus qu'avant, sur une taxe de ${t} : ${m(`${pc - ps} / ${t} = ${fr(part, 1)} %`)}. C'est ${m(`${c} / (${b} + ${c})`)} : le côté le moins élastique supporte la plus grande part.</li></ol>`
  };
} };

/* ---------- Taxe pigouvienne ---------- */
GEN.pigou = { ch: 2, titre: 'Externalité et taxe pigouvienne', gen: () => {
  const k1 = v => v === 1 ? '' : v;
  const gcd = (x, y) => y ? gcd(y, x % y) : x;
  const al = pick([1, 2]), be = pick([1, 2]), ga = pick([1, 2, 3]), s1 = al + be, s2 = s1 + ga, L = s1 * s2 / gcd(s1, s2);
  const kmin = Math.ceil(40 / L), kmax = Math.max(kmin, Math.floor(240 / L)), A = L * rnd(kmin, kmax);
  const qs = A / s1, ps = A - al * qs, qb = A / s2, pb = A - al * qb, t = ga * qb, DW = 0.5 * (qs - qb) * ga * qs, RF = t * qb;
  return {
    enonce: `<p>La demande inverse d'un bien est ${m(`p = ${A} − ${k1(al)}q`)}. Le coût marginal privé des producteurs est ${m(`Cm<sup>p</sup> = ${k1(be)}q`)}, et la production impose aux riverains un coût externe marginal ${m(`Cm<sup>e</sup> = ${k1(ga)}q`)}.</p>`,
    q: [
      { label: `Quantité d'équilibre privé ${m('q*')}`, ans: qs },
      { label: `Quantité optimale ${m('q̄')}`, ans: qb, diag: [[A / (al + be - ga) > 0 ? A / (al + be - ga) : -1, 'Le coût externe s\'ajoute au coût privé : Cm<sup>s</sup> = Cm<sup>p</sup> + Cm<sup>e</sup>.']] },
      { label: `Prix à l'optimum ${m('p̄')}`, ans: pb },
      { label: `Taxe pigouvienne ${m('t')}`, ans: t, diag: [[ga * qs, 'Tu as évalué le coût externe en q*. La taxe se calcule à l\'optimum : t = Cm<sup>e</sup>(q̄).'], [ga, 'La taxe est le coût externe marginal évalué en q̄, pas son coefficient.']] },
      { label: 'Perte sèche sans intervention', ans: DW, diag: [[2 * DW, 'Tu as oublié de diviser par 2.']] },
      { label: 'Recette fiscale de la taxe pigouvienne', ans: RF, diag: [[t * qs, 'La recette se calcule avec la quantité produite après la taxe, q̄, pas q*.']] }],
    graph: svg => grBase(svg, { x1: A / al, y1: Math.max(A, (be + ga) * qs) * 1.06, draw: F => {
      let g = zone(F, [[0, pb], [qb, pb], [qb, pb - t], [0, pb - t]], C.navy, .16) + zone(F, [[qb, pb], [qs, (be + ga) * qs], [qs, ps]], C.brick, .32);
      g += F.seg(0, A, A / al, 0, C.brick, 2.6) + F.seg(0, 0, BIG, be * BIG, C.gray, 2.4) + F.seg(0, 0, BIG, (be + ga) * BIG, C.navy, 2.6) + F.seg(0, t, BIG, be * BIG + t, C.ink, 1.6, 'stroke-dasharray="6 5"');
      return [g, F.dot(qs, ps, '#fff', 5, C.muted) + F.dot(qb, pb, C.forest) + etq(F, qs, ps, 'q*', C.muted, 'start', 8, 16) + etq(F, qb, pb, 'q̄', C.forest, 'end', -8, -6)];
    } }),
    legende: 'Demande en rouge, coût marginal privé en gris, coût marginal social en bleu, coût privé augmenté de la taxe en pointillés. Le triangle rouge est la perte sèche sans intervention ; le rectangle bleu, la recette de la taxe.',
    sol: `<ol>
      <li>Équilibre privé, ${m('p = Cm<sup>p</sup>')} : ${m(`${A} − ${k1(al)}q = ${k1(be)}q`)}, d'où ${m(`q* = ${fr(qs)}`)} et ${m(`p* = ${fr(ps)}`)}.</li>
      <li>Optimum, ${m('p = Cm<sup>s</sup> = Cm<sup>p</sup> + Cm<sup>e</sup> = ' + (be + ga) + 'q')} : ${m(`${A} − ${k1(al)}q = ${be + ga}q`)}, d'où ${m(`q̄ = ${fr(qb)}`)} et ${m(`p̄ = ${fr(pb)}`)}.</li>
      <li>La taxe vaut le coût externe marginal évalué à l'optimum : ${m(`t = Cm<sup>e</sup>(q̄) = ${k1(ga)}×${fr(qb)} = ${fr(t)}`)}.</li>
      <li>Sans intervention, chaque unité entre ${m('q̄')} et ${m('q*')} coûte plus à la société qu'elle ne rapporte. En ${m('q*')}, l'écart vaut ${m(`Cm<sup>s</sup>(q*) − p* = ${fr((be + ga) * qs)} − ${fr(ps)} = ${fr(ga * qs)}`)}. Perte sèche : ${m(`${fr(ga * qs)} × (${fr(qs)} − ${fr(qb)}) / 2 = ${fr(DW)}`)}.</li>
      <li>${m(`RF = t × q̄ = ${fr(t)} × ${fr(qb)} = ${fr(RF)}`)}</li></ol>`
  };
} };

/* ---------- Fusion et profit joint ---------- */
GEN.fusion = { ch: 2, titre: 'Fusion et partage du profit joint', gen: () => {
  const c = pick([0.25, 0.25, 0.125]);
  const A = c === 0.25 ? 24 * rnd(5, 15) : 42 * rnd(3, 8);
  const k = 1 + 2 * c, ps = A / 3, p1 = ps * ps / 2, p2 = ps * ps * (0.5 - c);
  const pb = A / (2 + 1 / k), q1 = pb / k, q2 = pb, PJ = pb * (q1 + q2) - 0.5 * q1 * q1 - 0.5 * q2 * q2 - c * q1 * q1;
  const amin = p1 / PJ, amax = 1 - p2 / PJ;
  return {
    enonce: `<p>Deux firmes en concurrence pure et parfaite ont pour coûts ${m(`CT<sub>1</sub> = 0,5q<sub>1</sub><sup>2</sup>`)} et ${m(`CT<sub>2</sub> = 0,5q<sub>2</sub><sup>2</sup> + ${fr(c, 3)}q<sub>1</sub><sup>2</sup>`)}. La demande inverse du marché est ${m(`p = ${A} − q`)}.</p><p>Les firmes fusionnent ; la firme 1 reçoit la part ${m('α')} du profit joint.</p>`,
    q: [
      { label: `Prix de l'équilibre privé ${m('p*')}`, ans: ps },
      { label: `Profit de la firme 2 à l'équilibre privé ${m('π<sub>2</sub>*')}`, ans: p2 },
      { label: `Prix après la fusion ${m('p̄')}`, ans: pb, diag: [[ps, 'C\'est le prix de l\'équilibre privé. Après la fusion, la firme 1 tient compte du dommage et produit moins : le prix monte.']] },
      { label: `Production de la firme 1 après la fusion ${m('q̄<sub>1</sub>')}`, ans: q1 },
      { label: `Profit joint ${m('Π̄<sub>J</sub>')}`, ans: PJ, tol: Math.max(0.5, 0.001 * PJ), diag: [[p1 + p2, 'C\'est la somme des profits de l\'équilibre privé. Recalcule le profit joint avec le nouveau plan de production.']] },
      { label: `Part minimale acceptée par la firme 1, ${m('α<sub>min</sub>')}`, ans: amin, tol: 0.006, diag: [[p2 / PJ, 'C\'est la part minimale de la firme 2. Pour la firme 1 : π<sub>1</sub>* / Π̄<sub>J</sub>.'], [p1 / (p1 + p2), 'Il faut diviser par le profit joint après la fusion, pas par la somme des profits privés.']] },
      { label: `Part maximale cédée par la firme 2, ${m('α<sub>max</sub>')}`, ans: amax, tol: 0.006, diag: [[p2 / PJ, 'C\'est la part minimale de la firme 2. La part maximale de la firme 1 vaut 1 − π<sub>2</sub>* / Π̄<sub>J</sub>.']] }],
    graph: svg => grBase(svg, { x1: 1, y1: PJ * 1.08, xl: 'α', yl: 'π', draw: F => {
      let g = `<rect x="${F.X(amin)}" y="${F.Y(PJ * 1.08)}" width="${F.X(amax) - F.X(amin)}" height="${F.Y(0) - F.Y(PJ * 1.08)}" fill="${C.forest}" fill-opacity=".18"/>`;
      g += F.seg(0, p1, 1, p1, C.navy, 1.5, 'stroke-dasharray="6 5"') + F.seg(0, p2, 1, p2, C.brick, 1.5, 'stroke-dasharray="6 5"') + F.seg(0, 0, 1, PJ, C.navy, 2.8) + F.seg(0, PJ, 1, 0, C.brick, 2.8);
      return [g, F.dot(amin, p1, C.navy) + F.dot(amax, p2, C.brick) + etq(F, amin, 0, 'α<tspan dy="4" font-size="12">min</tspan>', C.ink, 'middle', 0, -8) + etq(F, amax, 0, 'α<tspan dy="4" font-size="12">max</tspan>', C.ink, 'middle', 0, -8)];
    } }),
    legende: 'Part de la firme 1 en bleu, part de la firme 2 en rouge, profits de l\'équilibre privé en pointillés. La zone verte est la zone d\'accord.',
    sol: `<ol>
      <li>Équilibre privé : chaque firme pose ${m('p = Cm<sup>p</sup>')}, soit ${m('q<sub>1</sub> = q<sub>2</sub> = p')}. Offre ${m('2p = ' + A + ' − p')}, d'où ${m(`p* = ${fr(ps)}`)}, ${m(`q<sub>1</sub>* = q<sub>2</sub>* = ${fr(ps)}`)}.</li>
      <li>${m(`π<sub>1</sub>* = ${fr(ps)}² / 2 = ${fr(p1)}`)} et ${m(`π<sub>2</sub>* = ${fr(ps)}² / 2 − ${fr(c, 3)} × ${fr(ps)}² = ${fr(p2)}`)}.</li>
      <li>Après la fusion : ${m(`p = Cm<sub>1</sub><sup>p</sup> + Cm<sup>e</sup> = ${fr(k, 3)}q<sub>1</sub>`)} et ${m('p = q<sub>2</sub>')}. Offre ${m(`q = p/${fr(k, 3)} + p = ${A} − p`)}, d'où ${m(`p̄ = ${fr(pb)}`)}, ${m(`q̄<sub>1</sub> = ${fr(q1)}`)}, ${m(`q̄<sub>2</sub> = ${fr(q2)}`)}.</li>
      <li>${m(`Π̄<sub>J</sub> = ${fr(pb)} × ${fr(q1 + q2)} − 0,5 × ${fr(q1)}² − 0,5 × ${fr(q2)}² − ${fr(c, 3)} × ${fr(q1)}² = ${fr(PJ)}`)}, contre ${fr(p1 + p2)} avant la fusion.</li>
      <li>${m(`α ≥ π<sub>1</sub>* / Π̄<sub>J</sub> = ${fr(amin, 3)}`)} et ${m(`α ≤ 1 − π<sub>2</sub>* / Π̄<sub>J</sub> = ${fr(amax, 3)}`)}.</li></ol>`
  };
} };

/* ---------- Prix plancher ---------- */
GEN.plancher = { ch: 1, titre: 'Surplus et prix plancher', gen: () => {
  const k1 = v => v === 1 ? '' : v;
  let a, b, c, d, ps, qs, k;
  for (;;) {
    c = rnd(1, 4); b = rnd(1, 4); ps = rnd(15, 40); if (c * ps < 40) continue; d = rnd(10, c * ps - 20); qs = c * ps - d; a = qs + b * ps;
    const kmax = Math.min(Math.floor(a / b - ps) - 1, Math.floor((qs - 5) / b), 12);
    if (kmax >= 2) { k = rnd(2, kmax); break; }
  }
  const pmin = d / c, pf = ps + k, q = qs - b * k, ex = (c * pf - d) - q, po = (q + d) / c;
  const SP = q * (pf - pmin) - q * q / (2 * c), DW = 0.5 * (pf - po) * (qs - q);
  return {
    enonce: `<p>Sur un marché concurrentiel, la demande est ${m(`D(p) = ${a} − ${k1(b)}p`)} et l'offre ${m(`O(p) = ${k1(c)}p − ${d}`)}.</p><p>L'État fixe un prix plancher ${m(`p̲ = ${pf}`)}. On suppose que ce sont les producteurs les plus efficaces qui vendent.</p>`,
    q: [
      { label: `Prix d'équilibre ${m('p*')}`, ans: ps },
      { label: `Quantité d'équilibre ${m('q*')}`, ans: qs },
      { label: 'Quantité échangée avec le prix plancher', ans: q, diag: [[c * pf - d, 'C\'est la quantité offerte. Les consommateurs n\'achètent que D(p̲) : on échange la plus petite des deux.']] },
      { label: 'Excédent d\'offre', ans: ex, diag: [[-ex, 'Attention au signe : l\'excédent est l\'offre moins la demande.']] },
      { label: 'Surplus du producteur avec le prix plancher', ans: SP },
      { label: 'Perte sèche', ans: DW, diag: [[2 * DW, 'Tu as oublié de diviser par 2.'], [0.5 * (pf - ps) * (qs - q), 'Il manque une partie : la hauteur du triangle va de l\'offre à la demande.']] }],
    graph: svg => grBase(svg, { x1: a, y1: a / b * 1.06, draw: F => {
      const pmax = a / b;
      let g = zone(F, [[0, pmax], [q, pf], [0, pf]], C.navy, .2) + zone(F, [[0, pf], [q, pf], [q, po], [0, pmin]], C.forest, .24) + zone(F, [[q, pf], [qs, ps], [q, po]], C.brick, .32);
      g += F.seg(0, pmax, a, 0, C.brick, 2.6) + F.seg(0, pmin, c * BIG - d, BIG, C.navy, 2.6) + F.seg(0, pf, BIG, pf, C.ink, 1.5, 'stroke-dasharray="6 5"');
      return [g, F.dot(qs, ps, '#fff', 5, C.muted) + F.dot(q, pf, C.ink) + etq(F, 0, pf, 'p̲', C.ink) + etq(F, a * 0.86, pmax * 0.14, 'D', C.brick, 'start', 6, -8) + etq(F, qs, ps, 'E', C.muted, 'start', 8, 16)];
    } }),
    legende: 'Avec le prix plancher : surplus du consommateur en bleu, surplus du producteur en vert, perte sèche en rouge. E est l\'équilibre sans intervention.',
    sol: `<ol>
      <li>À l'équilibre, ${m(`${a} − ${k1(b)}p = ${k1(c)}p − ${d}`)}, d'où ${m(`p* = ${ps}`)} et ${m(`q* = ${qs}`)}.</li>
      <li>Au prix ${pf}, les consommateurs n'achètent que ${m(`D(${pf}) = ${q}`)} : c'est la quantité échangée.</li>
      <li>Les producteurs voudraient vendre ${m(`O(${pf}) = ${c * pf - d}`)} : l'excédent d'offre vaut ${m(`${c * pf - d} − ${q} = ${ex}`)}.</li>
      <li>Les ${q} unités sont vendues au prix ${pf} par les producteurs les plus efficaces. L'offre s'annule en ${m(`p<sub>min</sub> = ${fr(pmin)}`)}, et pour ${q} unités le coût marginal vaut ${m(`(${q} + ${d}) / ${c} = ${fr(po)}`)}. ${m(`S<sub>prod</sub> = ${q} × (${pf} − ${fr(pmin)}) − ${q} × (${fr(po)} − ${fr(pmin)}) / 2 = ${fr(SP)}`)}.</li>
      <li>Perte sèche : ${m(`(${pf} − ${fr(po)}) × (${qs} − ${q}) / 2 = ${fr(DW)}`)}.</li></ol>`
  };
} };

/* ---------- Équilibre général d'une économie d'échange ---------- */
GEN.edgeworth = { ch: 1, titre: 'Équilibre général d\'échange', gen: () => {
  const Q = [0.25, 0.5, 0.75], nice = v => Math.abs(v * 20 - Math.round(v * 20)) < 1e-9;
  let a, b, X, Y, x1, y1, x2, y2, p, xA, yA;
  for (let t = 0; t < 20000; t++) {
    a = pick(Q); b = pick(Q); if (a === b) continue;
    X = rnd(6, 12); Y = rnd(6, 12); x1 = rnd(1, X - 1); y1 = rnd(1, Y - 1); x2 = X - x1; y2 = Y - y1;
    p = (a * y1 + b * y2) / ((1 - a) * x1 + (1 - b) * x2); xA = a * (p * x1 + y1) / p; yA = (1 - a) * (p * x1 + y1);
    if (nice(p) && nice(xA) && nice(yA)) break;
  }
  const RA = p * x1 + y1, RB = p * x2 + y2, tms = a / (1 - a) * yA / xA, e = v => fr(v, 2);
  return {
    enonce: `<p>Deux agents se partagent deux biens. Leurs utilités sont ${m(`U<sub>A</sub> = x<sup>${e(a)}</sup>y<sup>${e(1 - a)}</sup>`)} et ${m(`U<sub>B</sub> = x<sup>${e(b)}</sup>y<sup>${e(1 - b)}</sup>`)}. Leurs dotations initiales sont ${m(`ω<sub>A</sub> = (${x1} ; ${y1})`)} et ${m(`ω<sub>B</sub> = (${x2} ; ${y2})`)}.</p><p>Le bien 2 sert de numéraire : ${m('p<sub>2</sub> = 1')}, et on note ${m('p = p<sub>1</sub>/p<sub>2</sub>')}.</p>`,
    q: [
      { label: `Prix relatif d'équilibre ${m('p')}`, ans: p, diag: [[1 / p, 'C\'est l\'inverse : p = p<sub>1</sub>/p<sub>2</sub>, avec le bien 2 comme numéraire.']] },
      { label: `Quantité de bien 1 consommée par A, ${m('x<sub>A</sub>')}`, ans: xA, diag: [[a * RA, 'Tu as oublié de diviser par le prix du bien 1 : x<sub>A</sub> = a × R<sub>A</sub> / p.'], [x1, 'C\'est la dotation de A : à l\'équilibre, A échange.']] },
      { label: `Quantité de bien 2 consommée par A, ${m('y<sub>A</sub>')}`, ans: yA },
      { label: `Quantité de bien 1 consommée par B, ${m('x<sub>B</sub>')}`, ans: X - xA },
      { label: `Quantité de bien 2 consommée par B, ${m('y<sub>B</sub>')}`, ans: Y - yA },
      { label: `${m('TMS<sup>A</sup><sub>2→1</sub>')} à l'équilibre`, ans: tms, diag: [[1 / tms, 'C\'est l\'inverse : TMS<sub>2→1</sub> = Um<sub>1</sub>/Um<sub>2</sub>, égal au rapport inverse des prix p<sub>1</sub>/p<sub>2</sub>.']] }],
    graph: svg => grBase(svg, { x1: X, y1: Y, xl: 'x', yl: 'y', draw: F => {
      const kA = a / (1 - a), kB = b / (1 - b), cc = x => kB * Y * x / (kA * X + (kB - kA) * x);
      const uA = Math.pow(xA, a) * Math.pow(yA, 1 - a), vB = Math.pow(X - xA, b) * Math.pow(Y - yA, 1 - b);
      const icA = x => Math.pow(uA / Math.pow(x, a), 1 / (1 - a)), icB = x => Y - Math.pow(vB / Math.pow(X - x, b), 1 / (1 - b));
      let g = F.curve(cc, 0, X, C.ink, 1.6, 'stroke-dasharray="6 5"') + F.seg(0, y1 + p * x1, BIG, y1 + p * x1 - p * BIG, C.ink, 1.6);
      g += F.curve(icA, X * 0.02, X, C.navy, 2.4, '', 160) + F.curve(icB, 0, X * 0.98, C.brick, 2.4, '', 160);
      g += `<rect x="${F.X(0)}" y="${F.Y(Y)}" width="${F.X(X) - F.X(0)}" height="${F.Y(0) - F.Y(Y)}" fill="none" stroke="${C.ink}" stroke-width="1.6"/>`;
      return [g, F.dot(x1, y1, C.ink) + etq(F, x1, y1, 'ω', C.ink) + F.dot(xA, yA, C.forest) + etq(F, xA, yA, 'x<tspan dy="-8" font-size="12">M</tspan>', C.forest, 'start', 9, 18) + etq(F, X, Y, 'O<tspan dy="4" font-size="12">B</tspan>', C.ink, 'end', -6, 20)];
    } }),
    legende: 'Boîte d\'Edgeworth vue depuis O<sub>A</sub>. Courbe des contrats en pointillés, droite de budget passant par ω, courbes d\'indifférence de A (bleu) et de B (rouge) tangentes à l\'équilibre x<sup>M</sup>.',
    sol: `<ol>
      <li>Revenus : ${m(`R<sub>A</sub> = ${x1}p + ${y1}`)} et ${m(`R<sub>B</sub> = ${x2}p + ${y2}`)}.</li>
      <li>Avec des utilités Cobb-Douglas, chaque agent dépense une part fixe de son revenu en bien 1 : ${m(`x<sub>A</sub> = ${e(a)}R<sub>A</sub>/p`)}, ${m(`y<sub>A</sub> = ${e(1 - a)}R<sub>A</sub>`)}, et de même pour B avec ${e(b)}.</li>
      <li>Équilibre du marché du bien 2 : ${m(`${e(1 - a)}(${x1}p + ${y1}) + ${e(1 - b)}(${x2}p + ${y2}) = ${Y}`)}, d'où ${m(`p = (${e(a)}×${y1} + ${e(b)}×${y2}) / (${e(1 - a)}×${x1} + ${e(1 - b)}×${x2}) = ${e(p)}`)}. Par la loi de Walras, le marché du bien 1 est alors équilibré aussi.</li>
      <li>${m(`R<sub>A</sub> = ${e(RA)}`)}, donc ${m(`x<sub>A</sub> = ${e(a)} × ${e(RA)} / ${e(p)} = ${e(xA)}`)} et ${m(`y<sub>A</sub> = ${e(1 - a)} × ${e(RA)} = ${e(yA)}`)}. B consomme le reste : ${m(`(${e(X - xA)} ; ${e(Y - yA)})`)}.</li>
      <li>${m(`TMS<sup>A</sup><sub>2→1</sub> = Um<sub>1</sub>/Um<sub>2</sub> = (${e(a)}/${e(1 - a)}) × y<sub>A</sub>/x<sub>A</sub> = ${e(tms)}`)} : il est égal au rapport inverse des prix, comme celui de B. L'équilibre est un optimum de Pareto.</li></ol>`
  };
} };

/* ---------- Droits à polluer et théorème de Coase ---------- */
GEN.coase = { ch: 2, titre: 'Droits à polluer et théorème de Coase', gen: () => {
  const c = pick([0.25, 0.25, 0.125]);
  const A = c === 0.25 ? 24 * rnd(5, 15) : 42 * rnd(3, 8);
  const k = 1 + 2 * c, ps = A / 3, qmax = ps, pb = A / (2 + 1 / k), q1 = pb / k, q2 = pb, pE = 2 * c * q1;
  const base1 = pb * q1 - 0.5 * q1 * q1, base2 = pb * q2 - 0.5 * q2 * q2 - c * q1 * q1;
  const p1a = base1 + pE * (qmax - q1), p2a = base2 - pE * (qmax - q1), p1b = base1 - pE * q1, p2b = base2 + pE * q1;
  return {
    enonce: `<p>Deux firmes en concurrence pure et parfaite ont pour coûts ${m('CT<sub>1</sub> = 0,5q<sub>1</sub><sup>2</sup>')} et ${m(`CT<sub>2</sub> = 0,5q<sub>2</sub><sup>2</sup> + ${fr(c, 3)}q<sub>1</sub><sup>2</sup>`)}. La demande inverse est ${m(`p = ${A} − q`)}.</p><p>L'État crée un marché de droits à polluer : chaque unité produite par la firme 1 exige un droit, échangé au prix ${m('p<sub>E</sub>')}. Le nombre de droits est fixé à la production de la firme 1 à l'équilibre privé.</p>`,
    q: [
      { label: `Nombre de droits ${m('q<sup>max</sup> = q<sub>1</sub>*')}`, ans: qmax },
      { label: `Prix du bien à l'équilibre avec droits ${m('p̄')}`, ans: pb },
      { label: `Production de la firme 1 ${m('q̄<sub>1</sub>')}`, ans: q1 },
      { label: `Prix d'un droit ${m('p<sub>E</sub>')}`, ans: pE, diag: [[c * q1, 'Le coût externe marginal est la dérivée de CT<sub>2</sub> par rapport à q<sub>1</sub> : n\'oublie pas le facteur 2.'], [2 * c * qmax, 'Tu as évalué le dommage marginal en q<sub>1</sub>*. Le prix du droit s\'établit à la nouvelle production q̄<sub>1</sub>.']] },
      { label: 'Profit de la firme 1 si elle détient les droits', ans: p1a, tol: Math.max(0.5, 0.001 * Math.abs(p1a)), diag: [[p1b, 'C\'est le cas où la firme 2 détient les droits. Ici, la firme 1 vend les droits qu\'elle n\'utilise pas.'], [base1, 'Il manque la vente des droits non utilisés : p<sub>E</sub>(q<sup>max</sup> − q̄<sub>1</sub>).']] },
      { label: 'Profit de la firme 1 si la firme 2 détient les droits', ans: p1b, tol: Math.max(0.5, 0.001 * Math.abs(p1b)), diag: [[p1a, 'C\'est le cas où la firme 1 détient les droits. Ici, elle doit acheter chaque droit qu\'elle utilise.'], [base1, 'Il manque l\'achat des droits : − p<sub>E</sub> × q̄<sub>1</sub>.']] }],
    graph: svg => grBase(svg, { x1: qmax * 1.35, y1: pb * 1.05, xl: 'q₁', draw: F => {
      let g = zone(F, [[q1, 0], [qmax, 0], [qmax, pE], [q1, pE]], C.forest, .22);
      g += F.seg(0, pb, pb, 0, C.navy, 2.6) + F.seg(0, 0, BIG, 2 * c * BIG, C.brick, 2.6) + F.seg(qmax, 0, qmax, BIG, C.ink, 1.5, 'stroke-dasharray="6 5"') + F.seg(0, pE, q1, pE, C.faint, 1.3, 'stroke-dasharray="3 4"');
      return [g, F.dot(q1, pE, C.forest) + etq(F, qmax, pb * 0.95, 'q<tspan dy="-8" font-size="12">max</tspan>', C.ink, 'start', 6, 0) + etq(F, 0, pE, 'p<tspan dy="4" font-size="12">E</tspan>', C.ink, 'start', 6, -8)];
    } }),
    legende: 'Gain marginal d\'un droit pour la firme 1 (p̄ − q<sub>1</sub>) en bleu, dommage marginal évité par la firme 2 en rouge. Ils se coupent en (q̄<sub>1</sub> ; p<sub>E</sub>). La zone verte est le paiement quand la firme 1 détient les droits.',
    sol: `<ol>
      <li>Équilibre privé : ${m('p = q<sub>1</sub> = q<sub>2</sub>')} et ${m(`2p = ${A} − p`)}, d'où ${m(`p* = q<sub>1</sub>* = ${fr(ps)}`)} : il y a ${fr(qmax)} droits.</li>
      <li>La firme 2 valorise un droit de moins au dommage qu'il lui évite : ${m(`p<sub>E</sub> = Cm<sup>e</sup> = ∂CT<sub>2</sub>/∂q<sub>1</sub> = ${fr(2 * c, 3)}q<sub>1</sub>`)}. La firme 1 égalise ${m(`p = q<sub>1</sub> + p<sub>E</sub> = ${fr(k, 3)}q<sub>1</sub>`)} : c'est ${m('p = Cm<sub>1</sub><sup>s</sup>')}.</li>
      <li>Offre totale ${m(`p/${fr(k, 3)} + p = ${A} − p`)}, d'où ${m(`p̄ = ${fr(pb)}`)}, ${m(`q̄<sub>1</sub> = ${fr(q1)}`)}, ${m(`q̄<sub>2</sub> = ${fr(q2)}`)} et ${m(`p<sub>E</sub> = ${fr(pE)}`)}.</li>
      <li>Droits à la firme 1 : elle vend ${m(`${fr(qmax)} − ${fr(q1)} = ${fr(qmax - q1)}`)} droits. ${m(`π<sub>1</sub> = ${fr(base1)} + ${fr(pE)} × ${fr(qmax - q1)} = ${fr(p1a)}`)} et ${m(`π<sub>2</sub> = ${fr(p2a)}`)}.</li>
      <li>Droits à la firme 2 : la firme 1 achète ${fr(q1)} droits. ${m(`π<sub>1</sub> = ${fr(base1)} − ${fr(pE)} × ${fr(q1)} = ${fr(p1b)}`)} et ${m(`π<sub>2</sub> = ${fr(p2b)}`)}.</li>
      <li>Dans les deux cas la firme 1 produit ${fr(q1)} et le profit total vaut ${fr(p1a + p2a)} : l'attribution des droits change la répartition, pas l'allocation. C'est le théorème de Coase.</li></ol>`
  };
} };

/* Ordre d'affichage dans le générateur */
const GEN_ORDRE = ['surplus', 'plancher', 'edgeworth', 'fiscalite', 'pigou', 'fusion', 'coase'];
