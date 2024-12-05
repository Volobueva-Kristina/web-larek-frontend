export interface IProduct {
	id: string;
	description: string | string[];
	image: string;
	title: string;
	category: string;
	price: number;
	indexInBasket?: string;
}

export interface IProductsData {
	items: IProduct;
	getCards(): IProduct[];
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface IOrderPayment {
	payment: string;
	address: string;
}

export interface IOrder extends IContacts, IOrderPayment {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IBasket {
	items: IProduct[];
	totalPrice: number | null;
}

export interface IPage {
	items: IProduct[];
	counter: number;
}

export interface IProductData {
	items: IProduct[];

	getCard(id: string): IProduct;
	getProductsList(): IProduct[];
	setProductsList(items: IProduct[]): void;
	setPreview(item: IProduct): void;
}

export interface IUserData {
	userInfo: TFormInfo;
	formErrors: Partial<Record<keyof IOrder, string>>;
	getUserContacts(): IContacts;
	getUserPayment(): IOrderPayment;
}

export type TFormInfo = Pick<IOrder, 'payment' | 'address' | 'phone' | 'email'>;

export interface IEventEmitter {
	emit: (event: string, data: unknown) => void;
}

export interface IBasketData {
	basket: IBasket;
	addtoBasket(item: IProduct): void;
	removeFromBasket(item: IProduct): void;
	getProductsList(): IProduct[];
	clearBasket(): void;
	updateBasket(basket: IBasket): void;
	getTotalPrice(): number | null;
	getStatusAddingToBasket(item: IProduct): boolean;
}