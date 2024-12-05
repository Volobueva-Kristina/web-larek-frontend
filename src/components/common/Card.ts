import { Component } from '../base/Components';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { category } from '../../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected _indexInBasket?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._indexInBasket = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}

	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this._category.className = this._category.className
			.split(' ')
			.filter((cls) => cls === 'card__category')
			.join(' ');
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this._category.classList.add(category.soft);
				break;
			case 'другое':
				this._category.classList.add(category.other);
				break;
			case 'дополнительное':
				this._category.classList.add(category.additional);
				break;
			case 'кнопка':
				this._category.classList.add(category.button);
				break;
			case 'хард-скил':
				this._category.classList.add(category.hard);
				break;
		}
	}

	set price(value: number | null) {
		if (value !== null) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}

	set description(value: string | string[]) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this._button.textContent = value;
	}

  updateButtonText(isItemInBasket: boolean) {
    if (this._button) {
      this._button.textContent = isItemInBasket ? 'Удалить' : 'В корзину';
    }
  }

	set indexInBasket(value: string) {
		this._indexInBasket.textContent = value;
	}

	get indexInBasket(): string {
		return this._indexInBasket.textContent || '';
	}
}
