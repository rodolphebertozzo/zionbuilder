import { useContentStore, useElementDefinitionsStore } from '../store';
import { generateUID } from '/@/common/utils';
import { regenerateUIDs, removeElementID } from '/@/editor/utils';
import { applyFilters } from '/@/common/modules/hooks';
import { update, get, isPlainObject, each, pull } from 'lodash-es';
import { type ElementType } from '../models/ElementType';
import { serverRequest } from '../api';

export class ZionElement {
	// Element data for DB
	public element_type = '';
	public content: string[] = [];
	public uid = '';
	// Make it ref so we can watch it
	public options: { [key: string]: unknown } = {};
	// Helpers
	public renderAttributes: RenderAttributes;
	public parentUID = '';
	public elementDefinition: ElementType;
	public isHighlighted = false;
	public activeElementRename = false;
	public scrollTo = false;
	public isCut = false;
	public widgetID = '';
	public loading = false;
	public serverRequester = null;
	public addedTime = 0;
	public isWrapper = false;
	public callbacks: Record<string, unknown> = {};

	constructor(elementData: ZionElementConfig, parent: string) {
		const contentStore = useContentStore();
		const elementDefinitionStore = useElementDefinitionsStore();

		this.elementDefinition = elementDefinitionStore.getElementDefinition(elementData.element_type);
		this.isWrapper = this.elementDefinition.wrapper;

		const parsedElement = Object.assign(
			{},
			{
				uid: generateUID(),
				content: [],
				options: {},
			},
			elementData,
		);

		// Set the options
		const options = isPlainObject(parsedElement.options) ? parsedElement.options : {};

		// Check the type of advanced options
		if (typeof options._advanced_options !== 'undefined' && !isPlainObject(parsedElement.options._advanced_options)) {
			options._advanced_options = {};
		}

		this.uid = parsedElement.uid;
		this.element_type = parsedElement.element_type;
		this.options = options;

		// UI logic
		this.parentUID = parent;
		this.addedTime = Date.now();

		// Set children
		const content: string[] = [];
		if (Array.isArray(elementData.content)) {
			// Register children
			elementData.content.forEach(el => {
				const childElement = contentStore.registerElement(el, elementData.uid);
				content.push(childElement.uid);
			});
		}

		this.content = content;

		// Check to see if this is a widget
		if (elementData.widget_id) {
			this.widgetID = elementData.widget_id;
		}

		// Add requester
		this.serverRequester = this.createRequester();
	}

	get isRepeaterProvider(): boolean {
		return !!this.getOptionValue('_advanced_options.is_repeater_provider', false);
	}

	get isRepeaterConsumer(): boolean {
		return !!this.getOptionValue('_advanced_options.is_repeater_consumer', false);
	}

	get parent(): ZionElement | null {
		const contentStore = useContentStore();
		return contentStore.getElement(this.parentUID);
	}

	get name(): string {
		return <string>get(this.options, '_advanced_options._element_name', this.elementDefinition.name);
	}

	set name(newName) {
		window.zb.run('editor/elements/rename', {
			elementUID: this.uid,
			newName,
		});
	}

	get elementCssId() {
		let cssID = this.getOptionValue('_advanced_options._element_id', this.uid);
		cssID = applyFilters('zionbuilder/element/css_id', cssID, this);
		return cssID;
	}

	createRequester() {
		const request = (data, successCallback, failCallback) => {
			// Pass to filter with all the extra arguments
			const parsedData = JSON.parse(
				JSON.stringify({
					...applyFilters('zionbuilder/server_request/element_requester_data', {}, this),
					...data,
					useCache: true,
				}),
			);

			return serverRequest.request(parsedData, successCallback, failCallback);
		};

		return {
			request,
		};
	}

	setName(newName: string) {
		this.updateOptionValue('_advanced_options._element_name', newName);
	}

	getOptionValue(path: string, defaultValue: unknown = null) {
		return get(this.options, path, defaultValue);
	}

