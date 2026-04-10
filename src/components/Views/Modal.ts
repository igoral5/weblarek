import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalContent {
  content: HTMLElement;
}

export class Modal extends Component<IModalContent> {
  protected contentElement: HTMLDivElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.contentElement = ensureElement<HTMLDivElement>(
      ".modal__content",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.buttonElement.addEventListener("click", () =>
      this.events.emit("modal:close"),
    );
  }

  set show(value: boolean) {
    if (value) this.container.style.display = 'block';
    else this.container.style.display = 'none';
  }

  set content(value: HTMLElement) {
    this.contentElement.append(value);
  }
}
