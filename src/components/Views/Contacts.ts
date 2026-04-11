import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type IContacts = Pick<IBuyer, "email" | "phone"> & {
  enable: boolean;
  error: object;
};

export class Contacts extends Component<IContacts> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;
  protected errorsElement: HTMLElement;
  protected submitElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.emailElement = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container,
    );
    this.phoneElement = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.submitElement = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.container,
    );
    this.emailElement.addEventListener("input", () => {
        this.events.emit("contacts:email", {email: this.emailElement.value});
    })
    this.phoneElement.addEventListener("input", () => {
        this.events.emit("contacts:phone", {phone: this.phoneElement.value});
    })
    this.container.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        this.events.emit("contacts:close");
    })

  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  set enable(value: boolean) {
    this.submitElement.disabled = !value;
  }

  set error(value: object) {
    this.errorsElement.innerHTML = Object.values(value).join("<br/>");
  }
}
