import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import Setting from './Setting'
import { promptText } from './prompts'
import { useOpenAI } from '../services/OpenAiContext'

export default function EnglishCorrectnessChecker(): ReactElement {
	const [text, setText] = useState('This is a sample text')
	const [answer, setAnswer] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const openai = useOpenAI()
	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setText(event.target.value)
		},
		[]
	)

	const handleSumit = useCallback(async (): Promise<void> => {
		setIsSubmitting(true)
		await openai.chatCompletion({
			systemPrompt: promptText,
			userPrompt: text,
			onContent: (content: string): void => {
				setAnswer(ans => ans + content)
			}
		})
		setIsSubmitting(false)
	}, [openai, text])

	return (
		<>
			<Setting />
			Prompt Text
			<textarea
				className='text-black'
				cols={30}
				rows={10}
				value={promptText}
				readOnly
			/>
			Input Text
			<textarea
				className='text-black'
				cols={30}
				rows={10}
				value={text}
				onChange={handleTextChange}
			/>
			<button type='submit' onClick={handleSumit} disabled={isSubmitting}>
				Submit
			</button>
			<hr />
			<h3>Answer</h3>
			<hr />
			<textarea
				className='text-black'
				cols={30}
				rows={30}
				value={answer}
				readOnly
			/>
		</>
	)
}
