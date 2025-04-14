import { useEffect, useRef } from "react";
import * as THREE from "three";
import React from "react";

const ThreeBackground = () => {
  const canvasRef = useRef();
  const rafId = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    // Load coin textures
    const textureLoader = new THREE.TextureLoader();
    const coinTextures = [
      textureLoader.load("/ethereum.png"),
      textureLoader.load("/solana.png"),
      textureLoader.load("/bitcoin.png"),
    ];

    // Vertex shader
    const vertexShader = `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader for iridescence
    const fragmentShader = `
      uniform sampler2D map;
      uniform float time;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        // Sample coin texture
        vec4 texColor = texture2D(map, vUv);

        // Simple iridescence based on position and time
        vec3 viewDir = normalize(vPosition - cameraPosition);
        float iridescence = sin(time + vPosition.x * 0.1 + vPosition.y * 0.1) * 0.5 + 0.5;
        vec3 iridescentColor = vec3(
          sin(iridescence * 6.28 + 0.0) * 0.5 + 0.5,
          sin(iridescence * 6.28 + 2.0) * 0.5 + 0.5,
          sin(iridescence * 6.28 + 4.0) * 0.5 + 0.5
        );

        // Blend iridescence with texture (multiply for subtle effect)
        vec3 finalColor = texColor.rgb * (iridescentColor * 0.3 + 0.7);
        float alpha = texColor.a * 0.8; // Respect PNG transparency

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Create sprites with custom shader
    const sprites = [];
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;

      const spriteMaterial = new THREE.ShaderMaterial({
        uniforms: {
          map: {
            value:
              coinTextures[Math.floor(Math.random() * coinTextures.length)],
          },
          time: { value: 0.0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(positions[i], positions[i + 1], positions[i + 2]);
      sprite.scale.set(2, 2, 1); // Coin size
      scene.add(sprite);
      sprites.push(sprite);
    }

    camera.position.z = 30;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      rafId.current = requestAnimationFrame(animate);

      // Update sprite positions and time uniform
      const time = performance.now() * 0.001;
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(time + positions[i]) * 0.01;
        positions[i + 1] += Math.cos(time + positions[i + 1]) * 0.01;
        sprites[i / 3].position.set(
          positions[i],
          positions[i + 1],
          positions[i + 2]
        );
        sprites[i / 3].material.uniforms.time.value = time;
      }

      camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId.current) cancelAnimationFrame(rafId.current);
      } else {
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      renderer.dispose();
      coinTextures.forEach((texture) => texture.dispose());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 z-0 w-full h-full"
    />
  );
};

export default ThreeBackground;
