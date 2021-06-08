import { Component } from '@angular/core';

@Component({
  template: `
    <div class="canvas">
      <div class="ball"></div>
    </div>
  `,
  styles: [
    `
      .canvas {
        width: 100%;
        height: 100%;
      }
      .ball {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: red;
        animation: tumble 5s;
        animation-direction: alternate;
        animation-iteration-count: infinite;
      }
      @keyframes tumble {
        from {
          transform: translate3d(100%, 0, 0);
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
  ],
})
export class FullScreenComponent {}
