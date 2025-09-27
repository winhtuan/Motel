import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function PanoramaViewer() {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry, data || "");
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    mount.innerHTML = "";

    addDebugLog("🚀 Khởi tạo PanoramaViewer - Version 2");

    let scene, camera, renderer, sphere;
    let controls = { lon: 0, lat: 0 }; // Đổi cách quản lý rotation
    let isMouseDown = false,
      mouseX = 0,
      mouseY = 0;

    // Setup Three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      mount.offsetWidth / mount.offsetHeight,
      0.1,
      1000
    );

    // *** FIX QUAN TRỌNG: Set camera position ban đầu ***
    camera.position.set(0, 0, 0.1); // Không để ở (0,0,0) chính xác
    addDebugLog("✅ Camera position:", camera.position);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.offsetWidth, mount.offsetHeight);
    renderer.setClearColor(0x000000);
    mount.appendChild(renderer.domElement);

    // Geometry - KHÔNG flip, dùng bán kính lớn
    const geometry = new THREE.SphereGeometry(100, 32, 32); // Giảm segments để test
    addDebugLog("✅ SphereGeometry created - NO FLIP");

    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
      "/assets/alma.jpg",
      (texture) => {
        addDebugLog("✅ Texture loaded:", {
          width: texture.image.width,
          height: texture.image.height,
          flipY: texture.flipY,
        });

        // *** TEST MỌI MATERIAL CONFIG ***
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide, // Bắt đầu với BackSide
        });

        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Global reference
        window.testSphere = sphere;
        window.testCamera = camera;
        window.testScene = scene;

        addDebugLog("✅ Sphere added to scene");
        addDebugLog("🔍 Initial sphere check:", {
          visible: sphere.visible,
          position: sphere.position,
          scale: sphere.scale,
          materialSide: sphere.material.side,
          hasTexture: !!sphere.material.map,
        });

        setIsLoading(false);
        animate();
      },
      undefined,
      (err) => {
        addDebugLog("❌ Texture load error:", err);
        setError(`Lỗi tải texture: ${err.message}`);
        setIsLoading(false);
      }
    );

    function animate() {
      requestAnimationFrame(animate);

      // *** FIX CAMERA ORIENTATION ***
      const phi = THREE.MathUtils.degToRad(90 - controls.lat);
      const theta = THREE.MathUtils.degToRad(controls.lon);

      // Target point on sphere surface
      const target = new THREE.Vector3();
      target.x = Math.sin(phi) * Math.cos(theta);
      target.y = Math.cos(phi);
      target.z = Math.sin(phi) * Math.sin(theta);

      camera.lookAt(target);
      renderer.render(scene, camera);
    }

    // Mouse controls
    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseMove = (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      controls.lon -= deltaX * 0.5;
      controls.lat += deltaY * 0.5;
      controls.lat = Math.max(-85, Math.min(85, controls.lat));

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    // Touch controls
    const onTouchStart = (event) => {
      if (event.touches.length === 1) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
        isMouseDown = true;
      }
    };

    const onTouchMove = (event) => {
      if (!isMouseDown || event.touches.length !== 1) return;
      event.preventDefault();

      const deltaX = event.touches[0].clientX - mouseX;
      const deltaY = event.touches[0].clientY - mouseY;

      controls.lon -= deltaX * 0.5;
      controls.lat += deltaY * 0.5;
      controls.lat = Math.max(-85, Math.min(85, controls.lat));

      mouseX = event.touches[0].clientX;
      mouseY = event.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isMouseDown = false;
    };

    // Event listeners
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart);
    renderer.domElement.addEventListener("touchmove", onTouchMove);
    renderer.domElement.addEventListener("touchend", onTouchEnd);

    addDebugLog("✅ Event listeners added");

    // Cleanup
    return () => {
      addDebugLog("🧹 Cleanup...");
      if (sphere) {
        sphere.geometry.dispose();
        if (sphere.material.map) sphere.material.map.dispose();
        sphere.material.dispose();
        scene.remove(sphere);
      }
      if (renderer) {
        renderer.dispose();
        if (
          mount &&
          renderer.domElement &&
          mount.contains(renderer.domElement)
        ) {
          mount.removeChild(renderer.domElement);
        }
      }
      // Cleanup global references
      delete window.testSphere;
      delete window.testCamera;
      delete window.testScene;
    };
  }, []);

  // Test functions
  const testSide = (side, sideName) => {
    if (window.testSphere && window.testSphere.material) {
      window.testSphere.material.side = side;
      addDebugLog(`🔄 Switched to ${sideName} (${side})`);
    }
  };

  const testWireframe = () => {
    if (window.testSphere && window.testSphere.material) {
      window.testSphere.material.wireframe =
        !window.testSphere.material.wireframe;
      addDebugLog(`🔄 Wireframe: ${window.testSphere.material.wireframe}`);
    }
  };

  const testCameraPosition = () => {
    if (window.testCamera) {
      const positions = [
        { x: 0, y: 0, z: 0.1 },
        { x: 0, y: 0, z: -0.1 },
        { x: 0.1, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 },
      ];
      const current = positions[Math.floor(Math.random() * positions.length)];
      window.testCamera.position.set(current.x, current.y, current.z);
      addDebugLog(`🔄 Camera position: ${JSON.stringify(current)}`);
    }
  };

  const resetCamera = () => {
    if (window.testCamera) {
      window.testCamera.position.set(0, 0, 0.1);
      addDebugLog("🔄 Reset camera to (0, 0, 0.1)");
    }
  };

  return (
    <div style={{ width: "900px", margin: "40px auto" }}>
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#000",
          position: "relative",
        }}
      />

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            background: "rgba(0,0,0,0.8)",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          🔄 Đang tải...
        </div>
      )}

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            background: "#2a1f1f",
            padding: "10px",
            borderRadius: "6px",
            marginTop: "10px",
          }}
        >
          ❌ {error}
        </div>
      )}
    </div>
  );
}
