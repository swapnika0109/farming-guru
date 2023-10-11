import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import image from '../assets/textures/land.jpg';

const Land = () => {
  const scene = useRef(null);
  const camera = useRef(null);
  const renderer = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    // Set up the scene
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.9, 1000);
    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.current.domElement);

    // Calculate the size of each flat box based on the total area and the number of boxes
    const totalArea = 1800; // sqft
    const numberOfBoxes = 5;
    const boxSize = Math.sqrt(totalArea / numberOfBoxes);

    const totalWidth = numberOfBoxes * boxSize / 100;
    const totalHeight = numberOfBoxes * boxSize / 100;
    const texture = new THREE.TextureLoader().load(image);

    // Create land geometry and apply texture
    const landGeometry = new THREE.PlaneGeometry(totalWidth, totalHeight, 2, 2);
    const landMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.5 });
    const land = new THREE.Mesh(landGeometry, landMaterial);
    scene.current.add(land); // Add the land to the scene

    // Function to create and add boxes to the land
    const createFlatBox = (position, parent) => {
      const boxGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -0.03, -0.02, 0, // bottom-left
        totalWidth / 10, -0.02, 0, // bottom-right
        totalWidth / 10, totalHeight / 10, 0, // top-right
        -0.03, totalHeight / 10, 0, // top-left
      ]);

      const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
      boxGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
      boxGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      const boxMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7,
      });

      const flatBox = new THREE.Mesh(boxGeometry, boxMaterial);
      flatBox.position.copy(position);
      parent.add(flatBox); // Add the block as a child of the parent (land)

      flatBox.userData.onClick = () => {
        console.log('Box clicked!');
      };
    };

    let previousX = 0.0;
    let previousY = 0.0;

    // Calculate the positions for the flat boxes based on the land's dimensions
    for (let i = 0; i < numberOfBoxes; i++) {
      for (let j = 0; j < numberOfBoxes; j++) {
        const spacing = totalWidth / numberOfBoxes;
        const position = new THREE.Vector3(
          (i * spacing - totalWidth / 2) + spacing / 2,
          (j * spacing - totalHeight / 2) + spacing / 2,
          0.07
        );
        createFlatBox(position, land); // Pass the land as the parent
      }
    }

    // Position the camera
    camera.current.position.z = 5;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.current.render(scene.current, camera.current);
    };

    animate();

    // Add click event listener to the renderer
    renderer.current.domElement.addEventListener('click', onClick);

    // Clean up on unmount
    return () => {
      document.body.removeChild(renderer.current.domElement);
    };
  }, []);

  const onClick = (event) => {
    // Calculate mouse position in normalized device coordinates
    const rect = renderer.current.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to check for intersections
    raycaster.current.setFromCamera(mouse.current, camera.current);
    const intersects = raycaster.current.intersectObjects(scene.current.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData.onClick) {
        object.userData.onClick();
      }
    }
  };

  return null;
};

export default Land;
