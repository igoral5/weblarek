// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventEnum = 
  | "catalog:load"          // Иницирует загрузку каталога
  | "catalog:change"        // Каталог изменен
  | "catalog:select"        // Выбирается продукт
  | "catalog:selected"      // Продукт выбран, 
  | "modal:close"           // Закрываем модальное окно
  | "basket:open"           // Открытие корзины пользователя
  | "basket:change"         // Изменилась корзина покупателя
  | "order:open"            // Открытие первой части ввода заказа, способ оплаты и адрес доставки
  | "order:payment"         // Ввод способа оплаты
  | "order:address"         // Ввод адреса
  | "order:close"           // Закрываем ввод первой части ввода заказа
  | "buyer:change"          // Покупатель изменен
  | "contacts:email"        // Ввод email
  | "contacts:phone"        // Ввод телефона
  | "contacts:close"        // Закрытие второй части ввода заказа
  | "*";                    // Все события
type EventName = EventEnum | RegExp;
type Subscriber = Function;
type EmitterEvent = {
  eventName: string;
  data: unknown;
};

export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  off(event: EventName, callback: Subscriber): void;
  emit<T extends object>(event: EventEnum, data?: T): void;
  trigger<T extends object>(
    event: EventEnum,
    context?: Partial<T>,
  ): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
  _events: Map<EventName, Set<Subscriber>>;

  constructor() {
    this._events = new Map<EventName, Set<Subscriber>>();
  }

  /**
   * Установить обработчик на событие
   */
  on<T extends object>(eventName: EventName, callback: (event: T) => void) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set<Subscriber>());
    }
    this._events.get(eventName)?.add(callback);
  }

  /**
   * Снять обработчик с события
   */
  off(eventName: EventName, callback: Subscriber) {
    if (this._events.has(eventName)) {
      this._events.get(eventName)!.delete(callback);
      if (this._events.get(eventName)?.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  /**
   * Инициировать событие с данными
   */
  emit<T extends object>(eventName: string, data?: T) {
    this._events.forEach((subscribers, name) => {
      if (name === "*")
        subscribers.forEach((callback) =>
          callback({
            eventName,
            data,
          }),
        );
      if (
        (name instanceof RegExp && name.test(eventName)) ||
        name === eventName
      ) {
        subscribers.forEach((callback) => callback(data));
      }
    });
  }

  /**
   * Слушать все события
   */
  onAll(callback: (event: EmitterEvent) => void) {
    this.on("*", callback);
  }

  /**
   * Сбросить все обработчики
   */
  offAll() {
    this._events = new Map<EventName, Set<Subscriber>>();
  }

  /**
   * Сделать коллбек триггер, генерирующий событие при вызове
   */
  trigger<T extends object>(eventName: string, context?: Partial<T>) {
    return (event: object = {}) => {
      this.emit(eventName, {
        ...(event || {}),
        ...(context || {}),
      });
    };
  }
}
