export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IProductsData {
  items: IProduct[];
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

export interface IProductData{
  items: IProduct[];
  preview: string | null;

  getCard(id: string): IProduct;
  getProductsList(): IProduct[];
}

export interface IBasketData{
  addtoBasket(id: string): void;
  removeFromBasket(id: string): void;
  getProductsList(): IProduct[];
  clearBasket(): void;
  updateBasket(basket: IBasket): void;
  getTotalPrice(): number | null;
  setProductsList(products: IProduct[]): void;
  getStatusAddingToBasket(id: string): boolean;
}

export interface IUserData{
  getUserContacts(): IContacts;
  getUserPayment(): IOrderPayment;

  setUserContacts(userData: IContacts): void;
  setUserPayment(userData: IOrderPayment): void;

  checkUserValidationContacts(data: Record<keyof IContacts, string>): boolean;
  checkUserValidationPayment(data: Record<keyof IOrderPayment, string>): boolean;
}

export interface IPageData{
  setCounter(value: number): void;
  setProductList(items: IProduct[]): void;
}

export interface IProductAPI {
	getProductList: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export interface IEventEmitter {
  emit: (event: string, data: unknown) => void;
}

export interface IViewConstructor {
  new (container: HTMLElement, events?: IEventEmitter): IView;
}

export interface IView {
  render(data?: object): HTMLElement;
}