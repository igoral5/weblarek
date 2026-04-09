import { Api } from "./components/base/Api";
import { ApiClient } from "./components/Client";
import { Buyer } from "./components/Models/Buyer";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";
import "./scss/styles.scss";
import { IOrder } from "./types";
import { API_URL } from "./utils/constants";

const api = new Api(API_URL);

const client: ApiClient = new ApiClient(api);

client.getProducts().then((data) => {
  const catalog = new Catalog();

  catalog.setProcucts(data);

  console.log("Полный каталог: ", catalog.getProducts());

  console.log(
    "Получение из каталога продукта по его идентификатору: ",
    catalog.getProduct("f3867296-45c7-4603-bd34-29cea3a061d5"),
  );

  catalog.setSelected(
    catalog.getProduct("1c521d84-c48d-48fa-8cfb-9d911fa515fd") ?? null,
  );

  console.log("Выбранный продукт: ", catalog.getSelected());

  const cart = new Cart();
  cart.addProduct(catalog.getProducts()[0]);
  cart.addProduct(catalog.getProducts()[3]);
  cart.addProduct(catalog.getProducts()[7]);
  cart.deleteProduct(catalog.getProducts()[7]);

  console.log(
    "Количество продуктов в корзине: ",
    cart.count(),
    " стоимость продуктов: ",
    cart.cost(),
    " продукты: ",
    cart.getProducts(),
  );
  console.log(
    "Проверка наличий продукта в корзине: ",
    cart.isExist("854cef69-976d-4c2a-a18c-2aa45046c390"),
  );

  const buyer = new Buyer();

  console.log(
    "Реультат проверки  информации введенной покупателем, до ввода: ",
    buyer.validate(),
  );

  buyer.setAddress("Адрес");
  buyer.setEmail("user@domain.com");
  buyer.setPayment("online");
  buyer.setPhone("123456789");

  console.log("Информация введеная покупателем: ", buyer.getBuyer());
  buyer.setBuyer({
    payment: "cash",
    address: "Без адреса",
    email: "user@mail.ru",
    phone: "987654321",
  });
  console.log(
    "Информация введеная покупателем, после setBuyer: ",
    buyer.getBuyer(),
  );
  console.log(
    "Результат проверки информации введенной покупателем: ",
    buyer.validate(),
  );

  const order: IOrder = {
    ...buyer.getBuyer(),
    total: cart.cost(),
    items: cart.getProducts().map((val) => val.id),
  };

  client.postOrder(order).then((data) => {
    console.log("Результат отправки заказа: ", data);
    cart.clear();
    console.log("Продукты в корзине после очистки: ", cart.getProducts());
  });
});
