import { Component } from '../base/Components';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number | null;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.items = [];
	}

	get list(): HTMLElement[] {
		return [...this._list.childNodes].filter(node => node instanceof HTMLLIElement) as HTMLElement[];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, this._total.textContent === '0');
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(value: number | null) {
		if (value !== 0) {
			this.setText(this._total, `${value} синапсов`);
			this.setDisabled(this._button, false);
		} else {
			this.setText(this._total, 'Бесценно');
			this.setDisabled(this._button, true);
		}
	}
}
