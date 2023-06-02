import type { ReactElement } from 'react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import Setting from './Setting'
import {
	englishTeacherSystemPromptInJsonLines,
	englishTeacherUserPrompt,
	generateUserPrompt
} from './prompts'
import { useOpenAI } from '../services/OpenAiContext'
import {
	Checkbox,
	CssBaseline,
	FormControlLabel,
	FormGroup,
	List,
	ListItemText,
	TextareaAutosize
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import type {
	IDataCorrection,
	IDataJsonLine,
	IDataReason,
	IJSONAnswer
} from './types'
import { diffWords } from 'diff'
import { useSnackbar } from './snackbarHooks'

export default function EnglishCorrectnessChecker(): ReactElement {
	const [text, setText] = useState(
		`The sun go down slow in the sky, making it look all orange and pretty. The wind blow gentle and it make the tree leaves make a nice sound, like whispers. Far away, birds fly in the air so nice and free, their wings make shapes on the clouds. When night come, the smell of flowers grow and it smell so good, like something sweet. Everything feel calm and nice, like time stop and nature show its beauty for a little while.`
	)
	const [answer, setAnswer] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const openai = useOpenAI()
	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setText(event.target.value)
		},
		[]
	)
	const [openSnackbar, snackbarComponent] = useSnackbar()
	const [isDebug, setIsDebug] = useState(true)

	const handleSumit = useCallback(async (): Promise<void> => {
		setAnswer('')
		setIsSubmitting(true)
		await openai.chatCompletion({
			systemPrompt: englishTeacherSystemPromptInJsonLines,
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

	const jsonAnswer: IJSONAnswer = useMemo(() => {
		const jsonLines: IDataJsonLine[] = []
		for (const answerLine of answer.split('\n')) {
			try {
				jsonLines.push(JSON.parse(answerLine) as IDataJsonLine)
			} catch {
				// pass
			}
		}

		const result: IJSONAnswer = {
			corrections: [],
			grade: {
				grade_reasons: [],
				improve_directions: []
			}
		}

		for (const jsonLine of jsonLines) {
			if (jsonLine.type === 'correction') {
				const data = jsonLine.data as IDataCorrection
				result.corrections.push({
					sentence: data.line,
					original: data.original,
					refined: data.refined,
					score: data.score,
					reasons: [],
					diff: diffWords(data.original, data.refined).map((d, index) => ({
						...d,
						key: index
					}))
				})
			}
			if (jsonLine.type === 'reason') {
				const data = jsonLine.data as IDataReason
				const correction = result.corrections.find(
					c => c?.sentence === data.line
				)
				correction?.reasons.push(data.reason)
				if (!correction) {
					openSnackbar(`cannot find ${data.line}`, 'error')
				}
			}
			if (jsonLine.type === 'grade') {
				result.grade.score = jsonLine.data as number
			}

			if (jsonLine.type === 'grade_reason') {
				result.grade.grade_reasons.push(jsonLine.data as string)
			}
			if (jsonLine.type === 'improve_direction') {
				result.grade.improve_directions.push(jsonLine.data as string)
			}
		}

		return result
	}, [answer, openSnackbar])

	const handleIsDebugClick = useCallback(() => {
		setIsDebug(d => !d)
	}, [])
	const JSON_SPACE = 2

	return (
		<div className='min-h-screen min-w-full bg-gray-100'>
			<div>
				<div className='bg-gray-800 p-3'>
					<h1 className='text-xl font-bold text-green-200'>
						English Correctness Checker
					</h1>
				</div>
				<CssBaseline />
				<div className='bg-gray-200 p-3'>
					<Setting />
				</div>
				<div className='w-[800px] p-3'>
					<div className='flex items-center'>
						<TextareaAutosize
							value={text}
							onChange={handleTextChange}
							onFocus={handleFocus}
							onKeyDown={handleKeyDown}
							className='w-96 rounded-xl border-gray-300'
						/>
						<div className='w-2' />
						<LoadingButton
							variant='outlined'
							type='submit'
							onClick={handleSumit}
							loading={isSubmitting}
						>
							Submit
						</LoadingButton>
					</div>
					<List component='div'>
						{jsonAnswer.corrections.map(
							correction =>
								correction && (
									<Fragment key={correction.sentence}>
										<ListItemText
											primary={
												<div className='rounded bg-gray-900 p-2 text-white'>
													{correction.diff?.map(
														({ added, removed, value, key }) => (
															<span
																key={key}
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
														)
													)}
												</div>
											}
										/>
										<ListItemText
											primary={`Score: ${correction.score ?? ''}`}
										/>
										<List component='div'>
											{correction.reasons.map((reason, index) => (
												<ListItemText
													key={reason}
													primary={`${index}. ${reason}`}
												/>
											))}
										</List>
										<hr />
									</Fragment>
								)
						)}
						<List component='div'>
							<ListItemText
								primary={<h3 className='text-xl font-bold'>Overall</h3>}
							/>
							<ListItemText
								primary={`Grade: ${jsonAnswer.grade.score ?? ''}`}
							/>
							{jsonAnswer.grade.grade_reasons.map((reason, index) => (
								<ListItemText key={reason} primary={`${index}. ${reason}`} />
							))}
							<ListItemText
								primary={
									<h4 className='text-lg font-bold'>Improve Directions</h4>
								}
							/>
							{jsonAnswer.grade.improve_directions.map((reason, index) => (
								<ListItemText key={reason} primary={`${index}. ${reason}`} />
							))}
						</List>
					</List>
				</div>
			</div>
			<div>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox checked={isDebug} onChange={handleIsDebugClick} />
						}
						label='Debug'
					/>
				</FormGroup>
				{isDebug ? (
					<div className='flex'>
						<div className='w-1/2'>
							<h3 className='text-lg'>📑 JSON answer</h3>
							<TextareaAutosize
								value={JSON.stringify(jsonAnswer, undefined, JSON_SPACE)}
								cols={80}
								readOnly
							/>
						</div>
						<div className='w-1/2'>
							<h3 className='text-lg'>📑 Raw answer</h3>
							<TextareaAutosize
								value={answer.replaceAll('\n', '\n\n')}
								cols={80}
								readOnly
							/>
						</div>
					</div>
				) : undefined}
			</div>
			{snackbarComponent}
		</div>
	)
}
