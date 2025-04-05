import './style.css'
import { setupGame } from './setupGame.ts'

import backgorundImgUrl from './assets/bg-space.png';

document.body.style.backgroundImage = `url("${backgorundImgUrl}")`
document.body.style.backgroundRepeat = 'repeat';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="wrapper">
    <canvas></canvas>
  </div>
`

setupGame(document.querySelector<HTMLCanvasElement>('canvas')!)
