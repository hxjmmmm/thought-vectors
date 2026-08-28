// 知识星系引擎 — 可复用的 3D 知识图谱
import * as THREE from 'three';

/**
 * 创建知识星系
 * @param {HTMLElement} container - 挂载容器
 * @param {object} opts
 * @param {boolean} opts.isDark - 暗色模式
 * @param {Array<{id:string, x:number, y:number, z:number, size:number}>} opts.nodes - 节点
 * @param {Array<[number,number]>} opts.links - 连线索引
 * @param {string[]} opts.colors - 配色
 * @param {number} opts.radius - 分布半径
 * @returns {{ dispose: Function, resize: Function }}
 */
export function createGalaxy(container, opts = {}) {
  const {
    isDark = true,
    nodes = [],
    links = [],
    colors = ['#60a5fa', '#818cf8', '#a78bfa'],
    radius = 2.2,
  } = opts;

  // --- 场景初始化 ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // --- 装饰环 ---
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.006, 8, 120),
    new THREE.MeshBasicMaterial({ color: isDark ? 0x475569 : 0x94a3b8, transparent: true, opacity: 0.1 })
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // --- 节点 ---
  const nodeGroup = new THREE.Group();
  const nodeMeshes = [];
  const clickable = [];
  const labelDefs = [];

  for (const node of nodes) {
    const color = colors[nodes.indexOf(node) % colors.length];
    const geo = new THREE.SphereGeometry(node.size, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 0.7,
      roughness: 0.3, metalness: 0.2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(node.x, node.y, node.z);
    mesh.userData = { node, color, baseX: node.x, baseY: node.y, baseZ: node.z };
    nodeGroup.add(mesh);
    nodeMeshes.push(mesh);
    clickable.push(mesh);

    // 光晕
    const hc = document.createElement('canvas'); hc.width = 64; hc.height = 64;
    const hctx = hc.getContext('2d');
    const hg = hctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    hg.addColorStop(0, color + '88');
    hg.addColorStop(0.4, color + '18');
    hg.addColorStop(1, 'transparent');
    hctx.fillStyle = hg; hctx.fillRect(0, 0, 64, 64);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(hc),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5,
    }));
    halo.position.copy(mesh.position);
    halo.scale.set(0.9, 0.9, 1);
    nodeGroup.add(halo);

    // 标签
    const label = makeLabel(node.id, color, isDark);
    label.position.copy(mesh.position);
    label.position.y += node.size + 0.35;
    label.scale.set(1.0, 0.31, 1);
    nodeGroup.add(label);
    labelDefs.push({ sprite: label, mesh, offsetY: node.size + 0.35 });
  }
  scene.add(nodeGroup);

  // --- 连线 ---
  const linkGroup = new THREE.Group();
  for (const [a, b] of links) {
    const from = new THREE.Vector3(nodes[a].x, nodes[a].y, nodes[a].z);
    const to = new THREE.Vector3(nodes[b].x, nodes[b].y, nodes[b].z);
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    mid.add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 0.6
    ));
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const pts = curve.getPoints(20);
    const linkGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const link = new THREE.Line(linkGeo, new THREE.LineBasicMaterial({
      color: colors[a % colors.length],
      transparent: true, opacity: 0.1,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    linkGroup.add(link);
  }
  scene.add(linkGroup);

  // --- 粒子 ---
  const pCount = 40;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius - 0.2 + Math.random() * 0.4;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const dc = document.createElement('canvas'); dc.width = 16; dc.height = 16;
  const dctx = dc.getContext('2d');
  const dg = dctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  dg.addColorStop(0, 'rgba(255,255,255,1)');
  dg.addColorStop(0.3, 'rgba(255,255,255,0.4)');
  dg.addColorStop(1, 'transparent');
  dctx.fillStyle = dg; dctx.fillRect(0, 0, 16, 16);
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.04, map: new THREE.CanvasTexture(dc),
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5,
  }));
  scene.add(particles);

  // --- 光照 ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dl = new THREE.DirectionalLight(0xffffff, 0.6);
  dl.position.set(2, 3, 4); scene.add(dl);

  // --- 状态 ---
  let mx = 0, my = 0, dragging = false, pmx = 0, pmy = 0;
  let focusedNode = null;
  let focusZoom = 7;
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.5;
  const mouse = new THREE.Vector2();

  // --- 交互 ---
  function getIntersections(e) {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(clickable);
  }

  const onMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    if (dragging) { mx += (x - pmx) * 0.5; my += (y - pmy) * 0.5; }
    pmx = x; pmy = y;
    return { x, y, hits: getIntersections(e) };
  };

  const onDown = () => { dragging = true; };
  const onUp = (e) => {
    if (!dragging) return;
    const dx = Math.abs(pmx - mouse.x), dy = Math.abs(pmy - mouse.y);
    if (dx < 0.01 && dy < 0.01) {
      const hits = getIntersections(e);
      if (hits.length > 0) {
        const n = hits[0].object.userData.node;
        focusedNode = n;
        focusZoom = 3.5;
      } else if (focusedNode) {
        focusedNode = null;
        focusZoom = 7;
      }
    }
    dragging = false;
  };
  const onLeave = () => { dragging = false; };

  container.addEventListener('mousemove', onMove);
  container.addEventListener('mousedown', onDown);
  container.addEventListener('mouseup', onUp);
  container.addEventListener('mouseleave', onLeave);

  // --- 动画循环 ---
  let animId;
  let lastFrame = 0;
  const FRAME_INTERVAL = 1000 / 30; // 30 FPS
  const clock = new THREE.Clock();
  function animate(now = 0) {
    animId = requestAnimationFrame(animate);
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;
    const dt = Math.min(clock.getDelta(), 0.1) * (FRAME_INTERVAL / 16.67);
    const t = performance.now() * 0.001;

    if (!dragging) mx += dt * 0.03;
    nodeGroup.rotation.y += (mx - nodeGroup.rotation.y) * 0.03;
    nodeGroup.rotation.x += (my - nodeGroup.rotation.x) * 0.03;
    linkGroup.rotation.copy(nodeGroup.rotation);
    particles.rotation.copy(nodeGroup.rotation);
    ring.rotation.z += dt * 0.04;

    focusZoom += (focusedNode ? 3.5 : 7 - focusZoom) * 0.04;
    camera.position.z += (focusZoom - camera.position.z) * 0.04;

    for (const mesh of nodeMeshes) {
      const { baseX, node } = mesh.userData;
      const breathe = 1 + Math.sin(t * 1.2 + baseX * 3) * 0.03;
      mesh.scale.setScalar(focusedNode === node ? 1.5 : breathe);
      mesh.material.emissiveIntensity = focusedNode === node ? 1.5 : 0.7;
    }

    for (const { sprite, mesh, offsetY } of labelDefs) {
      sprite.position.copy(mesh.position);
      sprite.position.y += offsetY * mesh.scale.y;
    }

    renderer.render(scene, camera);
  }
  animate();

  // --- 公开 API ---
  return {
    /** 获取悬停信息（供外部 tooltip 使用） */
    getHoverInfo(e) {
      const hits = getIntersections(e);
      return hits.length > 0 ? hits[0].object.userData.node : null;
    },
    /** 销毁 */
    dispose() {
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
    },
    /** 响应尺寸变化 */
    resize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    },
  };
}

/** 创建文字标签 sprite */
function makeLabel(text, color, isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 80;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 32px "Inter","PingFang SC","Microsoft YaHei",sans-serif';
  const tm = ctx.measureText(text);
  const tw = tm.width, th = 32, padX = 10, padY = 4;
  const bw = tw + padX * 2, bh = th + padY * 2;
  const bx = (256 - bw) / 2, by = (80 - bh) / 2;
  ctx.fillStyle = isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 12); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 12); ctx.stroke();
  ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 40);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, depthTest: false, depthWrite: false, transparent: true,
  }));
}