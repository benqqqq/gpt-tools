import type { IChatCompletionMessage } from '../../services/OpenAiContext'

export interface IPromptTemplate {
	key: string
	systemPrompt: string
	userPrompt?: string
	disableMarkdownUserPromptHint?: boolean
}

export interface IMessage extends IChatCompletionMessage {
	timestamp: Date
	id: number
	error?: string
}
