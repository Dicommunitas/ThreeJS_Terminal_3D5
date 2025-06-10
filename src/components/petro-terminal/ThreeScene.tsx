"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { TerminalComponentData, SceneSettings, TerminalComponentType } from '@/types/terminal';
import { initialTerminalComponents } from '@/config/terminal-data';

interface ThreeSceneProps {
  onComponentSelect: (data: TerminalComponentData | null) => void;
  sceneSettings: SceneSettings;
  selectedComponentId?: string | null;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onComponentSelect, sceneSettings, selectedComponentId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  
  const [highlightedObject, setHighlightedObject] = useState<THREE.Mesh | null>(null);
  const originalMaterialsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());

  const highlightMaterial = new THREE.MeshStandardMaterial({ 
    emissive: '#34B4A3', // Teal accent color
    emissiveIntensity: 0.7,
    roughness: 0.5,
    metalness: 0.2,
  });

  const createTerminalComponent = useCallback((scene: THREE.Scene, data: TerminalComponentData, position: THREE.Vector3): THREE.Mesh => {
    let geometry: THREE.BufferGeometry;
    const material = new THREE.MeshStandardMaterial({ color: data.color || '#FFFFFF', roughness: 0.6, metalness: 0.3 });

    switch (data.type) {
      case 'Tank':
        geometry = new THREE.CylinderGeometry(5, 5, 8, 32);
        break;
      case 'Pipeline':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 16);
        break;
      case 'LoadingDock':
        geometry = new THREE.BoxGeometry(10, 2, 15);
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1); // Default fallback
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.userData = data; // Store component data
    data.meshUuid = mesh.uuid; // Link data back to mesh
    scene.add(mesh);
    return mesh;
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282C34); // Dark gray background
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(15, 15, 25);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, sceneSettings.isNightMode ? 0.2 : 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, sceneSettings.isNightMode ? 0.3 : 1.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x404040, roughness: 0.8, metalness: 0.2 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create components
    createTerminalComponent(scene, initialTerminalComponents[0], new THREE.Vector3(-10, 4, 0)); // Tank 1
    createTerminalComponent(scene, initialTerminalComponents[1], new THREE.Vector3(10, 4, 0));  // Tank 2
    const pipelineMesh = createTerminalComponent(scene, initialTerminalComponents[2], new THREE.Vector3(0, 0.5, 5)); // Pipeline
    pipelineMesh.rotation.z = Math.PI / 2; // Lay pipeline horizontally
    createTerminalComponent(scene, initialTerminalComponents[3], new THREE.Vector3(0, 1, -15)); // Loading Dock

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (currentMount && rendererRef.current && cameraRef.current) {
        cameraRef.current.aspect = currentMount.clientWidth / currentMount.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Click handler for object selection
    const handleClick = (event: MouseEvent) => {
      if (!currentMount || !cameraRef.current || !sceneRef.current) return;

      const rect = currentMount.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        const firstIntersectedObject = intersects[0].object;
        if (firstIntersectedObject instanceof THREE.Mesh && firstIntersectedObject.userData && firstIntersectedObject.userData.id) {
          onComponentSelect(firstIntersectedObject.userData as TerminalComponentData);
        } else {
          onComponentSelect(null); // Clicked on something not a component (e.g. ground)
        }
      } else {
        onComponentSelect(null); // Clicked on empty space
      }
    };
    currentMount.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('click', handleClick);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current?.dispose();
      rendererRef.current = null;
      originalMaterialsRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTerminalComponent]); // Removed onComponentSelect from deps to avoid re-init on parent state change

  // Handle highlighting based on selectedComponentId from parent
   useEffect(() => {
    if (!sceneRef.current) return;

    // Restore previous highlighted object
    if (highlightedObject) {
      const originalMaterial = originalMaterialsRef.current.get(highlightedObject.uuid);
      if (originalMaterial) {
        highlightedObject.material = originalMaterial;
      }
      setHighlightedObject(null);
      originalMaterialsRef.current.delete(highlightedObject.uuid);
    }

    if (selectedComponentId) {
      const objectToHighlight = sceneRef.current.children.find(
        (child): child is THREE.Mesh => 
          child instanceof THREE.Mesh && child.userData?.id === selectedComponentId
      );

      if (objectToHighlight) {
        originalMaterialsRef.current.set(objectToHighlight.uuid, objectToHighlight.material);
        objectToHighlight.material = highlightMaterial;
        setHighlightedObject(objectToHighlight);
      }
    }
  }, [selectedComponentId, highlightMaterial]);


  // Update lighting on scene settings change
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const ambientLight = scene.getObjectByProperty('type', 'AmbientLight') as THREE.AmbientLight;
    const directionalLight = scene.getObjectByProperty('type', 'DirectionalLight') as THREE.DirectionalLight;

    if (ambientLight) {
      ambientLight.intensity = sceneSettings.isNightMode ? 0.15 : 0.5;
    }
    if (directionalLight) {
      directionalLight.intensity = sceneSettings.isNightMode ? 0.25 : 0.8;
      directionalLight.color.set(sceneSettings.isNightMode ? 0xaaaaff : 0xffffff); // Cooler light at night
    }
  }, [sceneSettings]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
