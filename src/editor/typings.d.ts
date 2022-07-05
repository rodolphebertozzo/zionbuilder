type ZionElementConfig = {
	uid: string;
	content: ZionElementConfig[];
	options: Record<string, unknown>;
	element_type: string;
};

type ZionElement = Omit<ZionElementConfig, 'content'> & {
	content: string[];
	parent: ZionElement | null;
	parentUID: string | null;
	addedTime?: number;
	isHighlighted: boolean;
	delete: function;
	highlight: function;
	unHighlight: function;
	isVisible: boolean;
};

type ZionElementDefinition = {
	category: string;
	// TODO: change unknown to VUE type component??
	component: null | unknown;
	content_orientation: string;
	deprecated: boolean;
	element_type: string;
	icon: string;
	is_child: boolean;
	keywords: string[];
	label: string;
	name: string;
	options: Record<string, unknown>;
	scripts: Record<string, unknown>;
	show_in_ui: boolean;
	style_elements: Record<string, unknown>;
	styles: Record<string, unknown>;
	thumb: string;
	wrapper: boolean;
};

type BuilderArea = {
	id: string;
	name: string;
	element: ZionElement;
};

type ZionPanel = {
	id: string;
};
