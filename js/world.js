import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { BlockType, makeMaterialFor } from './blocks.js';

const BLOCK_SIZE = 1;
const HALF = BLOCK_SIZE / 2;

export class World {
  constructor(scene) {
    this.scene = scene;
    this.blocks = new Map();
    this.geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  key(x, y, z) { return `${x},${y},${z}`; }

  hasBlock(x, y, z) {
    return this.blocks.has(this.key(x, y, z));
  }

  addBlock(x, y, z, type) {
    const k = this.key(x, y, z);
    if (this.blocks.has(k)) return;

    const material = makeMaterialFor(type);
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.position.set(
      x * BLOCK_SIZE + HALF,
      y * BLOCK_SIZE + HALF,
      z * BLOCK_SIZE + HALF
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { block: { x, y, z, type } };

    this.scene.add(mesh);
    this.blocks.set(k, { mesh, type });
  }

  removeBlock(x, y, z) {
    const k = this.key(x, y, z);
    const entry = this.blocks.get(k);
    if (!entry) return;
    this.scene.remove(entry.mesh);
    entry.mesh.geometry.dispose();
    if (entry.mesh.material?.dispose) entry.mesh.material.dispose();
    this.blocks.delete(k);
  }

  raycastToBlock(raycaster) {
    const intersects = raycaster.intersectObjects(
      Array.from(this.blocks.values()).map(e => e.mesh),
      false
    );
    if (intersects.length === 0) return null;
    const hit = intersects[0];
    const { x, y, z, type } = hit.object.userData.block;
    return { x, y, z, face: hit.face, point: hit.point, type, object: hit.object };
  }

  heightAt(x, z) {
    const s = 0.08;
    const h =
      Math.sin(x * s) * 2.0 +
      Math.cos(z * s * 0.8) * 1.6 +
      Math.sin((x + z) * s * 0.5) * 1.2;
    const base = 8;
    return Math.floor(base + h);
  }

  generateChunk(cx, cz, size = 16) {
    const startX = cx * size;
    const startZ = cz * size;

    for (let dz = 0; dz < size; dz++) {
      for (let dx = 0; dx < size; dx++) {
        const x = startX + dx;
        const z = startZ + dz;
        const h = this.heightAt(x, z);

        for (let y = 0; y <= h; y++) {
          let type = BlockType.DIRT;
          if (y === h) {
            type = h < 7 ? BlockType.SAND : BlockType.GRASS;
          } else if (y < h - 3) {
            type = BlockType.STONE;
          }
          this.addBlock(x, y, z, type);
        }
      }
    }
  }
}
