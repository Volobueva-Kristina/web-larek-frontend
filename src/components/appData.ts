import { EventEmitter,
	IEvents
} from './base/events';
import {
	IProduct,
	IOrder,
	FormErrors,
	IContacts,
	IOrderPayment,
	IProductData,
	IUserData,
	IBasket,
	TFormInfo,
	IBasketData
} from '../types';

export class ProductData implements IProductData {
	protected _items: IProduct[] = [];
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	get items() {
		return this._items;
	}

	setProductsList(items: IProduct[]) {
		this._items = items;
		this.events.emit('catalogCards:change', { _items: this._items });
	}

	getProductsList(): IProduct[] {
		return this._items;
	}

	getCard(id: string): IProduct {
		return this._items.find((card) => card.id === id) || null;
	}

	setPreview(item: IProduct): void {
		this._preview = item.id;
		this.events.emit('preview:changed', item);
	}
}

export class BasketData implements IBasketData {
	basket: IBasket = {
		items: [], // Пустой массив для товаров
		totalPrice: 0, // Общая стоимость корзины
	};

	constructor(protected events: IEvents) {
		this.events = events;
	}

	addtoBasket(item: IProduct) {
		if (this.basket.items.indexOf(item) === -1) {
			this.basket.items.push(item);
			this.basket.totalPrice += item.price;
			this.events.emit('basket:change', this.basket);
		}
	}

	removeFromBasket(item: IProduct) {
		const itemIndex = this.basket.items.indexOf(item);
		if (itemIndex !== -1) {
			this.basket.items.splice(itemIndex, 1);
			this.basket.totalPrice -= item.price;
			this.events.emit('basket:change', this.basket);
		}
	}

	getProductsList(): IProduct[] {
		return this.basket.items;
	}

	clearBasket(): void {
		this.basket.items = [];
		this.basket.totalPrice = 0;
		this.events.emit('basket:change', this.basket);
	}

	updateBasket(basket: IBasket): void {
		this.basket.items = [...basket.items];
		this.basket.totalPrice = basket.totalPrice;
		this.events.emit('basket:change', this.basket);
	}

	getTotalPrice(): number | null {
		return this.basket.totalPrice;
	}

	getStatusAddingToBasket(item: IProduct): boolean {
		return this.basket.items.indexOf(item) !== -1;
	}
}

export class UserData implements IUserData {
	protected _userInfo: TFormInfo = {
		email: '',
		phone: '',
		payment: '',
		address: '',
	};

	formErrors: Partial<Record<keyof IOrder, string>> = {};

	constructor(protected events: IEvents) {
		this.events = events;
	}

	get userInfo() {
		return this._userInfo;
	}

	getUserContacts(): IContacts {
		return {
			email: this._userInfo.email,
			phone: this._userInfo.phone,
		};
	}

	getUserPayment(): IOrderPayment {
		return {
			payment: this._userInfo.payment,
			address: this._userInfo.address,
		};
	}

	setOrderField(field: keyof IOrderPayment, value: string) {
		this._userInfo[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this._userInfo);
		}
	}
	setContactsField(field: keyof IContacts, value: string) {
		this._userInfo[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this._userInfo);
		}
	}
	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this._userInfo.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this._userInfo.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		if (!this._userInfo.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._userInfo.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
