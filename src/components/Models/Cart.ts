import { IProduct } from "../../types";

/**
 * Корзина покупателя
 */
export class Cart {
  protected products: IProduct[];

  /**
   * Создание корзины
   */
  constructor() {
    this.products = [];
  }

  /**
   * Добавляет продукт в корзину
   * @param product Продукт
   */
  public addProduct(product: IProduct) {
    this.products.push(product);
  }

  /**
   * Удаляет продукт из корзины
   * @param product Продукт
   */
  public deleteProduct(product: IProduct) {
    this.products = this.products.filter((val) => val.id !== product.id);
  }

  /**
   * Возвращает количество продуктов
   * @returns Количество
   */
  public count(): number {
    return this.products.length;
  }

  /**
   * Возвращает список продуктов в корзине
   * @returns Список продуктов
   */
  public getProducts(): IProduct[] {
    return this.products;
  }

  /**
   * Возвращает стоимость продуктов в корзине
   * @returns Стоимость
   */
  public cost(): number {
    return this.products.reduce((acc, val) => acc + (val.price ?? 0), 0);
  }

  /**
   * Проверят наличие продукта в корзине по его идентификатору
   * @param id Идентификатор продукта
   * @returns Признак наличия
   */
  public isExist(id: string): boolean {
    return this.products.some((val) => val.id === id);
  }

  /**
   * Очистка корзины
   */
  public clear() {
    this.products = [];
  }
}
