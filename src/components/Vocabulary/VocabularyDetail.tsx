import { CircularProgress } from '@mui/material'
import type { ReactElement } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useOpenAI } from '../../services/OpenAiContext'
import Markdown from '../common/Markdown'
import type { IVocabulary } from './types'

interface IVocabularyDetailProps {
	vocabulary: IVocabulary | undefined
	onDetailGenerated: (detail: string) => void
}

const GPT_TEMPERATURE = 1

const systemPrompt = `Suppose you are an English teacher with a specialization in vocabulary instruction. A user will provide you with a word, enclosed in triple hash signs. Your job is to thoroughly explain this vocabulary word. Please include the following details in your explanation:

The pronunciation of the word in the International Phonetic Alphabet (IPA) for American English.
The etymology or history of the word, including its roots and how its usage has evolved over time.
The translation of the word into Mandarin Chinese (Taiwan).
Example sentences demonstrating how the word is used in various contexts.
A list of vocabulary words that are similar in meaning or usage, along with a brief explanation of when it is appropriate to use each word.
In addition, feel free to include any other information you believe will be useful for someone trying to learn and understand this vocabulary word. Be sure to organize this information in a clear and appealing way, using markdown formatting to enhance its readability.`

export default function VocabularyDetail({
	vocabulary,
	onDetailGenerated
}: IVocabularyDetailProps): ReactElement {
	const openai = useOpenAI()
	const [isLoading, setIsLoading] = useState(false)
	const [detail, setDetail] = useState('')
	const finishEvent = useMemo(() => new CustomEvent('finishEvent'), [])

	useEffect(() => {
		if (!vocabulary) {
			return
		}

		if (vocabulary.detail) {
			setDetail(vocabulary.detail)
			return
		}

		const submit = async (): Promise<void> => {
			setIsLoading(true)
			setDetail('')
			try {
				await openai.chatCompletion({
					messages: [
						{
							role: 'system',
							content: systemPrompt
						},
						{
							role: 'user',
							content: `###${vocabulary.word}###`
						}
					],
					model: 'gpt-4o-mini',
					onContent: (content: string): void => {
						setDetail(previousDetail => previousDetail + content)
					},
					onFinish: (): void => {
						setIsLoading(false)
						document.dispatchEvent(finishEvent)
					},
					temperature: GPT_TEMPERATURE
				})
			} catch (error) {
				const errorMessage = (error as Error).message
				setDetail(errorMessage)
				setIsLoading(false)
			}
		}

		void submit()
	}, [finishEvent, openai, vocabulary])

	useEffect(() => {
		const listener = (): void => {
			if (vocabulary) {
				onDetailGenerated(detail)
			}
		}
		document.addEventListener('finishEvent', listener)

		return () => {
			document.removeEventListener('finishEvent', listener)
		}
	}, [detail, finishEvent, onDetailGenerated, vocabulary])

	const highlightedDetail = vocabulary
		? detail.replaceAll(new RegExp(vocabulary.word, 'gi'), `**$&**`)
		: detail

	return (
		<div>
			<h3>VocabularyDetail</h3>
			{isLoading ? <CircularProgress /> : undefined}
			{vocabulary ? <div>{vocabulary.word}</div> : undefined}
			{detail ? <Markdown content={highlightedDetail} /> : undefined}
		</div>
	)
}
