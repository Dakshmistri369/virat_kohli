import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeCanvas = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Group to hold all objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Starry Cosmos Background (Subtle twinkling stars drifting in deep background)
    const starCount = 500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 20 + Math.random() * 30; // deep background

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      // Mild colors: RCB Red, RCB Gold, Soft White
      const rand = Math.random();
      if (rand > 0.85) {
        // Gold
        starColors[i * 3] = 0.98;
        starColors[i * 3 + 1] = 0.88;
        starColors[i * 3 + 2] = 0.45;
      } else if (rand > 0.70) {
        // Red
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.2;
        starColors[i * 3 + 2] = 0.25;
      } else {
        // Soft white
        starColors[i * 3] = 0.9;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 0.95;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const starSystem = new THREE.Points(starGeometry, starMaterial);
    scene.add(starSystem);

    // 2. Breathing Particle Sphere (Foreground representation of runs/achievements)
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const rcbRed = new THREE.Color('#ff1e27');
    const rcbGold = new THREE.Color('#ecb22e');
    const darkGrey = new THREE.Color('#333338');

    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution (Fibonacci Sphere)
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      
      const baseRadius = 6.2 + (Math.random() - 0.5) * 0.5;
      
      const x = baseRadius * Math.sin(phi) * Math.cos(theta);
      const y = baseRadius * Math.sin(phi) * Math.sin(theta);
      const z = baseRadius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Save attributes for runtime animation
      particleData.push({
        phi,
        theta,
        baseRadius,
        speed: 0.8 + Math.random() * 1.4,
        offset: Math.random() * Math.PI * 2
      });

      // Color mix
      const colorRatio = Math.random();
      let mixColor;
      if (colorRatio > 0.6) {
        mixColor = rcbGold;
      } else if (colorRatio > 0.15) {
        mixColor = rcbRed;
      } else {
        mixColor = darkGrey;
      }

      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    mainGroup.add(particleSystem);

    // 3. Orbital Rings (glowing orbits representing platforms)
    const rings = [];
    const ringRadii = [3.8, 5.0, 6.4, 7.8];
    const ringColors = ['#ffffff', '#00d2ff', '#ff1e27', '#ecb22e'];
    
    ringRadii.forEach((radius, index) => {
      const ringGeom = new THREE.RingGeometry(radius - 0.025, radius + 0.025, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[index],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(ringGeom, ringMat);
      
      // Setup distinct orbital planes
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mainGroup.add(mesh);
      
      rings.push({
        mesh,
        speedX: 0.0015 + index * 0.0006,
        speedY: 0.001 + index * 0.0004,
        speedZ: 0.002 + index * 0.0008,
      });
    });

    // 4. Central Glowing Core
    const coreGeom = new THREE.SphereGeometry(1.6, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: '#ff1e27',
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    mainGroup.add(core);

    // Glow Aura (Inner & Outer)
    const coreGlowGeom = new THREE.SphereGeometry(1.9, 32, 32);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: '#ecb22e',
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const coreGlow = new THREE.Mesh(coreGlowGeom, coreGlowMat);
    mainGroup.add(coreGlow);

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#ff1e27', 1.8, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Point light for gold highlights
    const pointLightGold = new THREE.PointLight('#ecb22e', 1.2, 50);
    pointLightGold.position.set(2, 2, 2);
    scene.add(pointLightGold);

    // Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // 1. Natural rotation of main group
      mainGroup.rotation.y = time * 0.04 + targetX * 0.35;
      mainGroup.rotation.x = 0.1 + targetY * 0.25 - scrollY * 0.0004;

      // Apply vertical drift on scroll (scroll parallax)
      mainGroup.position.y = -scrollY * 0.005;

      // 2. Slow rotation of background starry cosmos
      starSystem.rotation.y = time * 0.008;
      starSystem.rotation.x = time * 0.004;

      // 3. Update individual particle positions (breathing and swirling effect)
      const positionsArr = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        // breathing radius
        const r = p.baseRadius + Math.sin(time * p.speed + p.offset) * 0.25;
        // swirling angle over time
        const swirlTheta = p.theta + time * 0.06;

        positionsArr[i * 3] = r * Math.sin(p.phi) * Math.cos(swirlTheta);
        positionsArr[i * 3 + 1] = r * Math.sin(p.phi) * Math.sin(swirlTheta);
        positionsArr[i * 3 + 2] = r * Math.cos(p.phi);
      }
      geometry.attributes.position.needsUpdate = true;

      // 4. Rotate orbital rings on different axes
      rings.forEach((r, index) => {
        r.mesh.rotation.z += r.speedZ;
        r.mesh.rotation.x += Math.sin(time * 0.15 + index) * 0.0005;
        r.mesh.rotation.y += Math.cos(time * 0.15 + index) * 0.0005;
      });

      // 5. Pulsing central core and glow
      const corePulse = 1.0 + Math.sin(time * 1.8) * 0.07;
      core.scale.set(corePulse, corePulse, corePulse);
      
      const glowPulse = 1.0 + Math.cos(time * 1.5) * 0.09;
      coreGlow.scale.set(glowPulse, glowPulse, glowPulse);

      // 6. Point lights pulsing
      pointLight.intensity = 1.6 + Math.sin(time * 2.5) * 0.5;
      pointLightGold.intensity = 1.0 + Math.cos(time * 2.0) * 0.3;

      // Smooth camera follow mouse interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up WebGL resources and event listeners
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose Geometries
      starGeometry.dispose();
      geometry.dispose();
      coreGeom.dispose();
      coreGlowGeom.dispose();
      rings.forEach(r => r.mesh.geometry.dispose());

      // Dispose Materials
      starMaterial.dispose();
      material.dispose();
      coreMat.dispose();
      coreGlowMat.dispose();
      rings.forEach(r => r.mesh.material.dispose());

      // Clear main group
      mainGroup.clear();
      scene.clear();
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="three-canvas-container fallback-css-gradient">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="three-overlay-text">
          <span>STATS UNIVERSE</span>
          <p>Touch & Scroll to Explore</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="three-canvas-container" 
      ref={containerRef} 
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none', // none so we do not block background clicking
        overflow: 'hidden'
      }}
    >
      <div className="three-overlay-text">
        <span>3D STATS UNIVERSE</span>
        <p className="pulse">Move Cursor to Orbit</p>
      </div>
    </div>
  );
};

export default ThreeCanvas;
