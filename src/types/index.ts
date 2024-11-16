export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IErrorMessage {
  error: string;
}

interface IContacts {
	email: string;
	phone: string;
}

interface IOrderPayment {
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

export interface OrderPaidEvent {
  orderId: string;
  paymentStatus: boolean;
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

// Реализация типов данных АПИ и модели
export interface IApiListResponse<T> {
  total: number;
  items: T[];
}

export interface IProductAPI {
	getProductList: () => Promise<IApiListResponse<IProduct>>;
	getProduct: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult[]>;
}

// Формируем тип данных для модели данных
export interface AppState {
	product: IProduct;
	productList: IApiListResponse<IProduct>;

	selectedProduct: IProduct | null;
	basket: Map<string, number>;
	basketTotal: number;
	contacts: IContacts;
	order: IOrderPayment;

  errorMessage: IErrorMessage;

  getProductList: () => Promise<IApiListResponse<IProduct>>;
	getProduct: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult[]>;

	restoreState(): void;
	persistState(): void;

	addProduct(product: IProduct): void;
	removeProduct(id: string): void;
  fillAddres(contacts: IContacts): void;
	fillContacts(contacts: IContacts): void;
	isValidContacts(): boolean;
  isValidAddress(): boolean;
  OrderPaid(): void;
}

export interface IBasketModel {
  items: Map<string, number>;
  price: number | null;

  add(id: string): void;
  remove(id: string): void;
}

export interface ICatalogModel {
  items: IProduct[];

  setItems(items: IProduct[]): void;
  getProduct(id: string): IProduct;
}

// типы данных для отображений
export interface IProductCardUI {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IProductCardSetting {
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;

  itemClass: string;
  compactClass: string;
  activeItemClass: string;
  isCompact: boolean;
}

export interface IBasketOnPageUI {
  counter: HTMLSpanElement;
}

export interface IBasketOnPageSetting {
  counterText: string;
}

export interface IBasketSetting {
  itemIndex: string;
  title: string;
  price: string;
  delete: string;
}

export interface IGallery {
  items: HTMLUListElement;
}

export interface ISuccessUI {
  image: string;
  title: string;
  description: string;
}

export interface ISuccessSetting {
  background: string;
  title: string;
  description: string;
}

export interface IModalUI {
  content: string;
	messageErrorClass: string;
  isOpen: boolean;

  onClose: () => void;
}

export interface IModalSetting {
  close: string;
  content: string;
  message: string;
  activeClass: string;
	messageErrorClass: string;
}