	updateOptionValue(path: string | null, newValue: unknown): Record<string, unknown> {
		if (path) {
			update(this.options, path, () => newValue);
		} else {
			update(this, 'options', () => newValue);
		}

		return this.options;
	}

	highlight() {
		if (!this.isHighlighted) {
			this.isHighlighted = true;
		}
	}

	unHighlight() {
		if (this.isHighlighted) {
			this.isHighlighted = false;
		}
	}

	// Element visibility
	get isVisible(): boolean {
		return <boolean>get(this.options, '_isVisible', true);
	}

	set isVisible(isVisible: boolean) {
		window.zb.run('editor/elements/set_visibility', {
			elementUID: this.uid,
			isVisible,
		});
	}

	setVisibility(isVisible: boolean) {
		update(this.options, '_isVisible', () => isVisible);
	}

	get indexInParent() {
		if (this.parent) {
			return this.parent.content.indexOf(this.uid);
		}

		return 0;
	}

	delete() {
		window.zb.run('editor/elements/delete', {
			elementUID: this.uid,
		});
	}

	duplicate() {
		return window.zb.run('editor/elements/duplicate', {
			element: this,
		});
	}

	toJSON(): ZionElementConfig {
		const contentStore = useContentStore();

		const content = this.content.map(child => {
			const element = contentStore.getElement(child);

			return element.toJSON();
		});

		const elementData = {
			uid: this.uid,
			content: content,
			element_type: this.element_type,
			options: this.options,
		};

		if (this.widgetID) {
			elementData.widget_id = this.widgetID;
		}

		return JSON.parse(JSON.stringify(elementData));
	}

	wrapIn(wrapperType = 'container') {
		window.zb.run('editor/elements/wrap_element', {
			wrapperType,
			element: this,
		});
	}

	replaceChild(oldElement: ZionElement, newElement: ZionElement) {
		const index = this.content.indexOf(oldElement.uid);

		// Remove from old parent
		if (newElement.parent) {
			pull(newElement.parent?.content, newElement.uid);
		}

		// Set the new parent
		newElement.parentUID = this.uid;
		this.content.splice(index, 1, newElement.uid);
	}

	addChild(element: ZionElement | ZionElementConfig, index = -1): ZionElement {
		let elementInstance = null;

		if (element instanceof ZionElement) {
			elementInstance = element;
		} else {
			const contentStore = useContentStore();
			elementInstance = contentStore.registerElement(element, this.uid);
		}

		// Set the parent
		index = index === -1 ? this.content.length : index;
		elementInstance.parentUID = this.uid;
		this.content.splice(index, 0, elementInstance.uid);

		return elementInstance;
	}

	move(newParent: ZionElement, index = -1) {
		if (!this.parent) {
			return;
		}

		this.parent.removeChild(this);
		newParent.addChild(this, index);
	}

	addChildren(elements: ZionElement[] | ZionElementConfig[], index = -1): ZionElement[] {
		const addedElements = <ZionElement[]>[];
		each(elements, element => {
			addedElements.push(this.addChild(element, index));

			// In case we need to insert multiple elements at an index higher then the last item, we need to increment the index
			index = index !== -1 ? index + 1 : index;
		});

		return addedElements;
	}

	removeChild(element: ZionElement) {
		const index = this.content.indexOf(element.uid);
		this.content.splice(index, 1);
	}

	getClone() {
		const elementAsJson = this.toJSON();
		let clonedElement = regenerateUIDs(elementAsJson);
		clonedElement = removeElementID(clonedElement);

		return clonedElement;
	}

	// Element API
	trigger(type, ...data) {
		const callbacks = this.callbacks[type] || [];

		callbacks.forEach(calback => {
			calback(...data);
		});
	}

	on(type, callback) {
		this.callbacks[type] = this.callbacks[type] || [];
		this.callbacks[type].push(callback);
	}

	off(type, callback) {
		const callbacks = this.callbacks[type] || [];
		const callbackIndex = callbacks.indexOf(callback);

		if (callbackIndex !== -1) {
			this.callbacks[type].splice(callbackIndex, 1);
		}
	}
}
