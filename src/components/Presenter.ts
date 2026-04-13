import { IProduct, TPayment } from "../types";
import { CDN_URL } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/Events";
import { ApiClient } from "./Client";
import { Buyer } from "./Models/Buyer";
import { Cart } from "./Models/Cart";
import { Catalog } from "./Models/Catalog";
import { Basket } from "./Views/Basket";
import { CardBasket } from "./Views/Card/CardBasket";
import { CardCatalog } from "./Views/Card/CardCatalog";
import { CardPreview } from "./Views/Card/CardPreview";
import { Contacts } from "./Views/Contacts";
import { Gallery } from "./Views/Gallery";
import { Header } from "./Views/Header";
import { Modal } from "./Views/Modal";
import { Order } from "./Views/Order";
import { Success } from "./Views/Success";

/**
 * Реализует связи между моделями и представлениями с помощью брокера событий
 */
export class Presenter {
  constructor(
    protected catalog: Catalog,
    protected cart: Cart,
    protected events: IEvents,
    protected client: ApiClient,
    protected galllery: Gallery,
    protected modal: Modal,
    protected header: Header,
    protected buyer: Buyer,
    protected basket: Basket,
    protected order: Order,
    protected contacts: Contacts,
    protected success: Success,
  ) {
    this.configure();
  }

  /**
   * Задает обработчики событий
   */
  protected configure() {
    // Событие загрузки каталога
    this.events.on("catalog:load", () => {
      this.client.getProducts().then((data) => {
        this.catalog.setProcucts(data);
      });
    });
    // Событие изменения каталога, приводит к его показу
    this.events.on("catalog:change", () => {
      this.galllery.render({
        catalog: this.catalog.getProducts().map((product) => {
          const card = new CardCatalog(
            cloneTemplate<HTMLButtonElement>("#card-catalog"),
            {
              onClick: () => {
                this.events.emit("catalog:select", product);
              },
            },
            CDN_URL,
          );
          return card.render(product);
        }),
      });
    });
    // Выбор пользователем продукта для просмотра
    this.events.on("catalog:select", (product) => {
      this.catalog.setSelected(product as IProduct);
    });
    // Устанавливаем продукт в качестве выбранного, приводит к его показу в модальном окне
    this.events.on("catalog:selected", () => {
      const product = this.catalog.getSelected() as IProduct;
      const exists = this.cart.isExist(product.id);
      const text =
        product.price === null
          ? "Недоступно"
          : exists
            ? "Удалить из корзины"
            : "Купить";
      const enable = product.price !== null;
      const card = new CardPreview(cloneTemplate("#card-preview"), CDN_URL, {
        onClick: exists
          ? () => {
              this.events.emit("basket:remove", product);
              this.events.emit("modal:close");
            }
          : () => {
              this.events.emit("basket:add", product);
              this.events.emit("modal:close");
            },
      });
      this.modal.render({
        content: card.render({
          ...product,
          enable,
          text,
        }),
        show: true,
      });
    });
    // Закрытие модального окна
    this.events.on("modal:close", () => {
      this.modal.render({ show: false });
    });
    // Добавление продукта в корзину
    this.events.on("basket:add", (product) => {
      this.cart.addProduct(product as IProduct);
    });
    // Удаление продукта из корзины
    this.events.on("basket:remove", (product) => {
      this.cart.deleteProduct(product as IProduct);
    });
    // Корзина пользователя изменена, приводит к изменению заголовка
    this.events.on("basket:change", () => {
      this.header.render({
        counter: this.cart.count(),
      });
    });
    // Отображение корзины
    const renderBasket = () => {
      const products = this.cart.getProducts();
      return this.basket.render({
        cost: this.cart.cost(),
        products: products.map((product, index) => {
          const card = new CardBasket(cloneTemplate("#card-basket"), {
            onClick: () => {
              this.events.emit("basket:remove", product);
            },
          });
          return card.render({
            title: product.title,
            price: product.price,
            index: index + 1,
          });
        }),
        enable: products.length !== 0,
      });
    };
    // Открытие корзины пользователя
    this.events.on("basket:open", () => {
      this.modal.render({
        content: renderBasket(),
        show: true,
      });
    });
    // Привязка отображение корзины к событию изменения корзины
    this.events.on("basket:change", renderBasket);
    //Отображение ввода первой части заказа, ввод способа оплаты и адреса
    const renderOrder = () => {
      const buyer = this.buyer.getBuyer();
      const { email, phone, ...error } = this.buyer.validate();
      const enable = Object.keys(error).length === 0;
      return this.order.render({
        ...buyer,
        enable,
        error,
      });
    };
    // Открытие первой части заказа, ввод способа оплаты и адреса
    this.events.on("order:open", () => {
      this.modal.render({
        content: renderOrder(),
        show: true,
      });
    });
    // Привязка отображения первой заказа при изменения информации о покупателе
    this.events.on("buyer:change", renderOrder);
    // Ввод атрибутов покупателя
    this.events.on("buyer:set", (data) => {
      for (let [key, value] of Object.entries(data)) {
        switch (key) {
          case "payment":
            this.buyer.setPayment(value as TPayment);
            break;
          case "address":
            this.buyer.setAddress(value);
            break;
          case "email":
            this.buyer.setEmail(value);
            break;
          case "phone":
            this.buyer.setPhone(value);
            break;
        }
      }
    });
    // Отображение второй части ввода заказа, ввод email и телефона
    const renderContacts = () => {
      const buyer = this.buyer.getBuyer();
      const { payment, address, ...error } = this.buyer.validate();
      const enable = Object.keys(error).length === 0;
      return this.contacts.render({
        ...buyer,
        enable,
        error,
      });
    };
    // Закрытие первой части ввода заказа и переход на вторую часть, где производиться ввод email и телефона
    this.events.on("order:close", () => {
      this.modal.render({
        content: renderContacts(),
        show: true,
      });
    });
    // Отображение ввода контактов при изменении покупателя
    this.events.on("buyer:change", renderContacts);
    // Завершение ввода заказа и отправка его на back, показ заключительного модального окна
    this.events.on("contacts:close", () => {
      const buyer = this.buyer.getBuyer();
      const order = {
        ...buyer,
        total: this.cart.cost(),
        items: this.cart.getProducts().map((product) => product.id),
      };
      this.client.postOrder(order).then((data) => {
        this.modal.render({
          content: this.success.render({
            cost: data.total,
          }),
          show: true,
        });
        const modalClose = () => {
          this.cart.clear();
          this.buyer.clear();
          this.events.off("modal:close", modalClose);
        };
        this.events.on("modal:close", modalClose);
      });
    });
  }

  /**
   * Инициирует начальную загрузку каталога
   */
  start() {
    this.events.emit("catalog:load");
  }
}
