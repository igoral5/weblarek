import { ApiClient } from './components/Client';
import { Catalog } from './components/Models/Catalog';
import './scss/styles.scss';
import { API_URL } from './utils/constants';

const client: ApiClient = new ApiClient(API_URL);

const catalog: Catalog = new Catalog();

client.getProducts().then(data => {
    catalog.setProcucts(data);
    console.log(catalog.getProducts());
})


client.postOrder({
    payment: 'online',
    address: 'Проверка',
    email: 'igor@mail.ru',
    phone: '79057509850',
    items: [
        '854cef69-976d-4c2a-a18c-2aa45046c390',
        'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
    ],
    total: 2200,
}).then(data => console.log(data))
