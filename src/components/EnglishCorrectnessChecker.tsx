import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import Setting from './Setting'
import {
	englishTeacherSystemPromptInYaml,
	englishTeacherUserPrompt,
	generateUserPrompt
} from './prompts'
import { useOpenAI } from '../services/OpenAiContext'
import yaml from 'js-yaml'
import { diffWords } from 'diff'

interface JSONAnswer {
	corrections?: ({
		sentence?: number
		original?: string
		refined?: string
		score?: string
		reasons?: string[]
		diff?: {
			added: boolean
			removed: boolean
			value: string
		}[]
	} | null)[]
	grade?: {
		score?: string
		grade_reasons?: string[]
		improve_directions?: string[]
	}
}
export default function EnglishCorrectnessChecker(): ReactElement {
	const [text, setText] = useState('This is a sample text')
	const [answer, setAnswer] = useState('')
	const [jsonAnswer, setJsonAnswer] = useState<JSONAnswer>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const openai = useOpenAI()
	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setText(event.target.value)
		},
		[]
	)

	const handleSumit = useCallback(async (): Promise<void> => {
		setAnswer('')
		setIsSubmitting(true)
		await openai.chatCompletion({
			systemPrompt: englishTeacherSystemPromptInYaml,
			userPrompt: generateUserPrompt(englishTeacherUserPrompt, text),
			onContent: (content: string): void => {
				setAnswer(ans => ans + content)
			},
			onFinish: (): void => {
				setIsSubmitting(false)
			}
		})
	}, [openai, text])

	const handleFocus = useCallback(() => {
		// setText('')
	}, [])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.metaKey && event.key === 'Enter') {
				void handleSumit()
			}
		},
		[handleSumit]
	)

	useEffect(() => {
		try {
			if (answer) {
				const loadedAnswer = yaml.load(answer) as JSONAnswer
				loadedAnswer.corrections = loadedAnswer.corrections?.map(correction => {
					if (!correction) {
						return correction
					}
					return {
						...correction,
						diff: diffWords(
							correction.original ?? '',
							correction.refined ?? ''
						) as {
							added: boolean
							removed: boolean
							value: string
						}[]
					}
				})
				setJsonAnswer(loadedAnswer)
			}
		} catch {
			// ignore because the answer might still be parsing
		}
	}, [answer])

	return (
		<>
			<Setting />
			Prompt Text
			{/* <textarea */}
			{/*	className='text-black' */}
			{/*	cols={30} */}
			{/*	rows={10} */}
			{/*	value={englishTeacherSystemPromptInYaml} */}
			{/*	readOnly */}
			{/* /> */}
			Input Text
			<textarea
				className='text-black'
				cols={30}
				rows={10}
				value={text}
				onChange={handleTextChange}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
			/>
			<button type='submit' onClick={handleSumit} disabled={isSubmitting}>
				Submit
			</button>
			{isSubmitting ? 'ing ...' : ''}
			<hr />
			{/* <h3>Answer</h3> */}
			{/* <hr /> */}
			{/* <h4>JSON</h4> */}
			{/* {answer} */}
			{/* {JSON.stringify(jsonAnswer)} */}
			{/* <h4>Prettier</h4> */}
			{jsonAnswer.corrections?.map(
				correction =>
					correction && (
						<div key={correction.sentence}>
							<h2 className='text-center text-lg'>{correction.sentence}</h2>
							<ul>
								{correction.diff?.map(({ added, removed, value }) => (
									<span
										key={value}
										className={
											added
												? 'text-green-500'
												: (removed
												? 'text-red-300 line-through'
												: '')
										}
									>
										{value}
									</span>
								))}
							</ul>
							<ul>
								{/* <li>original: {correction.original}</li> */}
								{/* <li>refined: {correction.refined}</li> */}
								<li>score: {correction.score}</li>
							</ul>
							<ol className='list-decimal'>
								{correction.reasons?.map(reason => (
									<li key={reason}>{reason}</li>
								))}
							</ol>
							diff:
						</div>
					)
			)}
			<h3>Overall</h3>
			<hr />
			{jsonAnswer.grade ? (
				<div>
					<ul>
						<li>grade: {jsonAnswer.grade.score}</li>
						<li>grade_reasons:</li>
					</ul>
					<ol className='list-decimal'>
						{jsonAnswer.grade.grade_reasons?.map(reason => (
							<li key={reason}>{reason}</li>
						))}
					</ol>
					<strong>improve_directions:</strong>
					<ol className='list-decimal'>
						{jsonAnswer.grade.improve_directions?.map(reason => (
							<li key={reason}>{reason}</li>
						))}
					</ol>
				</div>
			) : undefined}
			{/* <textarea */}
			{/*	className='text-black' */}
			{/*	cols={30} */}
			{/*	rows={30} */}
			{/*	value={answer} */}
			{/*	readOnly */}
			{/* /> */}
		</>
	)
}
