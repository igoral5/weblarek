import { ApiClient } from './components/Client';
import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { Catalog } from './components/Models/Catalog';
import './scss/styles.scss';
import { IOrder } from './types';
import { API_URL } from './utils/constants';

const client: ApiClient = new ApiClient(API_URL);


client.getProducts().then(data => {

    const catalog = new Catalog();

    catalog.setProcucts(data);

    console.log('Полный каталог: ', catalog.getProducts());

    const cart = new Cart();
    cart.addProduct(catalog.getProducts()[0]);
    cart.addProduct(catalog.getProducts()[3]);

    const buyer = new Buyer();
    buyer.setAddress('Адрес');
    buyer.setEmail('user@domain.com');
    buyer.setPayment('online');
    buyer.setPhone('123456789');

    console.log('Результат проверки информации введенной покупателем: ', buyer.check());

    const order: IOrder = {
        ...buyer.getBuyer(),
        total: cart.costProducts(),
        items: cart.getProducts().map(val => val.id)
    };

    client.postOrder(order).then(data => {
        console.log('Результат отправки заказа: ', data);
    })
})
