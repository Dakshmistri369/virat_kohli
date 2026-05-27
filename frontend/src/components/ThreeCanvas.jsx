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

    // Camera - elevated angle, looking down at solar system
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 11, 23);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Group to hold all objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Starry Cosmos Background (Twinkling space particles)
    const starCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 25 + Math.random() * 35; // Position stars far away (radius 25 to 60)

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      // Star color distribution: Mostly white, with gold and blue highlights
      const colorRatio = Math.random();
      if (colorRatio > 0.85) {
        // Soft Gold Star
        starColors[i * 3] = 0.98;
        starColors[i * 3 + 1] = 0.88;
        starColors[i * 3 + 2] = 0.45;
      } else if (colorRatio > 0.70) {
        // Cyan-Blue Star
        starColors[i * 3] = 0.45;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 1.0;
      } else {
        // Pure White Star
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.95;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 2. Central Sun (The Kohli Core)
    const sunGroup = new THREE.Group();
    mainGroup.add(sunGroup);

    // Golden core sphere
    const sunGeom = new THREE.SphereGeometry(1.4, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: '#ffb300', // Intense Sun Gold
      transparent: true,
      opacity: 0.95
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    sunGroup.add(sunMesh);

    // Glow Layer 1 (Inner intense crimson flare)
    const glowGeom1 = new THREE.SphereGeometry(1.65, 32, 32);
    const glowMat1 = new THREE.MeshBasicMaterial({
      color: '#ff1e27', // RCB Crimson
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const glow1 = new THREE.Mesh(glowGeom1, glowMat1);
    sunGroup.add(glow1);

    // Glow Layer 2 (Golden aura)
    const glowGeom2 = new THREE.SphereGeometry(2.0, 32, 32);
    const glowMat2 = new THREE.MeshBasicMaterial({
      color: '#ecb22e', // RCB Gold
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const glow2 = new THREE.Mesh(glowGeom2, glowMat2);
    sunGroup.add(glow2);

    // Glow Layer 3 (Outer faint red halo)
    const glowGeom3 = new THREE.SphereGeometry(2.6, 32, 32);
    const glowMat3 = new THREE.MeshBasicMaterial({
      color: '#ff1e27',
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const glow3 = new THREE.Mesh(glowGeom3, glowMat3);
    sunGroup.add(glow3);

    // Helper to create thin, elegant orbital line loops
    const createOrbitLine = (radius, incX, incZ, color) => {
      const points = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const vertex = new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
        points.push(vertex);
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.LineLoop(geom, mat);
      line.rotation.x = incX;
      line.rotation.z = incZ;
      return line;
    };

    // 3. Planets (Career Milestones Data)
    const planetsData = [
      {
        name: "Spark (2008)",
        orbitRadius: 4.2,
        size: 0.20,
        color: "#ff5722", // Fiery orange/red
        speed: 0.65,
        incX: 0.12,
        incZ: -0.06,
        hasRings: false,
        moons: []
      },
      {
        name: "Rise (2011)",
        orbitRadius: 6.0,
        size: 0.26,
        color: "#00b0ff", // Indian Sky Blue
        speed: 0.48,
        incX: -0.09,
        incZ: 0.08,
        hasRings: false,
        moons: []
      },
      {
        name: "Monarch (2014)",
        orbitRadius: 8.0,
        size: 0.34,
        color: "#ecb22e", // Leadership Gold
        speed: 0.35,
        incX: 0.16,
        incZ: 0.12,
        hasRings: true,
        ringColor: "#ecb22e",
        ringInner: 0.46,
        ringOuter: 0.70,
        moons: []
      },
      {
        name: "Dominance (2016)",
        orbitRadius: 10.2,
        size: 0.42,
        color: "#ff1e27", // RCB Crimson
        speed: 0.25,
        incX: -0.12,
        incZ: -0.14,
        hasRings: false,
        moons: [
          { size: 0.065, orbitRadius: 0.68, speed: 2.3, color: "#a5a7ab" },
          { size: 0.05, orbitRadius: 0.92, speed: 1.6, color: "#ecb22e" }
        ]
      },
      {
        name: "Redemption (2022)",
        orbitRadius: 12.4,
        size: 0.30,
        color: "#00e676", // Emerald Green (Fresh resurgence)
        speed: 0.18,
        incX: 0.06,
        incZ: -0.09,
        hasRings: false,
        moons: []
      },
      {
        name: "Immortal (2024)",
        orbitRadius: 14.5,
        size: 0.45,
        color: "#ffffff", // Pure Platinum/White
        speed: 0.11,
        incX: -0.06,
        incZ: 0.10,
        hasRings: true,
        ringColor: "#ffffff",
        ringInner: 0.58,
        ringOuter: 0.88,
        moons: [
          { size: 0.055, orbitRadius: 0.8, speed: 1.4, color: "#ff1e27" }
        ]
      }
    ];

    const planets = [];

    planetsData.forEach((data) => {
      // Create and add orbit line to show orbital path
      const orbitLine = createOrbitLine(data.orbitRadius, data.incX, data.incZ, data.color);
      mainGroup.add(orbitLine);

      // Create subgroup for hierarchical rotation (planet + rings + moons)
      const planetGroup = new THREE.Group();
      mainGroup.add(planetGroup);

      // Planet Sphere Mesh
      const planetGeom = new THREE.SphereGeometry(data.size, 16, 16);
      const planetMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.color),
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.20
      });
      const planetMesh = new THREE.Mesh(planetGeom, planetMat);
      planetGroup.add(planetMesh);

      // Optional rings (e.g. leadership crown or career records)
      if (data.hasRings) {
        const ringGeom = new THREE.RingGeometry(data.ringInner, data.ringOuter, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: data.ringColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2.4;
        ringMesh.rotation.y = 0.15;
        planetGroup.add(ringMesh);
      }

      // Optional moons
      const moonsList = [];
      if (data.moons && data.moons.length > 0) {
        data.moons.forEach((moonInfo) => {
          const moonGeom = new THREE.SphereGeometry(moonInfo.size, 8, 8);
          const moonMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(moonInfo.color),
            roughness: 0.7
          });
          const moonMesh = new THREE.Mesh(moonGeom, moonMat);

          const moonOrbitGroup = new THREE.Group();
          planetGroup.add(moonOrbitGroup);

          moonMesh.position.x = moonInfo.orbitRadius;
          moonOrbitGroup.add(moonMesh);

          // Apply slight tilt to moon orbit
          moonOrbitGroup.rotation.x = Math.random() * 0.2 - 0.1;
          moonOrbitGroup.rotation.z = Math.random() * 0.2 - 0.1;

          moonsList.push({
            group: moonOrbitGroup,
            speed: moonInfo.speed,
            angle: Math.random() * Math.PI * 2
          });
        });
      }

      planets.push({
        group: planetGroup,
        data: data,
        angle: Math.random() * Math.PI * 2,
        moons: moonsList
      });
    });

    // 4. Lighting System
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    // Directional light from top-front
    const dirLight = new THREE.DirectionalLight('#ffffff', 0.9);
    dirLight.position.set(5, 15, 10);
    scene.add(dirLight);

    // Glowing core point light (Golden/Yellow)
    const sunLightGold = new THREE.PointLight('#ffb300', 3.2, 30, 0.6);
    sunLightGold.position.set(0, 0, 0);
    scene.add(sunLightGold);

    // Glowing core point light (Crimson Red)
    const sunLightRed = new THREE.PointLight('#ff1e27', 2.2, 25, 0.6);
    sunLightRed.position.set(0, 0, 0);
    scene.add(sunLightRed);

    // Mouse Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Sun Core
      sunGroup.rotation.y += 0.004;

      // Twinkle Sun Glows
      glow1.rotation.y += 0.001;
      glow2.rotation.z -= 0.0008;
      glow3.rotation.x += 0.0012;

      // Update planets' positions and self-rotations
      planets.forEach((p) => {
        // Keplerian speed approximation: Orbit angle increases over time
        p.angle += p.data.speed * delta * 0.45;

        // Circular position calculation
        const x = Math.cos(p.angle) * p.data.orbitRadius;
        const z = Math.sin(p.angle) * p.data.orbitRadius;

        // Project position coordinates onto inclined planes
        const pos = new THREE.Vector3(x, 0, z);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), p.data.incX);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), p.data.incZ);

        p.group.position.copy(pos);

        // Self-rotation of planets
        p.group.children[0].rotation.y += 0.008;

        // Update Moons' orbits
        p.moons.forEach((m) => {
          m.angle += m.speed * delta;
          m.group.rotation.y = m.angle;
        });
      });

      // Slowly drift background stars
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;

      // Smooth mouse follow interpolation
      targetX += (mouseX - targetX) * 0.045;
      targetY += (mouseY - targetY) * 0.045;

      // Apply base tilt plus interactive mouse parallax
      mainGroup.rotation.y = time * 0.015 + targetX * 0.35;
      mainGroup.rotation.x = 0.15 + targetY * 0.25;

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

    // Clean up WebGL resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose Geometries
      starGeometry.dispose();
      sunGeom.dispose();
      glowGeom1.dispose();
      glowGeom2.dispose();
      glowGeom3.dispose();
      
      // Dispose Materials
      starMaterial.dispose();
      sunMat.dispose();
      glowMat1.dispose();
      glowMat2.dispose();
      glowMat3.dispose();

      // Clear groups
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
        pointerEvents: 'none', // Set to none so we do not block background clicking
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
