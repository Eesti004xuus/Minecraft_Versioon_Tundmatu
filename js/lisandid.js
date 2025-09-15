// lisandid.js – kogumik ägedaid lisasid sinu plokkmängule

// 1. Päriselt voolav vesi (lihtsustatud versioon)
export function lisaVoolavVesi(world) {
  // world on sinu mängu grid või kaart
  // Näide: iga kaadri uuenduses liiguta vett alla või külgedele
  for (let y = world.height - 2; y >= 0; y--) {
    for (let x = 0; x < world.width; x++) {
      if (world.getBlock(x, y) === 'water') {
        if (world.getBlock(x, y + 1) === 'air') {
          world.setBlock(x, y, 'air');
          world.setBlock(x, y + 1, 'water');
        } else {
          if (Math.random() < 0.5 && world.getBlock(x - 1, y) === 'air') {
            world.setBlock(x, y, 'air');
            world.setBlock(x - 1, y, 'water');
          } else if (world.getBlock(x + 1, y) === 'air') {
            world.setBlock(x, y, 'air');
            world.setBlock(x + 1, y, 'water');
          }
        }
      }
    }
  }
}

// 2. Uus plokk: helendav kivi
export function lisaHelendavKivi(world) {
  world.registerBlock('glowstone', {
    color: '#FFD700',
    lightLevel: 15,
    solid: true
  });
}

// 3. Liikuvad platvormid
export function lisaLiikuvadPlatvormid(world) {
  const platvormid = [];
  world.registerBlock('moving_platform', { color: '#888', solid: true });

  // Näidisplatvorm
  platvormid.push({ x: 10, y: 20, dir: 1 });

  world.onTick(() => {
    platvormid.forEach(p => {
      world.setBlock(p.x, p.y, 'air');
      p.x += p.dir;
      if (p.x <= 5 || p.x >= 15) p.dir *= -1;
      world.setBlock(p.x, p.y, 'moving_platform');
    });
  });
}

// 4. Juhuslikud sündmused (meteoorisadu)
export function lisaMeteoorid(world) {
  world.onTick(() => {
    if (Math.random() < 0.002) {
      const x = Math.floor(Math.random() * world.width);
      for (let y = 0; y < world.height; y++) {
        if (world.getBlock(x, y) === 'air') {
          world.setBlock(x, y, 'fire');
          break;
        }
      }
    }
  });
}

// 5. Kiire käivitamine
export function aktiveeriKoik(world) {
  lisaVoolavVesi(world);
  lisaHelendavKivi(world);
  lisaLiikuvadPlatvormid(world);
  lisaMeteoorid(world);
}
