import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface ThreeDBarChartProps {
  data: number[];
  labels: string[];
  width?: number;
  height?: number;
  rotate?: boolean; // optional rotation
}

export function ThreeDBarChart({
  data,
  labels,
  width = 600,
  height = 400,
  rotate = true,
}: ThreeDBarChartProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(10, 15, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(ambientLight, directionalLight);

    // Bars
    const maxData = Math.max(...data);
    const barWidth = 1;
    const gap = 0.5;
    const totalWidth = data.length * (barWidth + gap);
    const bars: THREE.Mesh[] = [];

    data.forEach((value, index) => {
      const barHeight = (value / maxData) * 10;
      const geometry = new THREE.BoxGeometry(barWidth, barHeight, barWidth);
      const colorHue = (index / data.length) * 0.4;
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(colorHue, 0.7, 0.5),
      });
      const bar = new THREE.Mesh(geometry, material);

      // Center bars
      bar.position.set(index * (barWidth + gap) - totalWidth / 2 + barWidth / 2, barHeight / 2, 0);
      scene.add(bar);
      bars.push(bar);
    });

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Animation
    const animate = () => {
      if (rotate) scene.rotation.y += 0.003;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      bars.forEach((bar) => {
        bar.geometry.dispose();
        if (Array.isArray(bar.material)) {
          bar.material.forEach((m) => m.dispose());
        } else {
          bar.material.dispose();
        }
        scene.remove(bar);
      });
      scene.remove(gridHelper);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [data, width, height, rotate]);

  return <div ref={mountRef} style={{ width, height }} />;
}
