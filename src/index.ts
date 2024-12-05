import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import {API_URL,
  CDN_URL
} from './utils/constants';
import { EventEmitter } from './components/base/events';
import {IContacts,
  IOrderPayment,
  IOrder,
  IProduct
} from './types';
import {ProductData,
  UserData,
  BasketData
} from './components/appData';

import {cloneTemplate,
  ensureElement
} from './utils/utils';

import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/common/Order';
import { Contacts } from './components/common/Contacts';
import { Success } from './components/common/Success';
import { Card } from './components/common/Card';

//Инициализация
const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Модель данных приложения
const basketData = new BasketData(events);
const productData = new ProductData(events);
const userData = new UserData(events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Изменилось состояние валидации формы
events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
	const { phone, email } = errors;
	contacts.valid = !phone && !email;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderPayment; value: string }) => {
		userData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContacts; value: string }) => {
		userData.setContactsField(data.field, data.value);
	}
);

// открыта форма оформления заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			errors: [],
		}),
	});
});

// открыта форма оформления заказа с контактной информацией пользователя
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			errors: [],
		}),
	});
});

//изменился способ оплаты
events.on(
	'order.payment:change',
	(data: { field: keyof IOrderPayment; value: string }) => {
		userData.setOrderField(data.field, data.value);
	}
);

// Выбрана карточка
events.on('card:select', (item: IProduct) => {
	productData.setPreview(item);
});

// Открыть выбранную карточку
events.on('preview:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (basketData.basket.items.indexOf(item) === -1) {
				events.emit('basket:add', item);
				card.updateButtonText(true);
			} else {
				events.emit('basket:remove', item);
				card.updateButtonText(false);
			}
		},
	});
	if (basketData.getStatusAddingToBasket(item)) {
		card.updateButtonText(true);
	} else {
		card.updateButtonText(false);
	}
	modal.render({
		content: card.render({
			id: item.id,
			description: item.description,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		}),
	});
});

//удаление из корзины
events.on('basket:remove', (item: IProduct) => {
	basketData.removeFromBasket(item);
});

//добавление в корзину
events.on('basket:add', (item: IProduct) => {
	basketData.addtoBasket(item);
});

// Заполняем каталог товаров
events.on('catalogCards:change', () => {
	page.catalog = productData.getProductsList().map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:select', product);
			},
		});
		return card.render(product);
	});
});

// Открыть модальное окно с корзиной
events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			total: basketData.getTotalPrice(),
		}),
	});
});

// Обновляем количество товаров в корзине и устанавливаем счетчик товаров в корзине на главной странице
events.on('basket:change', () => {
	page.counter = basketData.basket.items.length;
	let count = 0;
	const card = basketData.getProductsList().map((product) => {
		const basketCard = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', product);
			},
		});
		count += 1;
		return basketCard.render({
			title: product.title,
			price: product.price,
			id: product.id,
			indexInBasket: `${count}`,
		});
	});
	basket.render({ items: card, total: basketData.getTotalPrice() });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// разблокируем прокрутку страницы если модалка закрыта
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем каталог с сервера
api
	.getProductList()
	.then((products) => {
		productData.setProductsList(products);
	})
	.catch((err) => {
		console.error(err);
	});

//отправка полей формы
events.on('contacts:submit', () => {
	api
		.orderProduct({
			payment: userData.userInfo.payment,
			email: userData.userInfo.email,
			phone: userData.userInfo.phone,
			address: userData.userInfo.address,
			total: basketData.getTotalPrice(),
			items: basketData.basket.items
				.filter((item) => item.price > 0)
				.map((item) => item.id),
		})
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					basketData.clearBasket();
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: basketData.basket.totalPrice.toString(),
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
