import type { ReactElement } from 'react'
import type React from 'react'
import { createContext, useContext, useMemo } from 'react'
import { Configuration, OpenAIApi } from 'openai'

// Create the context
const OpenAIContext = createContext<OpenAIApi | undefined>(undefined)

// Create a provider component
export function OpenAIProvider({
	children
}: {
	children: React.ReactNode
}): ReactElement {
	// Create the OpenAIApi instance
	const openai = useMemo(() => {
		const configuration = new Configuration({
			apiKey: ''
		})
		return new OpenAIApi(configuration)
	}, [])

	return (
		<OpenAIContext.Provider value={openai}>{children}</OpenAIContext.Provider>
	)
}

export function useOpenAI(): OpenAIApi {
	const openai = useContext(OpenAIContext)
	if (!openai) {
		throw new Error('useOpenAI must be used within a OpenAIProvider')
	}
	return openai
}

export default OpenAIContext
