import { Component } from '../base/Components';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: string;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: string) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}

	get total(): string {
		return this._description.textContent;
	}
}
