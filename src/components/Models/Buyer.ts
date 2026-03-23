import { IBuyer, TPayment } from "../../types";

export class Buyer implements IBuyer  {

    payment: TPayment;
    address: string;
    email: string;
    phone: string;

    constructor() {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    check(): Record<string, string> {
        const result: Record<string, string> = {};
        if (this.payment.length === 0)
            result['payment'] = 'Не указан способ оплаты';
        if (this.address.length === 0)
            result['address'] = 'Не указан адрес';
        if (this.email.length === 0)
            result['email'] = 'Не указан электронный адрес';
        if (this.phone.length === 0)
            result['phone'] = 'Не указан телефон';
        return result;
    }

    setPayment(payment: TPayment) {
        this.payment = payment;
    }

    setAddress(address: string) {
        this.address = address;
    }

    setEmail(email: string) {
        this.email = email;
    }

    setPhone(phone: string) {
        this.phone = phone
    }

}