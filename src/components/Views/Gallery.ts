import { Component } from "../base/Component";

interface IGallery {
    catalog: HTMLElement[];
}

/**
 * Каталог продуктов
 */
export class Gallery extends Component<IGallery> {

    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(value: HTMLElement[]) {
        this.container.append(...value);
    }
}


