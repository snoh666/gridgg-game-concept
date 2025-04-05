import './style.css'
import { setupGame } from './setupGame.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="wrapper">
    <canvas></canvas>
  </div>
`

setupGame(document.querySelector<HTMLCanvasElement>('canvas')!)
