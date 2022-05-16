import './connector'
import { createVNode, render } from 'vue'

import previewApp from './App.vue'
import { useEditorData } from '@zb/editor'

const vNode = createVNode(previewApp)
const editorApp = window.parent.zb.editor.appInstance
const appContext = editorApp._context

// Components
import { InlineEditor } from './components/InlineEditor'
import Element from './components/Element.vue'
import ElementWrapper from './components/ElementWrapper.vue'
import SortableContent from './components/SortableContent.vue'
import RenderValue from './components/RenderValue.vue'
import ElementIcon from './components/ElementIcon.vue'

editorApp.component('Element', Element)
editorApp.component('ElementWrapper', ElementWrapper)
editorApp.component('InlineEditor', InlineEditor)
editorApp.component('SortableContent', SortableContent)
editorApp.component('RenderValue', RenderValue)
editorApp.component('ElementIcon', ElementIcon)

vNode.appContext = appContext

const { editorData } = useEditorData()

const renderElement = document.getElementById(`znpb-preview-${editorData.value.page_id}-area`)

if (renderElement) {
	render(vNode, renderElement)
}

// Cleanup after itself
window.addEventListener('unload', (event) => {
	if (renderElement) {
		render(null, renderElement)
	}
})