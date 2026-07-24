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
