import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Form } from './Form';
import { IOrder } from '../../types';

export class Order extends Form<IOrder> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container, events);

		this._cardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this._cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);

		if (this._cardButton) {
			this._cardButton.addEventListener('click', () => {
				this.payment = 'card';
			});
		}

		if (this._cashButton) {
			this._cashButton.addEventListener('click', () => {
				this.payment = 'cash';
			});
		}
	}

	set payment(name: string) {
		this.toggleClass(this._cardButton, 'button_alt-active', name === 'card');
		this.toggleClass(this._cashButton, 'button_alt-active', name === 'cash');

		this.onInputChange('payment', name);
		console.log(this._addressInput.textContent);
	}
}
