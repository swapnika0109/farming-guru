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
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.9, 1000);
    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setClearColor(0xFFFFFF)
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.current.domElement);

    let totalWidth = 5; // Initial size
    let totalHeight = 5; // Initial size

   // const totalArea = totalWidth * totalHeight;
    const numberOfBoxes = 5;
    const texture = new THREE.TextureLoader().load(image);

    const spacingX = totalWidth / numberOfBoxes;
    const spacingY = totalHeight / numberOfBoxes;

    const createFlatBox = (position, parent, block, label) => {
      const boxGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -0.03, -0.02, 0, // bottom-left
        spacingX, -0.02, 0, // bottom-right
        spacingX, spacingY, 0, // top-right
        -0.03, spacingY, 0, // top-left
      ]);


      const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
      boxGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
      boxGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const originalColor = new THREE.Color(0X879474)
      const boxMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5,
        color: originalColor,
      });

  //const boxMaterial = new THREE.MeshBasicMaterial({ map: label === 'SOLD' ? texture1.current : texture.current });

  const flatBox = new THREE.Mesh(boxGeometry, boxMaterial);
  flatBox.position.copy(position);
  parent.add(flatBox);


    // Create a 2D canvas element for the text
     const canvas = document.createElement('canvas');
     const context = canvas.getContext('2d');
     canvas.width = 129; // Adjust the width as needed
     canvas.height = 64; // Adjust the height as needed
     context.font = '18px Arial';
     context.fillStyle = label === 'SOLD' ? 'red' : 'black';
     context.textAlign = 'center'; // Center-align the text
     context.textBaseline = 'middle'; // Vertically center-align the text
     context.fillText(label, canvas.width / 2, canvas.height / 2); // Center-align the text

     // Create a texture from the canvas
     const canvasTexture = new THREE.CanvasTexture(canvas);
     canvasTexture.minFilter = THREE.LinearFilter;

     // Create a material with the canvas texture for the text
     const textMaterial = new THREE.MeshBasicMaterial({ map: canvasTexture, transparent: true, side: THREE.DoubleSide });
     const textGeometry = new THREE.PlaneGeometry(spacingX, spacingY);
     const textMesh = new THREE.Mesh(textGeometry, textMaterial);

     // Position the text mesh on top of the flat box
     textMesh.position.copy(new THREE.Vector3(
                                      position.x + spacingX/2,
                                      position.y + spacingY/2,
                                      0.07
                                    )); // Adjust the position
     parent.add(textMesh);



       // Create a flat box object with custom properties
        const flatBoxObject = {
          mesh: flatBox, // The THREE.Mesh instance
          name: block, // Custom name for the box
          label: label,
          isSelected: false// Additional custom data
        };

 flatBox.userData.onClick = () => {
    console.log('Box clicked!');
    if( label !== 'SOLD'){
        // Toggle selection
        if (flatBoxObject.isSelected) {
          unselectBlock(flatBoxObject);
        } else {
          selectBlock(flatBoxObject);
        }
    }
  };

   //Mouse enter handler to change color on hover
  flatBox.userData.onMouseEnter = () => {
    if (!flatBoxObject.isSelected) {
      flatBox.material.color.set(originalColor); // Change color to red on hover
    }
  };


  // Custom function to select a block
    const selectBlock = (block) => {
      block.isSelected = true;
      block.mesh.material.color.set(0Xc8c8c8); // Change color to blue when selected
    };

    // Custom function to unselect a block
    const unselectBlock = (block) => {
      block.isSelected = false;
      if (block.mesh.userData.onMouseEnter) {
       block.mesh.userData.onMouseEnter();
      }
    };

    };

    // Create land geometry and apply texture
    const landGeometry = new THREE.PlaneGeometry(totalWidth + 0.4, totalHeight + 0.4, 2, 2);
    const landMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.5 });
    const land = new THREE.Mesh(landGeometry, landMaterial);
    //land.rotation.set(0, 0, 0.9);
    scene.current.add(land);


    for (let i = 0; i < numberOfBoxes; i++) {
      for (let j = 0; j < numberOfBoxes; j++) {

        const position = new THREE.Vector3(
          (i * spacingX - totalWidth / 2),
          (j * spacingY - totalHeight / 2),
          0.07
        );
        createFlatBox(position, land, i+j, 'SOLD'); // Pass the land as the parent
      }
    }


    // Position the camera
    camera.current.position.z = 5;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      // Rotate the land
      //land.rotation.z += 0.002;
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
