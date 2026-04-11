import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CardBasePreview } from "../../base/CardBasePreview";

type ICardPreview = Pick<
  IProduct,
  "category" | "title" | "image" | "price" | "description"
> & { selected: boolean };

interface IActionPrewiev {
  onClick?(): void;
}

export class CardPreview extends CardBasePreview<ICardPreview> {
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, cdnUrl: string, actions: IActionPrewiev) {
    super(container, cdnUrl);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set price(value: number | null) {
    if (value) {
      this.priceElement.textContent = `${value} синапсов`;
    } else {
      this.priceElement.textContent = "Бесценно";
      this.buttonElement.textContent = "Недоступно";
      this.buttonElement.disabled = true;
    }
  }

  set selected(value: boolean) {
    if (value) this.buttonElement.textContent = "Удалить из корзины";
  }
}
