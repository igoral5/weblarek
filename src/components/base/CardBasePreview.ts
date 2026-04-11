import { ensureElement } from "../../utils/utils";
import { CardBaseCatalog } from "./CardBaseCatalog";

export class CardBasePreview<T> extends CardBaseCatalog<T> {
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, cdnUrl: string) {
        super(container, cdnUrl);
        this.descriptionElement = ensureElement(".card__text", this.container);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
}
