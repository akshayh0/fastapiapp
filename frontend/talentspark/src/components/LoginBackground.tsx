import { useEffect, useRef } from "react";

export function LoginBackground() {
  const shaderCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const threejsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ----------------------------------------------------
    // 1. WebGL Custom Shader Setup
    // ----------------------------------------------------
    const canvas = shaderCanvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported in this browser");
      return;
    }

    let shaderAnimationId: number;
    let resizeObserver: ResizeObserver | null = null;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;
        float t = u_time * 0.4;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;
        for(int i=1; i<5; i++) {
          float fi = float(i);
          p.x += 0.4 / fi * sin(fi * p.y + t + 0.5 * fi);
          p.y += 0.3 / fi * cos(fi * p.x + t + 0.8 * fi);
        }
        vec3 color1 = vec3(0.043, 0.075, 0.149); 
        vec3 color2 = vec3(0.25, 0.1, 0.6);      
        vec3 color3 = vec3(0.486, 0.227, 0.929); 
        float intensity = length(p) * 0.5;
        vec3 finalColor = mix(color1, color2, clamp(intensity, 0.0, 1.0));
        finalColor = mix(finalColor, color3, pow(clamp(1.0 - intensity, 0.0, 1.0), 3.0) * 0.4);
        float dist = distance(uv, mouse);
        finalColor += color3 * (smoothstep(0.6, 0.0, dist) * 0.2);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const cs = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const prog = gl.createProgram();
    if (!prog) return;

    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Shader program linking error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const renderShader = (t: number) => {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      shaderAnimationId = requestAnimationFrame(renderShader);
    };

    shaderAnimationId = requestAnimationFrame(renderShader);

    // ----------------------------------------------------
    // 2. ThreeJS Animation Setup
    // ----------------------------------------------------
    const threeContainer = threejsContainerRef.current;
    const THREE = (window as any).THREE;

    let threeAnimationId: number;
    let renderer: any;
    let camera: any;
    let scene: any;
    let rings: any[] = [];

    const handleResize = () => {
      if (!threeContainer || !renderer || !camera) return;
      const w = threeContainer.clientWidth || window.innerWidth;
      const h = threeContainer.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    if (threeContainer && THREE) {
      const width = threeContainer.clientWidth || window.innerWidth;
      const height = threeContainer.clientHeight || window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      threeContainer.appendChild(renderer.domElement);

      const geometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
      const material = new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.6,
      });

      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(geometry, material.clone());
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.scale.set(1 + i * 0.2, 1 + i * 0.2, 1 + i * 0.2);
        scene.add(ring);
        rings.push(ring);
      }

      camera.position.z = 5;

      const animateThree = () => {
        threeAnimationId = requestAnimationFrame(animateThree);
        rings.forEach((ring, i) => {
          ring.rotation.x += 0.005 * (i + 1);
          ring.rotation.y += 0.003 * (i + 1);
          ring.material.opacity = 0.4 + Math.sin(Date.now() * 0.001 + i) * 0.2;
        });
        renderer.render(scene, camera);
      };

      threeAnimationId = requestAnimationFrame(animateThree);
      window.addEventListener("resize", handleResize);
    }

    // Cleanup everything on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      cancelAnimationFrame(shaderAnimationId);
      cancelAnimationFrame(threeAnimationId);

      // Clean up WebGL resources
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);

      // Clean up ThreeJS resources
      if (renderer) {
        if (threeContainer && renderer.domElement) {
          threeContainer.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      if (rings.length > 0) {
        rings.forEach((ring) => {
          ring.geometry.dispose();
          ring.material.dispose();
        });
      }
    };
  }, []);

  return (
    <>
      {/* shader canvas */}
      <div
        className="fixed inset-0 w-full h-full"
        id="background-container"
        style={{ display: "block", zIndex: -1 }}
      >
        <canvas
          ref={shaderCanvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </div>

      {/* threejs canvas container */}
      <div
        className="fixed inset-0 w-full h-full bg-transparent"
        style={{ display: "block", pointerEvents: "none", zIndex: -1 }}
      >
        <div ref={threejsContainerRef} className="w-full h-full" />
      </div>
    </>
  );
}
