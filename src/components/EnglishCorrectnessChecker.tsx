import type { ReactElement } from 'react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
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
	ListItemButton,
	ListItemText,
	TextareaAutosize
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from './snackbarHooks'
import DiffLine from './DiffLine'
import DebugArea from './DebugArea'
import useStreamingOutputDigest from './streamingOutputDigestHooks'
import { database } from '../storage/database'
import type { IAnswerMapValue } from './types'
import CopyToClipboard from './CopyToClipboard'

const MAX_LENGTH_OF_HISTORY_NAME = 50
const MAX_LENGTH_OF_HISTORY_ITEM = 50

export default function EnglishCorrectnessChecker(): ReactElement {
	const [text, setText] = useState('')
	const [submittingText, setSubmittingText] = useState('')
	const [answer, setAnswer] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const openai = useOpenAI()
	const [answerMap, setAnswerMap] = useState<
		Record<string, IAnswerMapValue | undefined>
	>({})

	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setText(event.target.value)
		},
		[]
	)
	const [openSnackbar, closeSnackbar, snackbarComponent] = useSnackbar()

	const handleSumit = useCallback(async (): Promise<void> => {
		setAnswer('')
		setIsSubmitting(true)
		setSubmittingText(text)
		closeSnackbar()
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
	}, [closeSnackbar, openai, text])

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

	const handleHistoryItemClick = useCallback(
		(historyKey: string) => {
			setText(historyKey)
			setAnswer(answerMap[historyKey]?.answer ?? '')
		},
		[answerMap]
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
		if (
			submittingText in answerMap &&
			answerMap[submittingText] === undefined
		) {
			setAnswerMap({
				...answerMap,
				[submittingText]: {
					answer,
					createdAt: new Date()
				}
			})
		}
	}, [answerMap, answer, submittingText])

	const CONVERSATION_SCOPE = 'english'

	useEffect(() => {
		const getConversation = async (): Promise<void> => {
			const conversations = await database.conversations
				.where('scope')
				.equals(CONVERSATION_SCOPE)
				.toArray()
			const databaseAnswerMap: Record<string, IAnswerMapValue> = {}
			for (const conversation of conversations) {
				databaseAnswerMap[conversation.key] = {
					answer: conversation.value,
					createdAt: conversation.createdAt
				}
			}
			setAnswerMap(databaseAnswerMap)
		}

		void getConversation()
	}, [])

	const storeAnswers = useCallback(() => {
		const storeAnswerAsync = async (): Promise<void> => {
			const entries = Object.entries(answerMap).filter(
				([, value]) => value !== undefined
			)

			const conversations = await database.conversations
				.where('scope')
				.equals(CONVERSATION_SCOPE)
				.toArray()

			const conversationsKeys = new Set(conversations.map(c => c.key))

			const toAddConversations = entries.filter(
				([key]) => !conversationsKeys.has(key)
			)

			void database.conversations.bulkAdd(
				toAddConversations.map(([key, value]) => ({
					scope: CONVERSATION_SCOPE,
					key,
					value: value?.answer ?? '',
					createdAt: value?.createdAt ?? new Date()
				}))
			)
			const entriesKeys = new Set(entries.map(([key]) => key))
			const toUpdateConversations = conversations.filter(
				c => entriesKeys.has(c.key) && answerMap[c.key]?.answer !== c.value
			)

			for (const conversation of toUpdateConversations) {
				void database.conversations.update(conversation.id as number, {
					value: answerMap[conversation.key]
				})
			}
		}
		void storeAnswerAsync()
	}, [answerMap])

	useEffect(() => {
		const autoStoreIntervalInMs = 2000
		const interval = setInterval(() => {
			storeAnswers()
			console.log('store answer ...')
		}, autoStoreIntervalInMs)

		return () => {
			clearInterval(interval)
		}
	}, [storeAnswers])

	const historyKeys = useMemo(
		() =>
			Object.entries(answerMap)
				.filter(([, value]) => value !== undefined)
				.sort(
					([, valueA], [, valueB]) =>
						(valueB?.createdAt.getTime() ?? 0) -
						(valueA?.createdAt.getTime() ?? 0)
				)
				.map(([key]) => key)
				.slice(0, MAX_LENGTH_OF_HISTORY_ITEM),
		[answerMap]
	)

	const handleOnCopied = useCallback(() => {
		openSnackbar('Text copied', 'success')
	}, [openSnackbar])

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
				<div className='flex'>
					<div className='w-[800px] p-3'>
						<div className='flex items-center'>
							<TextareaAutosize
								value={text}
								onChange={handleTextChange}
								onFocus={handleFocus}
								onKeyDown={handleKeyDown}
								className='w-96 rounded-xl border-gray-300'
								autoFocus
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
														<CopyToClipboard
															text={correction.refined ?? ''}
															onCopied={handleOnCopied}
														/>
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
					<div className='w-[400px] p-3'>
						<h3 className='text-xl font-bold'>History</h3>
						<List component='div' className='max-h-[550px] overflow-y-auto'>
							{historyKeys.map(t => (
								<ListItemButton
									key={t}
									onClick={(): void => handleHistoryItemClick(t)}
									sx={{ bgcolor: 'background.paper', margin: '0.5rem' }}
								>
									<ListItemText
										primary={t.slice(0, MAX_LENGTH_OF_HISTORY_NAME)}
										secondary={`${
											answerMap[t]?.createdAt.toLocaleDateString() ?? ''
										} ${answerMap[t]?.createdAt.toLocaleTimeString() ?? ''}`}
									/>
								</ListItemButton>
							))}
						</List>
					</div>
				</div>
			</div>
			<DebugArea answer={answer} jsonAnswer={jsonAnswer} />
			{snackbarComponent}
		</div>
	)
}
