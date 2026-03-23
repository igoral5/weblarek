import { IProduct } from "../../types";

export class Cart {

    products: IProduct[];

    constructor() {
        this.products = [];
    }

    addProduct(product: IProduct) {
        this.products.push(product);
    }

    deleteProduct(product: IProduct) {
        this.products = this.products.filter(val => val.id !== product.id);
    }

    countProducts(): number {
        return this.products.length;
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    costProducts(): number {
        return this.products.reduce((acc, val) => acc + (val.price ?? 0), 0)
    }

    existProduct(id: string): boolean {
        return this.products.some(val => val.id === id);
    }

    clearProducts() {
        this.products = [];
    }
}