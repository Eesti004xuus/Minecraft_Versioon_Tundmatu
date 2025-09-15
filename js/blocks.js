import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const BlockType = {
  GRASS: 0,
  DIRT: 1,
  STONE: 2,
  SAND: 3,
  WOOD: 4,
};

export const BLOCK_ORDER = [
  BlockType.GRASS,
  BlockType.DIRT,
  BlockType.STONE,
  BlockType.SAND,
  BlockType.WOOD,
];

const loader = new THREE.TextureLoader();
function tex(name) {
  const t = loader.load(`assets/textures/${name}.png`);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestMipMapNearestFilter;
  return t;
}

export function makeMaterialFor(type) {
  switch (type) {
    case BlockType.GRASS:
      return new THREE.MeshStandardMaterial({ map: tex('grass') });
    case BlockType.DIRT:
      return new THREE.MeshStandardMaterial({ map: tex('dirt') });
    case BlockType.STONE:
      return new THREE.MeshStandardMaterial({ map: tex('stone') });
    case BlockType.SAND:
      return new THREE.MeshStandardMaterial({ map: tex('sand') });
    case BlockType.WOOD:
      return new THREE.MeshStandardMaterial({ map: tex('wood') });
    default:
      return new THREE.MeshStandardMaterial({ color: 0xffffff });
  }
}
