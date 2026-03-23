import { IOrder, IOrderResult, IProduct, IProductList } from "../types";
import { Api } from "./base/Api";

export class ApiClient {

    api: Api;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.api = new Api(baseUrl, options);
    }

    async getProducts(): Promise<IProduct[]> {
        const result: IProductList = await this.api.get<IProductList>('/product/')
        return result.items;
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order', order);
    }
}