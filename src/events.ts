export interface ToggleInit extends EventInit {
  oldState: string;
  newState: string;
}

export class ToggleEvent extends Event {
  public oldState: string;
  public newState: string;
  constructor(type: string, init: Partial<ToggleInit> = {}) {
    const eventInit: Partial<ToggleInit> = Object.assign({}, init);
    delete eventInit.oldState;
    delete eventInit.newState;
    super(type, eventInit);
    this.oldState = String(init.oldState || '');
    this.newState = String(init.newState || '');
  }
}

const popoverToggleTaskQueue = new WeakMap<HTMLElement, unknown>();
export function queuePopoverToggleEventTask(
  element: HTMLElement,
  oldState: string,
  newState: string,
) {
  popoverToggleTaskQueue.set(
    element,
    setTimeout(() => {
      if (!popoverToggleTaskQueue.has(element)) return;
      element.dispatchEvent(
        new ToggleEvent('toggle', {
          cancelable: false,
          oldState,
          newState,
        }),
      );
    }, 0),
  );
}
