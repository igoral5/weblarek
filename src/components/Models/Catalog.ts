import { IProduct } from "../../types";

export class Catalog {

    products: IProduct[];

    selected: IProduct | null;

    constructor() {
        this.products = [];
        this.selected = null;
    }

    setProcucts(products: IProduct[]) {
        this.products = products;
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProduct(id: string): IProduct | undefined {
        return this.products.find(val => val.id === id);
    }

    setSelected(product: IProduct | null) {
        this.selected = product;
    }

    getSelected(): IProduct | null {
        return this.selected;
    }

}
