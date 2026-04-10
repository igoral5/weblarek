import { Api } from "./components/base/Api";
import { EventEmitter, IEvents } from "./components/base/Events";
import { ApiClient } from "./components/Client";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { CardPreview } from "./components/Views/Card/CardPreview";
import { Gallery } from "./components/Views/Gallery";
import { Modal } from "./components/Views/Modal";
import "./scss/styles.scss";
import { IProduct } from "./types";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

const api = new Api(API_URL);

const client: ApiClient = new ApiClient(api);

const events = new EventEmitter();

const catalog = new Catalog(events);

const basket = new Cart(events);

const gallery = new Gallery(ensureElement(".gallery"));

const modal = new Modal(ensureElement("#modal-container"), events);

class Presenter {
  constructor(
    protected catalog: Catalog,
    protected basket: Cart,
    protected events: IEvents,
    protected client: ApiClient,
    protected galllery: Gallery,
    protected modal: Modal,
  ) {
    this.configure();
  }

  protected configure() {
    this.events.on("catalog:load", () => {
      this.client.getProducts().then((data) => {
        this.catalog.setProcucts(data);
      });
    });

    this.events.on("catalog:change", () => {
      this.galllery.render({
        catalog: this.catalog.getProducts().map((product) => {
          const card = new CardCatalog(
            cloneTemplate<HTMLButtonElement>("#card-catalog"),
            {
              onClick: () => {
                this.events.emit("card:select", product);
              },
            },
            CDN_URL,
          );
          return card.render(product);
        }),
      });
    });

    this.events.on("card:select", (product) => {
      this.catalog.setSelected(product as IProduct);
    });

    this.events.on("catalog:selected", () => {
      const card = new CardPreview(
        cloneTemplate<HTMLDivElement>("#card-preview"),
        CDN_URL,
      );
      const product = this.catalog.getSelected();
      this.modal.render({
        content: card.render(product ? product : undefined),
      });
      this.modal.show = true;
    });

    this.events.on("modal:close", () => {
      this.modal.show = false;
    })
  }

  start() {
    this.events.emit("catalog:load");
  }
}

const presenter = new Presenter(
  catalog,
  basket,
  events,
  client,
  gallery,
  modal,
);

presenter.start();
