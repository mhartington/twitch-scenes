import { Injectable } from '@angular/core';
import { redact, list } from '@princedev/redact';
import { ChatUserstate, Client } from 'tmi.js';
import { generateUUID, randomColor } from '../util';

import { RxState } from '@rx-angular/state';
import { environment } from 'src/environments/environment';
export interface MsgRes {
  formattedMsg: string;
  displayName: string;
  color: string;
  id: string;
}
export interface ChatState {
  messages: MsgRes[];
}
@Injectable({
  providedIn: 'root',
})
export class TwitchService extends RxState<ChatState> {
  public chat: Client;

  constructor() {
    super();
    this.set({
      messages: [],
    });
    this.chat = new Client({
      connection: { reconnect: true },
      channels: [environment.channel],
      identity: {
        username: environment.username,
        password: environment.token,
      },
    });
    this.chat.connect();
    this.chat.on('message', this.onMessage.bind(this));
    this.chat.on('ban', this.onUserBan.bind(this));
    this.chat.on('messagedeleted', this.onMessageDel.bind(this));
  }

  onUserBan(_: any, username: string) {
    this.set((state) => ({
      ...state,
      messages: state.messages.filter(
        (message) => message.displayName === username
      ),
    }));
  }
  onMessageDel(
    _channel: string,
    _username: string,
    _message: string,
    tags: ChatUserstate
  ) {
    this.set((state) => {
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.id !== tags['target-msg-id']
        ),
      };
    });
  }

  onMessage(
    channel: string,
    tags: ChatUserstate,
    message: string,
    _self: boolean
  ) {
    if (_self) return;
    if (message.startsWith('!')) {
      this.processCommand(message, tags, channel);
    } else {
      this.processChatMsg(message, tags);
    }
  }

  processChatMsg(message: string, tags: ChatUserstate) {
    let emotes = null;
    const emoteObj = tags['emotes'];
    const id = tags['id'] ?? generateUUID();
    let formattedMsg: string = '';
    let censoredMem = redact(message, profane);

    if (emoteObj) {
      emotes = Object.keys(emoteObj).reduce((arr, emoteCode) => {
        const instances = emoteObj[emoteCode];
        const codesWithStartEnd = instances.map((instance) => {
          const [start, end] = instance.split('-');
          return [emoteCode, start, end];
        });
        return [...arr, ...codesWithStartEnd];
      }, []);
      formattedMsg = parseEmotes(emotes, censoredMem);
    } else {
      formattedMsg = censoredMem;
    }
    const color = tags['color'] ?? randomColor();
    const newMsg = {
      formattedMsg,
      displayName: tags['display-name'],
      color,
      id,
    };

    this.set((state) => {
      return {
        ...state,
        messages: [...state.messages, newMsg],
      };
    });
    // setTimeout(() => {
    //   this.set((state) => {
    //     return {
    //       ...state,
    //       messages: state.messages.filter(
    //         (message) => message.id !== newMsg.id
    //       ),
    //     };
    //   });
    // }, 30000);
  }
  processCommand(message: string, _tags: ChatUserstate, channel: string) {
    const command = message.substring(1);
    this.chat.say(channel, `No "${command}" command, yet...`);
    // switch (command) {
    //   case 'uses':
    //     this.chat.say(channel, `Y'll ever hear of neovim?`);
    // }
  }
}

const profane = [...list.english.profanity, ...list.english.sexual];
function parseEmotes(emotes: any, message: string) {
  const sortedEmotes = emotes.sort((a: [any, any], b: [any, any]) => {
    const [, aStart] = a;
    const [, bStart] = b;
    return parseInt(bStart, 10) > parseInt(aStart, 10) ? 1 : -1;
  });

  const messageWithEmotes = sortedEmotes.reduce(
    (mem: string, val: [any, any, any]) => {
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
