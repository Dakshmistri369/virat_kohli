import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeCanvas = () => {
  const containerRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
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

    // 1. Particle Sphere (Stars representing Runs / Career achievements)
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const rcbRed = new THREE.Color('#ff1e27');
    const rcbGold = new THREE.Color('#ecb22e');
    const darkGrey = new THREE.Color('#222225');

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution (Fibonacci Sphere)
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      
      const radius = 6 + (Math.random() - 0.5) * 0.4;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color mix: red and gold particles
      const colorRatio = Math.random();
      let mixColor;
      if (colorRatio > 0.6) {
        mixColor = rcbGold;
      } else if (colorRatio > 0.1) {
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

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    mainGroup.add(particleSystem);

    // 2. Orbital Rings (glowing orbits representing different platforms: Tests, ODIs, T20Is, IPL)
    const ringCount = 4;
    const rings = [];
    const ringRadii = [3.5, 4.8, 6.2, 7.5];
    const ringColors = ['#ffffff', '#00d2ff', '#ff1e27', '#ecb22e']; // Test (White), ODI (Blue), IPL/T20I (Red, Gold)
    
    ringRadii.forEach((radius, index) => {
      const ringGeom = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[index],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(ringGeom, ringMat);
      
      // Rotate randomly to create a complex orbital shell
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mainGroup.add(mesh);
      rings.push({ mesh, speed: 0.002 + index * 0.001 });
    });

    // 3. Central Core (Glowing core)
    const coreGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: '#ff1e27',
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    mainGroup.add(core);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Point Light (representing core energy)
    const pointLight = new THREE.PointLight('#ff1e27', 1.5, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Normalized coordinates
      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate group naturally
      mainGroup.rotation.y += 0.002;
      mainGroup.rotation.x += 0.001;

      // Rotate rings on their own speeds
      rings.forEach(r => {
        r.mesh.rotation.z += r.speed;
      });

      // Smooth camera follow mouse
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y += targetX * 0.5;
      mainGroup.rotation.x -= targetY * 0.5;

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

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeom.dispose();
      coreMat.dispose();
    };
  }, []);

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
        pointerEvents: 'auto',
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
