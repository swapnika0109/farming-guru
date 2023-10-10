import React, { useEffect } from 'react';
import * as THREE from 'three';
import image from '../assets/textures/land.jpg';

const Land = () => {
  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.9, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create land geometry and apply texture
    const landGeometry = new THREE.PlaneGeometry(2, 2, 2, 2); // Adjust the size as needed
    const texture = new THREE.TextureLoader().load(image); // Path to your image
    const landMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const land = new THREE.Mesh(landGeometry, landMaterial);
    land.rotation.set(-0.5, -0.1, 0.8);
    scene.add(land);

    // Create block geometry and material
    const blockGeometry = new THREE.PlaneGeometry(0.1, 0.1); // Adjust size as needed
    const blockMaterial  = new THREE.LineBasicMaterial( {
                          	color: 0xffffff,
                          	linewidth: 1,
                          	linecap: 'round', //ignored by WebGLRenderer
                          	linejoin:  'round', //ignored by WebGLRenderer
                          	transparent: true,  // Enable transparency
                              opacity: 0.5
                          } );

    // Create and position two blocks
    const block1 = new THREE.Mesh(blockGeometry, blockMaterial);
    block1.position.set(0.2, 0.2, 0.1); // Adjust the position on the land
     land.add(block1);
    const block3 = new THREE.Mesh(blockGeometry, blockMaterial);
        block3.position.set(0.4, 0.6, 0.1); // Adjust the position on the land
    land.add(block3);

    const block2 = new THREE.Mesh(blockGeometry, blockMaterial);
    block2.position.set(-0.2, -0.2, 0.1); // Adjust the position on the land
    land.add(block2);

//    const plane = new THREE.Plane( new THREE.Vector3( 1, 1, 0.2 ), 3 );
//    const helper = new THREE.PlaneHelper( plane, 1, 0xffff00 );
//    scene.add( helper );

    // Position the camera
    camera.position.z = 5;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the land
      land.rotation.z += 0.0022;

      renderer.render(scene, camera);
    };

    animate();

    // Add click event listeners to blocks for interaction
    const handleBlockClick = (block) => {
      // Implement logic for block selection
      console.log(`Selected block: ${block.name}`);
    };

    block1.name = 'Block 1';
    block2.name = 'Block 2';

    block1.addEventListener('click', () => handleBlockClick(block1));
    block2.addEventListener('click', () => handleBlockClick(block2));

    // Clean up on unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default Land;
