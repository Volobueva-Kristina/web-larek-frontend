import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Form } from './Form';
import { IOrder } from '../../types';

export class Contacts extends Form<IOrder> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container, events);

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);
	}
}
