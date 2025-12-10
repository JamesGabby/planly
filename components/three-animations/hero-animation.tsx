// components/hero-animation.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Define interface for animated mesh with custom properties
interface AnimatedMesh extends THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhongMaterial> {
  orbitSpeed: number;
  orbitRadius: number;
  orbitOffset: number;
  floatSpeed: number;
  floatOffset: number;
}

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Get CSS custom properties for theming
    const getThemeColor = (cssVar: string, fallback: string): THREE.Color => {
      if (typeof window !== "undefined") {
        const style = getComputedStyle(document.documentElement);
        const value = style.getPropertyValue(cssVar).trim();
        if (value) {
          // Parse HSL values
          const match = value.match(/(\d+)\s+(\d+)%?\s+(\d+)%?/);
          if (match) {
            const h = parseInt(match[1]) / 360;
            const s = parseInt(match[2]) / 100;
            const l = parseInt(match[3]) / 100;
            return new THREE.Color().setHSL(h, s, l);
          }
        }
      }
      return new THREE.Color(fallback);
    };

    const primaryColor = getThemeColor("--primary", "#3b82f6");
    const accentColor = getThemeColor("--accent", "#6366f1");

    // Central glowing orb (represents AI/knowledge)
    const orbGeometry = new THREE.IcosahedronGeometry(3, 4);
    const orbMaterial = new THREE.MeshPhongMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
      wireframe: false,
      flatShading: true,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);

    // Wireframe overlay for the orb
    const wireframeGeometry = new THREE.IcosahedronGeometry(3.1, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireframeOrb = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeOrb);

    // Inner glowing core
    const coreGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Floating geometric shapes (representing lessons/knowledge nodes)
    const shapes: AnimatedMesh[] = [];
    const shapeGeometries: THREE.BufferGeometry[] = [
      new THREE.TetrahedronGeometry(0.8),
      new THREE.OctahedronGeometry(0.6),
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.DodecahedronGeometry(0.5),
      new THREE.TorusGeometry(0.5, 0.2, 8, 16),
    ];

    for (let i = 0; i < 50; i++) {
      const geometry = shapeGeometries[i % shapeGeometries.length];
      const material = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? primaryColor : accentColor,
        emissive: i % 2 === 0 ? primaryColor : accentColor,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.7,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material) as AnimatedMesh;

      // Position in a spherical distribution
      const radius = 8 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      // Store animation data
      mesh.orbitSpeed = 0.1 + Math.random() * 0.2;
      mesh.orbitRadius = radius;
      mesh.orbitOffset = Math.random() * Math.PI * 2;
      mesh.floatSpeed = 0.5 + Math.random() * 0.5;
      mesh.floatOffset = Math.random() * Math.PI * 2;

      shapes.push(mesh);
      scene.add(mesh);
    }

    // Particle system (knowledge particles)
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      particleSizes[i] = Math.random() * 2 + 0.5;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(particleSizes, 1)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: primaryColor,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Connection lines (neural network effect)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.15,
    });

    const connections: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>[] = [];
    for (let i = 0; i < 30; i++) {
      const points: THREE.Vector3[] = [];
      const startShape = shapes[Math.floor(Math.random() * shapes.length)];
      const endShape = shapes[Math.floor(Math.random() * shapes.length)];

      if (startShape !== endShape) {
        points.push(startShape.position.clone());
        points.push(endShape.position.clone());

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        connections.push(line);
        scene.add(line);
      }
    }

    // Rings around the orb
    const ringGeometry1 = new THREE.TorusGeometry(5, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ringGeometry2 = new THREE.TorusGeometry(6, 0.03, 16, 100);
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial.clone());
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    const ringGeometry3 = new THREE.TorusGeometry(7, 0.02, 16, 100);
    const ring3 = new THREE.Mesh(ringGeometry3, ringMaterial.clone());
    ring3.rotation.x = Math.PI / 4;
    ring3.rotation.z = Math.PI / 3;
    scene.add(ring3);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(primaryColor, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(accentColor, 1.5, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 1, 30);
    pointLight3.position.set(0, 0, 0);
    scene.add(pointLight3);

    // Mouse interaction
    interface MousePosition {
      x: number;
      y: number;
    }

    const mouse: MousePosition = { x: 0, y: 0 };
    const targetRotation: MousePosition = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent): void => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotation.x = mouse.y * 0.3;
      targetRotation.y = mouse.x * 0.3;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    const handleResize = (): void => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = (): void => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Rotate central orb
      orb.rotation.x += 0.002;
      orb.rotation.y += 0.003;

      // Wireframe rotation (opposite direction)
      wireframeOrb.rotation.x -= 0.001;
      wireframeOrb.rotation.y -= 0.002;

      // Pulse the core
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      core.scale.set(pulse, pulse, pulse);

      // Animate shapes
      shapes.forEach((shape, i) => {
        // Orbital motion
        const angle = time * shape.orbitSpeed + shape.orbitOffset;
        const floatY = Math.sin(time * shape.floatSpeed + shape.floatOffset) * 0.5;

        shape.position.x =
          shape.orbitRadius * Math.cos(angle) * Math.sin(shape.orbitOffset);
        shape.position.z =
          shape.orbitRadius * Math.sin(angle) * Math.sin(shape.orbitOffset);
        shape.position.y += floatY * 0.01;

        // Rotation
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;

        // Pulse opacity based on distance to center
        shape.material.opacity = 0.4 + Math.sin(time + i) * 0.2;
      });

      // Rotate rings
      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.002;
      ring2.rotation.x += 0.001;
      ring3.rotation.y += 0.004;

      // Rotate particles
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      // Update connection lines
      connections.forEach((line, i) => {
        const positionAttribute = line.geometry.attributes.position;
        const positions = positionAttribute.array as Float32Array;
        const startIdx = i % shapes.length;
        const endIdx = (i + 1) % shapes.length;

        positions[0] = shapes[startIdx].position.x;
        positions[1] = shapes[startIdx].position.y;
        positions[2] = shapes[startIdx].position.z;
        positions[3] = shapes[endIdx].position.x;
        positions[4] = shapes[endIdx].position.y;
        positions[5] = shapes[endIdx].position.z;

        positionAttribute.needsUpdate = true;
      });

      // Smooth camera rotation based on mouse
      scene.rotation.x += (targetRotation.x - scene.rotation.x) * 0.02;
      scene.rotation.y += (targetRotation.y - scene.rotation.y) * 0.02;

      // Light animation
      pointLight1.position.x = Math.sin(time * 0.5) * 15;
      pointLight1.position.y = Math.cos(time * 0.5) * 15;
      pointLight2.position.x = Math.cos(time * 0.3) * 15;
      pointLight2.position.z = Math.sin(time * 0.3) * 15;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((m: THREE.Material) => m.dispose());
          } else {
            material.dispose();
          }
        }
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((m: THREE.Material) => m.dispose());
          } else {
            material.dispose();
          }
        }
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((m: THREE.Material) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted]);

  // Return a placeholder during SSR
  if (!mounted) {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    />
  );
}