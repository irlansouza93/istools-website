const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('is-open')));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
}), { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.type-line').forEach((element) => {
  const text = element.dataset.text || ''; let position = 0;
  const type = () => { element.textContent = text.slice(0, ++position); if (position < text.length) setTimeout(type, 55); else setTimeout(() => element.style.borderColor = 'transparent', 900); };
  setTimeout(type, 180);
});

const themeToggle = document.querySelector('.theme-toggle');
const setTheme = (dark) => { document.body.classList.toggle('dark-mode', dark); themeToggle?.setAttribute('aria-pressed', dark); if (themeToggle) themeToggle.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}"></i>`; };
setTheme(localStorage.getItem('istools-theme') === 'dark');
themeToggle?.addEventListener('click', () => { const dark = !document.body.classList.contains('dark-mode'); localStorage.setItem('istools-theme', dark ? 'dark' : 'light'); setTheme(dark); });

const topoCanvas = document.getElementById('topo-canvas');
if (topoCanvas) {
  const context = topoCanvas.getContext('2d', { alpha: true });
  const hero = topoCanvas.closest('.hero');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contourFamilies = [
    { x: .02, y: .18, radius: .055, step: .047, rings: 13, stretch: 1.48, phase: .4 },
    { x: .42, y: .57, radius: .045, step: .042, rings: 12, stretch: 1.32, phase: 2.1 },
    { x: .83, y: .15, radius: .04, step: .044, rings: 11, stretch: 1.16, phase: 4.2 },
    { x: .91, y: .91, radius: .05, step: .048, rings: 12, stretch: 1.42, phase: 1.2 }
  ];
  let canvasWidth = 0;
  let canvasHeight = 0;
  let lastFrame = 0;
  let animationFrame = 0;

  const resizeTopography = () => {
    const bounds = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvasWidth = Math.max(1, Math.round(bounds.width));
    canvasHeight = Math.max(1, Math.round(bounds.height));
    topoCanvas.width = Math.round(canvasWidth * pixelRatio);
    topoCanvas.height = Math.round(canvasHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const drawTopography = (time = 0) => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const scale = Math.min(canvasWidth, canvasHeight);
    const dark = document.body.classList.contains('dark-mode');
    context.strokeStyle = dark ? 'rgba(157, 205, 182, .5)' : 'rgba(47, 82, 72, .48)';
    context.lineWidth = Math.max(.75, Math.min(1.45, canvasWidth / 1250));
    context.lineJoin = 'round';
    context.lineCap = 'round';

    contourFamilies.forEach((family, familyIndex) => {
      for (let ring = 0; ring < family.rings; ring += 1) {
        const radius = scale * (family.radius + ring * family.step);
        const verticalRadius = radius / family.stretch;
        const drift = reducedMotion.matches ? 0 : time * .000055 * (familyIndex % 2 ? -1 : 1);
        context.beginPath();
        for (let point = 0; point <= 96; point += 1) {
          const angle = (point / 96) * Math.PI * 2;
          const irregularity =
            Math.sin(angle * 3 + family.phase + drift + ring * .17) * .075 +
            Math.sin(angle * 7 - family.phase * .6 - drift * 1.4 + ring * .11) * .032 +
            Math.cos(angle * 11 + ring * .23) * .014;
          const x = family.x * canvasWidth + Math.cos(angle) * radius * (1 + irregularity);
          const y = family.y * canvasHeight + Math.sin(angle) * verticalRadius * (1 + irregularity * 1.35);
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.globalAlpha = .42 + (ring % 4) * .08;
        context.stroke();
      }
    });
    context.globalAlpha = 1;
  };

  const animateTopography = (time) => {
    if (time - lastFrame >= 40) {
      drawTopography(time);
      lastFrame = time;
    }
    animationFrame = requestAnimationFrame(animateTopography);
  };

  const startTopography = () => {
    cancelAnimationFrame(animationFrame);
    resizeTopography();
    drawTopography();
    if (!reducedMotion.matches && !document.hidden) animationFrame = requestAnimationFrame(animateTopography);
  };

  if ('ResizeObserver' in window) new ResizeObserver(startTopography).observe(hero);
  else window.addEventListener('resize', startTopography, { passive: true });
  reducedMotion.addEventListener?.('change', startTopography);
  document.addEventListener('visibilitychange', startTopography);
  themeToggle?.addEventListener('click', () => requestAnimationFrame(() => drawTopography(lastFrame)));
  startTopography();
}

if (window.Globe) {
  const globeRoot = document.getElementById('geo-globe');
  const globe = Globe()(globeRoot).backgroundColor('rgba(0,0,0,0)').showAtmosphere(true).atmosphereColor('#b9e65b').atmosphereAltitude(0.12).globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg').bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png');
  const resizeGlobe = () => {
    const size = Math.round(globeRoot.getBoundingClientRect().width);
    if (size > 0) globe.width(size).height(size);
  };
  resizeGlobe();
  window.addEventListener('resize', resizeGlobe, { passive: true });
  globe.controls().autoRotate = true; globe.controls().autoRotateSpeed = .7; globe.controls().enableZoom = false;
  const globeMaterial = globe.globeMaterial();
  globeMaterial.emissive?.set('#173a34');
  globeMaterial.emissiveIntensity = 0.55;
  import('https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js').then((THREE) => {
    globe.scene().add(new THREE.AmbientLight(0xffffff, 1.76));
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(globe.getGlobeRadius() * 1.004, 75, 75),
      new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three-globe/example/img/clouds.png'), transparent: true })
    );
    globe.scene().add(clouds);
    (function rotateClouds() { clouds.rotation.y -= 0.0012; requestAnimationFrame(rotateClouds); })();
  }).catch(() => {});
}
