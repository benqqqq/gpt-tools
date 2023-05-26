import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import { useOpenAI } from '../api/OpenAiContext'

export default function EnglishCorrectnessChecker(): ReactElement {
	const [text, setText] = useState('')
	const [answer, setAnswer] = useState('')
	const openai = useOpenAI()
	const handleOnChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setText(event.target.value)
		},
		[]
	)

	const handleSumit = useCallback(async (): Promise<void> => {
		const resp = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: text
				}
			]
		})
		setAnswer(JSON.stringify(resp.data))
	}, [openai, text])

	return (
		<>
			<textarea
				className='text-black'
				cols={30}
				rows={10}
				value={text}
				onChange={handleOnChange}
			/>

			<button type='submit' onClick={handleSumit}>
				Submit
			</button>

			<hr />
			<h3>Answer</h3>
			<hr />
			{answer}
		</>
	)
}
