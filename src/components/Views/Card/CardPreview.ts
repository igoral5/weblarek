import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

type ICardPreview = Pick<
  IProduct,
  "category" | "title" | "image" | "price" | "description"
>;


type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Component<ICardPreview> {
  protected categotyElement: HTMLSpanElement;
  protected titleElement: HTMLHeadingElement;
  protected descriptionElement: HTMLParagraphElement;
  protected imageElement: HTMLImageElement;
  protected priceElement: HTMLSpanElement;

  constructor(
    container: HTMLElement,
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
    this.descriptionElement = ensureElement<HTMLParagraphElement>(
      ".card__text",
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
  }

  set category(value: string) {
    this.categotyElement.textContent = value;

    for (const key in categoryMap) {
      this.categotyElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

}
