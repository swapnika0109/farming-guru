import React, {  useEffect } from 'react';
import * as THREE from 'three';
import image from '../assets/textures/land.jpg'

const Land = () => {


  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.9, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create land geometry and apply texture
    const geometry = new THREE.PlaneGeometry(2,2,2,2); // Adjust the size as needed
    const texture = new THREE.TextureLoader().load(image); // Path to your image
    const material = new THREE.MeshBasicMaterial({  map: texture });
    const land = new THREE.Mesh(geometry, material);
    land.rotation.set(-0.5, -0.1, 0.8);
    scene.add(land);

    // Position the camera
    camera.position.z = 5;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the land
      land.rotation.z += 0.0022;
//      land.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up on unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default Land;
