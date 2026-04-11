import "./scss/styles.scss";
import { IProduct, TPayment } from "./types";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Api } from "./components/base/Api";
import { EventEmitter, IEvents } from "./components/base/Events";
import { ApiClient } from "./components/Client";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Views/Basket";
import { CardBasket } from "./components/Views/Card/CardBasket";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { CardPreview } from "./components/Views/Card/CardPreview";
import { Gallery } from "./components/Views/Gallery";
import { Header } from "./components/Views/Header";
import { Modal } from "./components/Views/Modal";
import { Buyer } from "./components/Models/Buyer";
import { Order } from "./components/Views/Order";
import { Contacts } from "./components/Views/Contacts";
import { Success } from "./components/Views/Success";

const api = new Api(API_URL);

const client: ApiClient = new ApiClient(api);

const events = new EventEmitter();

const catalog = new Catalog(events);

const cart = new Cart(events);

const gallery = new Gallery(ensureElement(".gallery"));

const modal = new Modal(ensureElement("#modal-container"), events);

const header = new Header(ensureElement(".header"), events);

const buyer = new Buyer(events);

/**
 * Реализует связи между моделями и представлениями с помощью брокера событий
 */
class Presenter {
  protected basket: Basket | undefined;
  protected order: Order | undefined;
  protected contacts: Contacts | undefined;

  constructor(
    protected catalog: Catalog,
    protected cart: Cart,
    protected events: IEvents,
    protected client: ApiClient,
    protected galllery: Gallery,
    protected modal: Modal,
    protected header: Header,
    protected buyer: Buyer,
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
      const selected = this.cart.isExist(product.id);
      const card = new CardPreview(cloneTemplate("#card-preview"), CDN_URL, {
        onClick: selected
          ? () => {
              this.cart.deleteProduct(product);
              this.modal.show = false;
            }
          : () => {
              this.cart.addProduct(product);
              this.modal.show = false;
            },
      });
      this.modal.render({
        content: card.render({
          ...product,
          selected,
        }),
      });
      this.modal.show = true;
    });
    // Закрытие модального окна
    this.events.on("modal:close", () => {
      this.modal.show = false;
    });
    // Корзина пользователя изменена, приводит к изменению заголовка
    this.events.on("basket:change", () => {
      this.header.render({
        counter: this.cart.count(),
      });
    });
    // Открытие корзины пользователя
    this.events.on("basket:open", () => {
      this.basket = new Basket(cloneTemplate("#basket"), this.events);
      this.modal.render({
        content: this.renderBasket(),
      });
      this.modal.show = true;
      this.events.on("basket:change", this.renderBasket);
      this.events.on("modal:close", this.closeBasket);
    });
    // Открытие первой части заказа, ввод способа оплаты и адреса
    this.events.on("order:open", () => {
      this.order = new Order(cloneTemplate("#order"), this.events);

      this.modal.render({
        content: this.renderOrder(),
      });
      this.modal.show = true;
      this.events.on("buyer:change", this.renderOrder);
      this.events.on("modal:close", this.closeOrder);
    });
    // Ввод способа оплаты
    this.events.on("order:payment", (data: { payment: TPayment }) => {
      this.buyer.setPayment(data.payment);
    });
    // Ввод адреса
    this.events.on("order:address", (data: { address: string }) => {
      this.buyer.setAddress(data.address);
    });
    // Закрытие первой части ввода заказа и переход на вторую часть, где производиться ввод email и телефона
    this.events.on("order:close", () => {
      this.contacts = new Contacts(cloneTemplate("#contacts"), this.events);
      this.modal.render({
        content: this.renderContacts(),
      });
      this.events.on("buyer:change", this.renderContacts);
      this.events.on("modal:close", this.closeContacts);
      this.modal.show = true;
    });
    // Ввод email
    this.events.on("contacts:email", (data: { email: string }) => {
      this.buyer.setEmail(data.email);
    });
    // Ввод телефона
    this.events.on("contacts:phone", (data: { phone: string }) => {
      this.buyer.setPhone(data.phone);
    });
    // Завершение ввода заказа и отправка его на back, показ заключительного модального окна
    this.events.on("contacts:close", () => {
      const buyer = this.buyer.getBuyer();
      const order = {
        ...buyer,
        total: this.cart.cost(),
        items: this.cart.getProducts().map((product) => product.id),
      };
      this.client.postOrder(order).then((data) => {
        const success = new Success(cloneTemplate("#success"), this.events);
        this.modal.render({
          content: success.render({
            cost: data.total,
          }),
        });
        this.events.on("modal:close", this.closeSuccess);
      });
    });
  }

  /**
   * Показывает корзину пользователя, представлено в виде свойства, для возможности удаления этого обработчика из брокера событий
   * @returns Разметка
   */
  protected renderBasket = () => {
    return this.basket?.render({
      cost: this.cart.cost(),
      products: this.cart.getProducts().map((product, index) => {
        const card = new CardBasket(cloneTemplate("#card-basket"), {
          onClick: () => {
            this.cart.deleteProduct(product);
          },
        });
        return card.render({
          title: product.title,
          price: product.price,
          index: index + 1,
        });
      }),
    });
  };

  /**
   * Закрывает корзину пользователя, удаляет связанные с ней обработчики
   */
  protected closeBasket = () => {
    this.basket = undefined;
    this.events.off("basket:change", this.renderBasket);
    this.events.off("modal:close", this.closeBasket);
  };

  /**
   * Показывает первую часть заказа с вводом способа оплаты и адресом
   * @returns Разметка
   */
  protected renderOrder = () => {
    const buyer = this.buyer.getBuyer();
    const { email, phone, ...error } = this.buyer.validate();
    const enable = Object.keys(error).length === 0;
    return this.order?.render({
      ...buyer,
      enable,
      error,
    });
  };

  /**
   * Закрывает первую часть ввода заказа и удаляет связанные с ней обработчики
   */
  protected closeOrder = () => {
    this.order = undefined;
    this.events.off("buyer:change", this.renderOrder);
    this.events.off("modal:close", this.closeOrder);
  };

  /**
   * Показывает вторую часть ввода заказа, ввод email и телефона
   * @returns Разметка
   */
  protected renderContacts = () => {
    const buyer = this.buyer.getBuyer();
    const { payment, address, ...error } = this.buyer.validate();
    const enable = Object.keys(error).length === 0;
    return this.contacts?.render({
      ...buyer,
      enable,
      error,
    });
  };

  /**
   * Закрывает вторую часть ввода заказа и удаляет связанные с ним обработчики
   */
  protected closeContacts = () => {
    this.contacts = undefined;
    this.events.off("buyer:change", this.renderContacts);
    this.events.off("modal:close", this.closeContacts);
  };

  /**
   * Закрывает завершающее модальное окно, об успешном заказе
   */
  protected closeSuccess = () => {
    this.cart.clear();
    this.buyer.setBuyer({
      email: "",
      payment: "",
      phone: "",
      address: "",
    });
    this.events.off("modal:close", this.closeSuccess);
  };

  /**
   * Инициирует начальную загрузку каталога
   */
  start() {
    this.events.emit("catalog:load");
  }
}

const presenter = new Presenter(
  catalog,
  cart,
  events,
  client,
  gallery,
  modal,
  header,
  buyer,
);

presenter.start();
