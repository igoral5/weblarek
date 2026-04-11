import { IBuyer, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type IOrder = Pick<IBuyer, "payment" | "address"> & {
  enable: boolean;
  error: object;
};

export class Order extends Component<IOrder> {
  protected cardElement: HTMLButtonElement;
  protected cashElement: HTMLButtonElement;
  protected addressElement: HTMLInputElement;
  protected submitElement: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.cardElement = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container,
    );
    this.cashElement = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container,
    );
    this.addressElement = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );
    this.submitElement = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.container,
    );
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.cardElement.addEventListener("click", () => {
      this.events.emit("order:payment", { payment: "online" });
      this.cardElement.classList.add("button_alt-active");
      this.cashElement.classList.remove("button_alt-active");
    });

    this.cashElement.addEventListener("click", () => {
      this.events.emit("order:payment", { payment: "cash" });
      this.cashElement.classList.add("button_alt-active");
      this.cardElement.classList.remove("button_alt-active");
    });

    this.addressElement.addEventListener("input", () => {
      this.events.emit("order:address", { address: this.addressElement.value });
    });

    this.container.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();
      this.events.emit("order:close");
    });
  }

  set payment(value: TPayment) {
    if (value === "cash") {
      this.cashElement.classList.add("button_alt-active");
    } else if (value === "online") {
      this.cardElement.classList.add("button_alt-active");
    }
  }

  set address(value: string) {
    this.addressElement.value = value;
  }

  set enable(value: boolean) {
    this.submitElement.disabled = !value;
  }

  set error(value: object) {
    this.errorElement.innerHTML = Object.values(value).join("<br/>");
  }
}
