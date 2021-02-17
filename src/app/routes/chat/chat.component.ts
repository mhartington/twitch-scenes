import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MsgRes, TwitchService } from '../../services/twitch.service';

const listAnimation = trigger('listAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(100%)' }),
    animate(
      '600ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
]);

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [listAnimation],
})
export class ChatComponent implements OnInit {
  chatMsgs$: Observable<MsgRes[]>;
  constructor(private tmi: TwitchService) {}
  ngOnInit() {
    this.chatMsgs$ = this.tmi.getChat();
  }
}


