import { IBuyer, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

type IOrder = Pick<IBuyer, "payment" | "address"> & {
  enable: boolean;
  error: object;
};

/**
 * Ввод информации о заказе, способ оплаты и адрес доставки
 */
export class Order extends Form<IOrder> {
  protected cardElement: HTMLButtonElement;
  protected cashElement: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
  ) {
    super(container, events);

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

    this.cardElement.addEventListener("click", () => {
      this.events.emit("buyer:set", { payment: "online" });
    });

    this.cashElement.addEventListener("click", () => {
      this.events.emit("buyer:set", { payment: "cash" });
    });

    this.addressElement.addEventListener("input", () => {
      this.events.emit("buyer:set", { address: this.addressElement.value });
    });

    this.container.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();
      this.events.emit("order:close");
    });
  }

  set payment(value: TPayment) {
    if (value === "cash") {
      this.cashElement.classList.add("button_alt-active");
      this.cardElement.classList.remove("button_alt-active")
    } else if (value === "online") {
      this.cardElement.classList.add("button_alt-active");
      this.cashElement.classList.remove("button_alt-active");
    } else {
      this.cardElement.classList.remove("button_alt-active");
      this.cashElement.classList.remove("button_alt-active");
    }
  }

  set address(value: string) {
    this.addressElement.value = value;
  }

}
