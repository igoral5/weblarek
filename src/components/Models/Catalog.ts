import { IProduct } from "../../types";

/**
 * Каталог продуктов
 */
export class Catalog {

    /**
     * Собственно каталог
     */
    protected products: IProduct[];

    /**
     * Выбранный продукт
     */
    protected selected: IProduct | null;

    /**
     * Создание каталога
     */
    constructor() {
        this.products = [];
        this.selected = null;
    }

    /**
     * Установка полного списка продуктов
     * @param products Список продуктов
     */
    public setProcucts(products: IProduct[]) {
        this.products = products;
    }

    /**
     * Получение списка продуктов
     * @returns Список продуктов
     */
    public getProducts(): IProduct[] {
        return this.products;
    }

    /**
     * Получение продукта по его идентификатору
     * @param id Идентификатор продукта
     * @returns Продукт
     */
    public getProduct(id: string): IProduct | undefined {
        return this.products.find(val => val.id === id);
    }

    /**
     * Установка выбранного продукта
     * @param product Продукт
     */
    public setSelected(product: IProduct | null) {
        this.selected = product;
    }

    /**
     * Получение выбранного продукта
     * @returns Продукт
     */
    public getSelected(): IProduct | null {
        return this.selected;
    }

}
