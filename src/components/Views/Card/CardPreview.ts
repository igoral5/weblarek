import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CardBaseCatalog } from "./CardBaseCatalog";

type ICardPreview = Pick<
  IProduct,
  "category" | "title" | "image" | "price" | "description"
> & { enable: boolean; text: string };

interface IActionPrewiev {
  onClick?(): void;
}

/**
 * Preview карточки
 */
export class CardPreview extends CardBaseCatalog<ICardPreview> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, cdnUrl: string, actions: IActionPrewiev) {
    super(container, cdnUrl);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }


  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set enable(value: boolean) {
    this.buttonElement.disabled = !value;
  }

  set text(value: string) {
    this.buttonElement.textContent = value;
  }
}
