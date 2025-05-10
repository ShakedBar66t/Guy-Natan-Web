declare module '@vimeo/player' {
  export default class Player {
    constructor(element: HTMLIFrameElement | HTMLDivElement | string);
    
    ready(): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    setVolume(volume: number): Promise<void>;
    setMuted(muted: boolean): Promise<void>;
    getPaused(): Promise<boolean>;
    destroy(): Promise<void>;
  }
} 