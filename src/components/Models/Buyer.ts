import { IBuyer, TPayment } from "../../types";

type TError = Record<string,string>;

/**
 * Класс покупатель
 */
export class Buyer {

    protected buyer: IBuyer;

    /**
     * Создает покупателя
     */
    constructor() {
        this.buyer = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        }
    }

    /**
     * Производит проверку, возвращает объект, в котором ключом, является поле, а значением - проблемы с этим полем
     * Если проблем нет, возвращается пустой объект
     * @returns Найденные ошибки
     */
    public validate(): TError {
        const result: TError = {};
        if (this.buyer.payment.length === 0)
            result['payment'] = 'Не указан способ оплаты';
        if (this.buyer.address.length === 0)
            result['address'] = 'Не указан адрес';
        if (this.buyer.email.length === 0)
            result['email'] = 'Не указан электронный адрес';
        if (this.buyer.phone.length === 0)
            result['phone'] = 'Не указан телефон';
        return result;
    }

    /**
     * Возвращает покупателя
     * @returns Покупатель
     */
    public getBuyer(): IBuyer {
        return this.buyer;
    }

    /**
     * Устанавливает покупателя
     * @param buyer Покупатель
     */
    public setBuyer(buyer: IBuyer) {
        this.buyer = buyer;
    }

    /**
     * Устанавливает способ оплаты
     * @param payment Способ оплаты online, cash
     */
    public setPayment(payment: TPayment) {
        this.buyer.payment = payment;
    }

    /**
     * Устанавливает адрес
     * @param address Адрес
     */
    public setAddress(address: string) {
        this.buyer.address = address;
    }

    /**
     * Устанавливает email
     * @param email email
     */
    public setEmail(email: string) {
        this.buyer.email = email;
    }

    /**
     * Устанавливает телефон
     * @param phone Телефон
     */
    public setPhone(phone: string) {
        this.buyer.phone = phone
    }

}