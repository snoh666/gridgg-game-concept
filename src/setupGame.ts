import bulletImgSrc from './assets/bullet.png';
import spaceShipImgUrl from './assets/spaceship.png';
import alienShipImgUrl from './assets/alien.png';

// let isGameOver = false;

interface EntityPosition {
    x: number;
    y: number;
}

interface Entities {
    positions: EntityPosition[];
    speedVal: number;
    size: number;
    spawn: () => void;
    check: () => void;
    draw: () => void;
}

export const setupGame = (canvas: HTMLCanvasElement) => {
  // setup images
  const bulletImg = new Image();
  bulletImg.src = bulletImgSrc;
  const spaceShipImg = new Image();
  spaceShipImg.src = spaceShipImgUrl;
  const alienSpaceShipImg = new Image();
  alienSpaceShipImg.src = alienShipImgUrl;

  canvas.width = 600;
  canvas.height = 600;
  let animationFrameId: number | null = null;

//   if (isGameOver === true) {
//     window.removeEventListener("click", setupGame);
//     document.removeEventListener("keypress", setupGame);
//   }

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  const theme = {
    base: '#FFFFFF',
  }

  const main = {
    score: 0,
    draw: () => {
      animationFrameId = requestAnimationFrame(main.draw);

      ctx.clearRect(0, 0, 600, 600);
      ctx.beginPath();

      bullets.check();
      enemies.check();

      ctx.strokeStyle = theme.base;
      ctx.fillStyle = theme.base;

      player.drawScore();
      player.draw();
      enemies.draw();
      bullets.draw();

      if (player.moveDir[0] !== 0) {
        if (player.moveDir[0] < 1 && player.moveDir[0] > -1) {
          player.moveDir[0] = 0;
        } else {
          player.posX += player.moveDir[0];
          player.moveDir[0] = player.moveDir[0] * player.speedFraction;
        }
      }

      if (!enemies.timeoutId) {
        enemies.scheduleSpawn();
      }
      ctx.stroke();
    },
  };

  const player = {
    posX: 600 / 2 - 10,
    posY: (600 / 10) * 9 - 10,
    speedVal: 5,
    speedFraction: 0.85,
    moveDir: [0, 0],
    size: 32,
    draw: () => {
      ctx.drawImage(spaceShipImg, player.posX, player.posY, player.size, player.size);
    },
    drawScore: () => {
      ctx.beginPath();
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${main.score}`, (canvas.width / 5) * 4, 20);
      ctx.fill();
    },
    movement: (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "ArrowLeft") {
        if (player.moveDir[0] < 1) {
          player.moveDir[0] = -player.speedVal;
        }
      } else if (e.key === "d" || e.key === "ArrowRight") {
        if (player.moveDir[0] > -1) {
          player.moveDir[0] = player.speedVal;
        }
      } else if (e.key === " ") {
        bullets.spawn(
          player.posX + player.size / 2,
          player.posY - player.size
        );
      } else if (e.key === "x") {
        enemies.spawn();
      }
    },
    gameOver: () => {
      player.movement = () => {};
      cancelAnimationFrame(animationFrameId as number);
      ctx.beginPath();
      ctx.font = "40px Arial";
      ctx.fillText("Game Over! Click to restart.", 50, canvas.height / 2);
      ctx.fill();
    //   window.addEventListener("click", startGame);
    //   document.addEventListener("keypress", startGame);
    //   isGameOver = true;
    },
  };

  interface Enemies {
    fixedSpawnTimeout: number;
    factorySpawnTimeout: number;
    timeoutId: number;
    scheduleSpawn: () => void;
  }

  const enemies: Entities & Enemies = {
    positions: [],
    size: 30,
    speedVal: 1,
    fixedSpawnTimeout: 5000,
    factorySpawnTimeout: 0.95,
    timeoutId: 0,
    scheduleSpawn: () => {
      enemies.timeoutId = setTimeout(() => {
        enemies.spawn();
        enemies.fixedSpawnTimeout *= enemies.factorySpawnTimeout;

        enemies.scheduleSpawn();
      }, enemies.fixedSpawnTimeout);
    },
    spawn: () => {
      enemies.positions.push({
        x: Math.random() * (canvas.width - 30 - 15) + 15,
        y: -enemies.size,
      });
    },
    draw: () => {
      if (enemies.positions.length < 1) {
        return;
      }

      enemies.positions.forEach((enemy: EntityPosition, index) => {
        enemies.positions[index].y += enemies.speedVal;

        ctx.drawImage(alienSpaceShipImg, enemy.x, enemy.y, enemies.size, enemies.size);
      });
    },
    check: () => {
      enemies.positions.forEach((enemy) => {
        if (enemy.y + enemies.size >= canvas.height) {
          player.gameOver();
        }
      });
    },
  };

  interface Bullets extends Omit<Entities, 'spawn'> {
    spawn: (x: number, y: number) => void;
  }

  const bullets: Bullets = {
    positions: [],
    speedVal: 5,
    size: 32,
    spawn: (x: number, y: number) => {
        bullets.positions.push({ x: x, y: y });
    },
    draw: () => {
      bullets.positions.forEach((bullet: EntityPosition, index) => {
        bullets.positions[index].y -= bullets.speedVal;

        ctx.drawImage(bulletImg, bullet.x - bullets.size / 2, bullet.y - bullets.size / 4, bullets.size, bullets.size);
      });
    },
    check: () => {
      bullets.positions.forEach((bullet: EntityPosition, index) => {
        if (bullet.y < 0) {
          bullets.positions.splice(index, 1);
        }

        enemies.positions.forEach((enemy: EntityPosition, index) => {
          if (bullet.x >= enemy.x && bullet.x <= enemy.x + enemies.size) {
            if (bullet.y >= enemy.y && bullet.y <= enemy.y + enemies.size) {
              enemies.positions.splice(index, 1);
              main.score += 1;
            }
          }
        });
      });
    },
  };

  let imgCount = 3;
  const loadImages = () => {
    if (--imgCount > 0) return;
    console.log("Starting game");

    main.draw();
    document.addEventListener("keydown", (e) => player.movement(e));
  };

  bulletImg.onload = loadImages;
  spaceShipImg.onload = loadImages;
  alienSpaceShipImg.onload = loadImages;
};
