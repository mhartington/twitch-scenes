import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TwitchService } from 'src/app/services/twitch.service';

const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
]);

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  animations: [fadeIn],
})
export class OverlayComponent implements OnInit {
  overlayState$ = this.tmi.commandEmitter;
  constructor(private tmi: TwitchService) {}
  ngOnInit(): void {}
}
