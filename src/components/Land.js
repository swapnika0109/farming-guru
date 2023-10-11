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
    camera.current = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.9, 1000);
    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.current.domElement);

    // Create land geometry and apply texture
    const landGeometry = new THREE.PlaneGeometry(3, 3, 2, 2);
    const texture = new THREE.TextureLoader().load(image);
    const landMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const land = new THREE.Mesh(landGeometry, landMaterial);
    land.rotation.set(-0.5, 0.4, 0);
    scene.current.add(land);

    // Calculate the size of each flat box based on the total area and the number of boxes
        const totalArea = 1800; // sqft
        const numberOfBoxes = 15;
        const boxSize = Math.sqrt(totalArea / numberOfBoxes);

    // Create and add boxes to the land
    const createFlatBox = (position) => {
      const boxGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -0.03, -0.02, 0, // bottom-left
         boxSize/100, -0.02, 0, // bottom-right
         boxSize/100,  boxSize/100, 0, // top-right
        -0.03,  boxSize/100, 0, // top-left
      ]);

      const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
      boxGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
      boxGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      const boxMaterial = new THREE.MeshBasicMaterial({
      map: texture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });

      const flatBox = new THREE.Mesh(boxGeometry, boxMaterial);
      flatBox.position.copy(position);
      land.add(flatBox);

      // Store a reference to the flatBox object for raycasting
      flatBox.userData.onClick = () => {
        // Handle click logic here
        console.log('Box clicked!');
      };
    };

        let previousX = 0.0;
        let previousY = 0.0;

        // Calculate the positions for the 5 flat boxes evenly
for (let i = 0; i < numberOfBoxes; i++) {
  for (let j = 0; j < numberOfBoxes; j++) {
    const spacing = 3 / numberOfBoxes; // Adjust the spacing as needed
    const position = new THREE.Vector3(
      (i * spacing - 1) + spacing / 2, // X position
      (j * spacing - 1) + spacing / 2, // Y position
      0.07 // Z position (adjust as needed)
    ).add(land.position); // Adjust the position relative to land
    createFlatBox(position);
  }
}

      // Calculate the positions for the 5 flat boxes evenly
//        for (let i = 0; i < numberOfBoxes; i++) {
//          if(previousX !== 0.0){
//             previousX = previousX + boxSize/100 + numberOfBoxes/100;
//             previousY = 0.0;
//          }else{
//           previousX = (i - numberOfBoxes) * boxSize/100;
//          }
//          for (let j = 0; j < numberOfBoxes; j++) {
//            if(previousY === 0.0){
//                previousY = (j - numberOfBoxes) * boxSize/100;
//            }
//            else{
//                previousY = previousY + boxSize/100 + numberOfBoxes/100;
//            }
//
//            const position = new THREE.Vector3(
//              previousX, // X position
//              previousY, // Y position
//              0.07 // Z position (adjust as needed)
//            ).add(land.position); // Adjust the position relative to land
//            createFlatBox(position);
//
//          }
//
//        }


//    createFlatBox(new THREE.Vector3(-0.95, -0.96, 0.07).add(land.position)); // Adjust the position relative to land
//    createFlatBox(new THREE.Vector3(-0.84, -0.96, 0.07).add(land.position)); // Adjust the position relative to land

    // Position the camera
    camera.current.position.z = 5;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the land
      land.rotation.z += 0.00022;

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
