import { sequenceDiagramDocument } from './mermaidDocuments'

export const promptGenerateMermaidSequenceDiagram = `
 Please use mermaid syntax (refer to the document below) to draw a sequence diagram that describes the concept discussed above.
 ${sequenceDiagramDocument}
`

export const promptImportContext = `Based on the given context, please wait for my question.`

export default {
	promptGenerateMermaidSequenceDiagram,
	promptImportContext
}
