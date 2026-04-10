import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

type ICardCatalog = Pick<IProduct, "category" | "title" | "image" | "price">;

interface ICardAction {
    onClick?(): void;
}

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Component<ICardCatalog> {
  protected categotyElement: HTMLSpanElement;
  protected titleElement: HTMLHeadingElement;
  protected imageElement: HTMLImageElement;
  protected priceElement: HTMLSpanElement;

  constructor(
    container: HTMLElement,
    actions: ICardAction,
    protected cdnUrl: string,

  ) {
    super(container);

    this.categotyElement = ensureElement<HTMLSpanElement>(
      ".card__category",
      this.container,
    );
    this.titleElement = ensureElement<HTMLHeadingElement>(
      ".card__title",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.priceElement = ensureElement<HTMLSpanElement>(
      ".card__price",
      this.container,
    );

    if (actions?.onClick) {
        this.container.addEventListener('click', actions.onClick)
    }
  }

  set category(value: string) {
    this.categotyElement.textContent = value;

    for (const key in categoryMap) {
        this.categotyElement.classList.toggle(
            categoryMap[key as CategoryKey],
            key === value
        )
    }
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set image(value: string) {
    const url = `${this.cdnUrl}${value}`;
    this.setImage(this.imageElement, url);
  }

  set price(value: number | null) {
    if (value) {
      this.priceElement.textContent = `${value} синапсов`;
    } else {
      this.priceElement.textContent = "Бесценно";
    }
  }
}
