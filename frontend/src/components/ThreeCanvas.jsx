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
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 15;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Main parent group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Lighting System (To render the specular highlights on the orb)
    const ambientLight = new THREE.AmbientLight(0x1a0505, 1.2); // subtle warm base
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 3.0); // sharp source for specular highlight
    dirLight.position.set(6, 6, 8);
    scene.add(dirLight);

    const pointLightRed = new THREE.PointLight('#E32636', 3.5, 40); // vibrant crimson glow source
    pointLightRed.position.set(0, 0, 0);
    scene.add(pointLightRed);

    const pointLightGold = new THREE.PointLight('#FFD700', 2.0, 30); // glowing gold highlights
    pointLightGold.position.set(-3, 2, 3);
    scene.add(pointLightGold);

    // 2. 350 Floating/Drifting Square Pixel Particles
    const particleCount = 350;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleData = [];

    const colorCrimson = new THREE.Color('#E32636');
    const colorGold = new THREE.Color('#FFD700');
    const colorBlackishRed = new THREE.Color('#3a0008');

    for (let i = 0; i < particleCount; i++) {
      // Spawn particles randomly in a large bounding box
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 20;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Drift velocities (fluid drifting across canvas)
      particleData.push({
        driftX: (Math.random() - 0.5) * 0.012,
        driftY: (0.01 + Math.random() * 0.018), // mostly drifting upwards
        driftZ: (Math.random() - 0.5) * 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 1.0 + Math.random() * 2.0
      });

      // Color mixing (RCB Crimson, gold, and deep accent reds)
      const rand = Math.random();
      let mixColor;
      if (rand > 0.65) {
        mixColor = colorGold;
      } else if (rand > 0.2) {
        mixColor = colorCrimson;
      } else {
        mixColor = colorBlackishRed;
      }

      particleColors[i * 3] = mixColor.r;
      particleColors[i * 3 + 1] = mixColor.g;
      particleColors[i * 3 + 2] = mixColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // PointsMaterial without texture renders as square pixels
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // 3. 3 Tilted 3D Elliptical Orbital Rings
    const createEllipsePoints = (a, b, segments = 128) => {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = a * Math.cos(theta);
        const y = b * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, 0));
      }
      return points;
    };

    const rings = [];
    // Configuration for the 3 rings
    const ringConfigs = [
      { a: 5.2, b: 3.2, color: '#E32636', rotX: 1.2, rotY: 0.4, speedZ: 0.006 },
      { a: 6.5, b: 4.0, color: '#FFD700', rotX: -0.9, rotY: 0.7, speedZ: -0.005 },
      { a: 7.8, b: 4.8, color: '#E32636', rotX: 0.4, rotY: -1.0, speedZ: 0.004 }
    ];

    ringConfigs.forEach((config) => {
      const points = createEllipsePoints(config.a, config.b);
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const ringMaterial = new THREE.LineBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        linewidth: 1
      });

      const lineLoop = new THREE.LineLoop(ringGeometry, ringMaterial);
      
      // Apply initial 3D tilt
      lineLoop.rotation.x = config.rotX;
      lineLoop.rotation.y = config.rotY;
      
      mainGroup.add(lineLoop);
      
      rings.push({
        mesh: lineLoop,
        speedZ: config.speedZ
      });
    });

    // 4. Central Glowing Orb with intense radial glow and specular highlight
    // Base Orb
    const coreGeometry = new THREE.SphereGeometry(1.6, 64, 64);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: '#E32636',
      emissive: '#2b0004',
      specular: '#FFD700', // Gold specular highlight
      shininess: 95,
      transparent: true,
      opacity: 0.95
    });
    const coreOrb = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreOrb);

    // Concentric glowing shells for intense dramatic radial glow (Glow level 7/10)
    const glowShells = [];
    const glowSpecs = [
      { size: 1.8, color: '#FFD700', baseOpacity: 0.42 }, // Inner gold glow
      { size: 2.3, color: '#E32636', baseOpacity: 0.28 }, // Mid red glow
      { size: 3.0, color: '#E32636', baseOpacity: 0.14 }  // Outer soft red corona
    ];

    glowSpecs.forEach((spec) => {
      const geom = new THREE.SphereGeometry(spec.size, 32, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.baseOpacity,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const shellMesh = new THREE.Mesh(geom, mat);
      mainGroup.add(shellMesh);
      glowShells.push({
        mesh: shellMesh,
        baseScale: 1.0,
        baseOpacity: spec.baseOpacity
      });
    });

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

    // Animation variables (Rotation speed level 4/10)
    const rotationMultiplier = 0.4; // 4/10 speed
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Slow elegant base rotation (4/10 level)
      mainGroup.rotation.y = time * 0.03 * rotationMultiplier + targetX * 0.25;
      mainGroup.rotation.x = 0.08 + targetY * 0.15 - scrollY * 0.0003;
      mainGroup.position.y = -scrollY * 0.004; // subtle scroll parallax shift

      // Drift floating square pixel particles
      const positionsArr = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const data = particleData[i];
        
        // Update positions linearly by drift velocities
        positionsArr[i * 3] += data.driftX;
        positionsArr[i * 3 + 1] += data.driftY;
        positionsArr[i * 3 + 2] += data.driftZ;

        // Wrap around boundaries
        if (positionsArr[i * 3] > 11) positionsArr[i * 3] = -11;
        if (positionsArr[i * 3] < -11) positionsArr[i * 3] = 11;
        if (positionsArr[i * 3 + 1] > 11) positionsArr[i * 3 + 1] = -11;
        if (positionsArr[i * 3 + 1] < -11) positionsArr[i * 3 + 1] = 11;
        if (positionsArr[i * 3 + 2] > 10) positionsArr[i * 3 + 2] = -10;
        if (positionsArr[i * 3 + 2] < -10) positionsArr[i * 3 + 2] = 10;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Rotate tilted elliptical rings (medium fluid speed, 4/10)
      rings.forEach((ring) => {
        ring.mesh.rotation.z += ring.speedZ * rotationMultiplier;
      });

      // Pulse central core and radial glows (Glow level 7/10)
      const corePulse = 1.0 + Math.sin(time * 1.5) * 0.04;
      coreOrb.scale.set(corePulse, corePulse, corePulse);

      glowShells.forEach((shell, index) => {
        const wave = Math.sin(time * 1.8 + index * 0.5);
        const scaleVal = 1.0 + wave * 0.06;
        shell.mesh.scale.set(scaleVal, scaleVal, scaleVal);
        shell.mesh.material.opacity = shell.baseOpacity * (0.85 + wave * 0.15);
      });

      // Subtle light source pulse
      pointLightRed.intensity = 3.0 + Math.sin(time * 2.0) * 0.6;
      pointLightGold.intensity = 1.8 + Math.cos(time * 1.6) * 0.4;

      // Smooth cursor parallax interpolation
      targetX += (mouseX - targetX) * 0.045;
      targetY += (mouseY - targetY) * 0.045;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      rings.forEach(r => r.mesh.geometry.dispose());
      rings.forEach(r => r.mesh.material.dispose());
      glowShells.forEach(s => {
        s.mesh.geometry.dispose();
        s.mesh.material.dispose();
      });

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
          <span>LEGACY BACKGROUND</span>
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
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Subtle vignette overlay on top of WebGL canvas for the red vignette requirement */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(0,0,0,0) 45%, rgba(20,0,2,0.35) 80%, rgba(0,0,0,0.96) 100%)',
          zIndex: 1
        }}
      />
      <div className="three-overlay-text" style={{ zIndex: 2 }}>
        <span>3D STATS UNIVERSE</span>
        <p className="pulse">Move Cursor to Orbit</p>
      </div>
    </div>
  );
};

export default ThreeCanvas;
