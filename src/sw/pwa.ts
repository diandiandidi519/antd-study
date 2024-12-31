import { Workbox } from 'workbox-window';

type RegisterOptions = { scope?: string; autoRefreshTime?: number };

class Pwa {
  workbox: Workbox;
  scriptURL: string;

  constructor(scriptURL: string, registerOptions?: RegisterOptions) {
    this.scriptURL = scriptURL;
    this.workbox = new Workbox(scriptURL, registerOptions);
  }

  register(): Promise<ServiceWorkerRegistration | undefined> {
    return this.workbox.register();
  }

  unregister() {
    return this.messageWhenActive({ type: 'UNREGISTER' });
  }

  messageWhenActive(message: { type: string; data?: any }) {
    return navigator.serviceWorker.getRegistrations().then((regs) => {
      for (let reg of regs) {
        if (
          reg.active &&
          reg.active.scriptURL ===
            `${this.scriptURL.startsWith('http') ? this.scriptURL : `${window.location.origin}${this.scriptURL}`}`
        ) {
          reg.active.postMessage(message);
          break;
        }
      }
    });
  }

  toggleCache({ data }: { data: boolean }) {
    return this.messageWhenActive({
      type: 'TOGGLE_CACHE',
      data,
    });
  }

  updateSlardar({ data }: any) {
    return this.messageWhenActive({
      type: 'UPDATE_SLARDAR',
      data,
    });
  }

  toggleBoc({ data }: { data: boolean }) {
    return this.messageWhenActive({
      type: 'TOGGLE_BOC',
      data,
    });
  }
  resetBoc() {
    return this.messageWhenActive({
      type: 'RESET_BOC',
    });
  }
  swCrashAdd() {
    return this.messageWhenActive({
      type: 'HEALTH_ADD',
    });
  }
  swCrashRemove() {
    return this.messageWhenActive({
      type: 'HEALTH_REMOVE',
    });
  }
  swCrashHealth(data: { url: string }) {
    return this.messageWhenActive({
      type: 'HEALTH_KEEP',
      data,
    });
  }

  toggleHtmlCacheFirst({ data }: { data: boolean }) {
    return this.messageWhenActive({
      type: 'TOGGLE_HTMLCACHEFIRST',
      data,
    });
  }
}

export * from 'workbox-window';
export { Pwa };
