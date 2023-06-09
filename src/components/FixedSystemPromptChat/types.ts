import type { IChatCompletionMessage } from '../../services/OpenAiContext'

export interface IPrompt {
	key: string
	systemPrompt: string
	userPrompt?: string
}

export interface IMessage extends IChatCompletionMessage {
	timestamp: Date
	id: number
}
