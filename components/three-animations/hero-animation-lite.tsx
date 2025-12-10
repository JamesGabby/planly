// components/hero-animation-lite.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function HeroAnimationLite() {
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
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Theme colors
    const primaryColor = new THREE.Color("#3b82f6");
    const secondaryColor = new THREE.Color("#8b5cf6");

    // Create nodes (knowledge points)
    const nodeCount = 80;
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);

    for (let i = 0; i < nodeCount; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? primaryColor : secondaryColor,
        transparent: true,
        opacity: 0.8,
      });

      const node = new THREE.Mesh(nodeGeometry, material);

      // Random position in a sphere
      const radius = 20 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      node.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      nodePositions.push(node.position.clone());
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      );

      nodes.push(node);
      scene.add(node);
    }

    // Create connections between nearby nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.2,
    });

    const connections: THREE.Line[] = [];
    const maxConnections = 150;
    let connectionCount = 0;

    for (let i = 0; i < nodeCount && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < nodeCount && connectionCount < maxConnections; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < 15) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position,
          ]);
          const line = new THREE.Line(geometry, lineMaterial.clone());
          connections.push(line);
          scene.add(line);
          connectionCount++;
        }
      }
    }

    // Central glowing sphere
    const centralGeometry = new THREE.IcosahedronGeometry(3, 2);
    const centralMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.6,
      wireframe: true,
    });
    const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
    scene.add(centralSphere);

    // Inner glow
    const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Rotate central sphere
      centralSphere.rotation.x = time * 0.2;
      centralSphere.rotation.y = time * 0.3;

      // Pulse glow
      const pulse = Math.sin(time * 2) * 0.2 + 1;
      glow.scale.set(pulse, pulse, pulse);

      // Animate nodes
      nodes.forEach((node, i) => {
        // Gentle floating motion
        node.position.x += nodeVelocities[i].x;
        node.position.y += nodeVelocities[i].y;
        node.position.z += nodeVelocities[i].z;

        // Boundary check - keep within sphere
        const dist = node.position.length();
        if (dist > 40 || dist < 10) {
          nodeVelocities[i].multiplyScalar(-1);
        }

        // Pulse size
        const scale = 1 + Math.sin(time * 2 + i) * 0.2;
        node.scale.set(scale, scale, scale);
      });

      // Update connection lines
      let lineIndex = 0;
      for (let i = 0; i < nodeCount && lineIndex < connections.length; i++) {
        for (let j = i + 1; j < nodeCount && lineIndex < connections.length; j++) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);
          if (distance < 15) {
            const positions = connections[lineIndex].geometry.attributes.position
              .array as Float32Array;
            positions[0] = nodes[i].position.x;
            positions[1] = nodes[i].position.y;
            positions[2] = nodes[i].position.z;
            positions[3] = nodes[j].position.x;
            positions[4] = nodes[j].position.y;
            positions[5] = nodes[j].position.z;
            connections[lineIndex].geometry.attributes.position.needsUpdate = true;

            // Fade based on distance
            (connections[lineIndex].material as THREE.LineBasicMaterial).opacity =
              0.3 * (1 - distance / 15);

            lineIndex++;
          }
        }
      }

      // Camera follows mouse slightly
      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      // Rotate entire scene slowly
      scene.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}