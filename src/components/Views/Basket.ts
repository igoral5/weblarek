import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  cost: number;
  products: HTMLElement[];
}

export class Basket extends Component<IBasket> {
  protected priceElement: HTMLSpanElement;
  protected buttonElement: HTMLButtonElement;
  protected listElement: HTMLUListElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.priceElement = ensureElement<HTMLSpanElement>(
      ".basket__price",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.listElement = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container,
    );
    this.buttonElement.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set cost(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set products(items: HTMLLIElement[]) {
    this.listElement.innerHTML = "";
    this.listElement.append(...items);
    if (items.length === 0) {
      this.buttonElement.disabled = true;
    }
  }
}
