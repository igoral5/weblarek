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
    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.container) this.events.emit("modal:close");
    });
  }

  protected handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.code === "Escape") {
      this.events.emit("modal:close");
    }
  };

  set show(value: boolean) {
    if (value) {
      this.container.style.display = "block";
      document.addEventListener("keydown", this.handleKeyDown);
    } else {
      this.container.style.display = "none";
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  set content(value: HTMLElement) {
    this.contentElement.innerHTML = "";
    this.contentElement.append(value);
  }
}
