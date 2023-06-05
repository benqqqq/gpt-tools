import type { ReactElement } from 'react'
import { Fragment, useCallback, useEffect, useState } from 'react'
import Setting from './Setting'
import {
	englishTeacherSystemPromptInJsonLines,
	englishTeacherUserPrompt,
	generateUserPrompt
} from './prompts'
import { useOpenAI } from '../services/OpenAiContext'
import {
	CssBaseline,
	List,
	ListItemText,
	TextareaAutosize
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from './snackbarHooks'
import DiffLine from './DiffLine'
import DebugArea from './DebugArea'
import useStreamingOutputDigest from './streamingOutputDigestHooks'

export default function EnglishCorrectnessChecker(): ReactElement {
	const [text, setText] = useState(
		`The sun go down slow in the sky, making it look all orange and pretty. The wind blow gentle and it make the tree leaves make a nice sound, like whispers. Far away, birds fly in the air so nice and free, their wings make shapes on the clouds. When night come, the smell of flowers grow and it smell so good, like something sweet. Everything feel calm and nice, like time stop and nature show its beauty for a little while.`
	)
	const [submittingText, setSubmittingText] = useState('')
	const [answer, setAnswer] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const openai = useOpenAI()
	const [answerMap, setAnswerMap] = useState({})

	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setText(event.target.value)
		},
		[]
	)
	const [openSnackbar, snackbarComponent] = useSnackbar()

	const handleSumit = useCallback(async (): Promise<void> => {
		setAnswer('')
		setIsSubmitting(true)
		setSubmittingText(text)
		await openai.chatCompletion({
			systemPrompt: englishTeacherSystemPromptInJsonLines,
			userPrompt: generateUserPrompt(englishTeacherUserPrompt, text),
			onContent: (content: string): void => {
				setAnswer(ans => ans + content)
			},
			onFinish: (): void => {
				setIsSubmitting(false)
				setAnswerMap(previousAnswerMap => ({
					...previousAnswerMap,
					[text]: undefined
				}))
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

	const [jsonAnswer, digestError] = useStreamingOutputDigest(answer)

	useEffect(() => {
		if (digestError) {
			openSnackbar(digestError.message, 'error')
		}
	}, [openSnackbar, digestError])

	useEffect(() => {
		if (submittingText in answerMap && answer !== '') {
			if (jsonAnswer.corrections.length === 0) {
				openSnackbar(`No corrections found : ${answer}`, 'error')
			} else {
				openSnackbar('Correction finished', 'success')
			}
		}
	}, [openSnackbar, answer, jsonAnswer, answerMap, submittingText])

	useEffect(() => {
		if (submittingText in answerMap) {
			setAnswerMap({
				...answerMap,
				[submittingText]: jsonAnswer
			})
		}
	}, [answerMap, jsonAnswer, submittingText])

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
													<DiffLine diffs={correction.diff} />
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
			<DebugArea answer={answer} jsonAnswer={jsonAnswer} />
			{snackbarComponent}
		</div>
	)
}
