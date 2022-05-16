import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';

const schemas = ref<Record<string, object>>({
	element_advanced: window.ZnPbComponentsData.schemas.element_advanced,
	element_styles: window.ZnPbComponentsData.schemas.styles,
	typography: window.ZnPbComponentsData.schemas.typography,
	videoOptionSchema: window.ZnPbComponentsData.schemas.video,
	backgroundImageSchema: window.ZnPbComponentsData.schemas.background_image,
	shadowSchema: window.ZnPbComponentsData.schemas.shadow,
	styles: window.ZnPbComponentsData.schemas.styles,
});

export const useOptionsSchemas = () => {
	const getSchema = (schemaId: string) => {
		return cloneDeep(schemas.value[schemaId]) || {};
	};

	const registerSchema = (schemaId: string, schema: Record<string, object>) => {
		schemas.value[schemaId] = schema;
	};

	return {
		schemas,
		getSchema,
		registerSchema,
	};
};
