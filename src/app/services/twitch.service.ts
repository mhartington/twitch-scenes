import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { redact, list } from '@princedev/redact';
import { ChatUserstate, Client } from 'tmi.js';
import { randomColor } from '../util/randomcolor';
export interface MsgRes {
  formattedMsg: string;
  displayName: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  // public filter = new Filt
  public client: Client;
  public profane = [...list.english.profanity, ...list.english.sexual]
  constructor() {
    this.client = new Client({
      connection: { reconnect: true },
      channels: ['mhartington'],
    });
    this.client.connect();
  }
  getChat(): Observable<Array<MsgRes>> {
    let msgState: MsgRes[] = [];
    return new Observable((o) => {
      this.client.on(
        'message',
        (
          _channel: string,
          tags: ChatUserstate,
          message: string,
          self: boolean
        ) => {
          if (self) return;
          let emotes = null;
          const emoteObj = tags['emotes'];
          let formattedMsg: string = '';
          let censoredMem = redact(message, this.profane);

          if (emoteObj) {
            emotes = Object.keys(emoteObj).reduce((arr, emoteCode) => {
              const instances = emoteObj[emoteCode];
              const codesWithStartEnd = instances.map((instance) => {
                const [start, end] = instance.split('-');
                return [emoteCode, start, end];
              });
              return [...arr, ...codesWithStartEnd];
            }, []);
            formattedMsg = this.parseEmotes(emotes, censoredMem);
          } else {
            formattedMsg = censoredMem;
          }

          const response = {
            formattedMsg,
            displayName: tags['display-name'],
            color: tags['color'] ?? randomColor(),
          };
          console.log(tags);
          msgState = [...msgState, response];
          o.next(msgState);
        }
      );
    });
  }

  parseEmotes(emotes: any, message: string) {
    const sortedEmotes = emotes.sort((a: [any, any], b: [any, any]) => {
      const [, aStart] = a;
      const [, bStart] = b;
      return parseInt(bStart, 10) > parseInt(aStart, 10) ? 1 : -1;
    });

    const messageWithEmotes = sortedEmotes.reduce((mem: string, val: [any, any, any]) => {
        const [emoteId, start, end] = val;

        const src = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`;
        const srcset = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0 1x,https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/2.0 2x,https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/3.0 4x`;

        const image = `<img src=${src} srcset=${srcset} class="emote" />`;

        const beginning = mem.substring(0, parseInt(start, 10));
        const ending = mem.substring(parseInt(end, 10) + 1);
        const updated = `${beginning}${image}${ending}`;

        return updated;
      },
      message
    );
    return messageWithEmotes;
  }
}
