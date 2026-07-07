import { useEffect, useRef } from "react";

export function ThreeJsNeuralNetwork() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const THREE = (window as any).THREE;
    if (!THREE) {
      console.warn("ThreeJS library not loaded");
      return;
    }

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create Quantum Sphere Particles - Clean & Subtle
    const particleCount = 45;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 2.0;
      
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: 0.05,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 4.0;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const isDark = document.documentElement.classList.contains("dark");
      material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      material.color.setHex(isDark ? 0x7c3aed : 0x6d28d9);
      material.opacity = isDark ? 0.12 : 0.15;

      const posArray = geometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.001;

      // Slow, subtle ripple
      for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        const wave = Math.sin(time * 0.5 + phi) * 0.08;
        const radius = 2.0 + wave;

        posArray[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
        posArray[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        posArray[i * 3 + 2] = radius * Math.cos(phi);
      }
      geometry.attributes.position.needsUpdate = true;

      // Very slow spin
      points.rotation.y += 0.0008;
      points.rotation.x += 0.0004;

      // Slow cam follow
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (mouseY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      if (renderer) {
        if (container && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="threejs-container absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
