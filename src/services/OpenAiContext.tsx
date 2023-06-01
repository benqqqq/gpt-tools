import type React from 'react'
import type { ReactElement } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { ISettingContext } from './SettingContext'
import { useSettingContext } from './SettingContext'
import { createParser } from 'eventsource-parser'

const GPT_TEMPERATURE = 0.8

interface IOpenAiApi {
	chatCompletion: (options: IChatCompletionOptions) => Promise<void>
}

interface IChatCompletionOptions {
	systemPrompt: string
	userPrompt: string
	onContent: (content: string) => void
	onFinish: () => void
}

interface IChatCompletionData {
	choices: {
		delta: {
			content?: string
		}
	}[]
}

const apiNotReady = async (): Promise<void> => {
	throw new Error('OpenAI API not ready')
}

const defaultOpenAiApi: IOpenAiApi = {
	chatCompletion: apiNotReady
}

const chatCompletion = async (
	apiKey: string,
	{ systemPrompt, userPrompt, onContent, onFinish }: IChatCompletionOptions
): Promise<void> => {
	const resp = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: systemPrompt
				},
				{
					role: 'user',
					content: userPrompt
				}
			],
			temperature: GPT_TEMPERATURE,
			stream: true
		})
	})
	const parser = createParser(event => {
		if (event.type === 'event') {
			let data
			try {
				data = JSON.parse(event.data) as IChatCompletionData
			} catch (error) {
				if (event.data === '[DONE]') {
					return
				}
				throw error
			}
			onContent(data.choices[0].delta.content ?? '')
		}
	})
	const reader = resp.body?.getReader()
	if (!reader) {
		throw new Error('no reader')
	}
	try {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
			// eslint-disable-next-line no-await-in-loop
			const { done, value } = await reader.read()
			if (done) {
				onFinish()
				break
			}
			parser.feed(new TextDecoder().decode(value))
		}
	} finally {
		reader.releaseLock()
	}
}

const useOpenAiService = (settingContext: ISettingContext): IOpenAiApi =>
	useMemo(
		() => ({
			chatCompletion: async (options: IChatCompletionOptions) =>
				chatCompletion(settingContext.setting.openaiApiKey, options)
		}),
		[settingContext.setting.openaiApiKey]
	)

// Create the context
const OpenAIContext = createContext<IOpenAiApi>(defaultOpenAiApi)

// Create a provider component
export function OpenAIProvider({
	children
}: {
	children: React.ReactNode
}): ReactElement {
	// Create the OpenAIApi instance
	const settingContext = useSettingContext()
	const openai = useOpenAiService(settingContext)

	return (
		<OpenAIContext.Provider value={openai}>{children}</OpenAIContext.Provider>
	)
}

export function useOpenAI(): IOpenAiApi {
	return useContext(OpenAIContext)
}

export default OpenAIContext
