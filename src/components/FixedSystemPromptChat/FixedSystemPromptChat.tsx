import type { ReactElement } from 'react'
import { useCallback, useMemo, useState } from 'react'
import Setting from '../common/Setting'
import { Button, ButtonGroup } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import type { IChatCompletionMessage } from '../../services/OpenAiContext'
import { useOpenAI } from '../../services/OpenAiContext'
import { useSnackbar } from '../common/useSnackbar'
import type { IPrompt } from './types'
import {
	assistantOutputHint,
	generateUserPrompt,
	prompts,
	USER_PROMPT_SLOT
} from './prompts'
import Markdown from './Markdown'
import TextareaAutosize from '../common/TextareaAutosize'
import { useNavigate, useParams } from 'react-router-dom'
import Head from '../common/Head'

const GPT_TEMPERATURE = 0.8
const MAX_ROWS_WHEN_NOT_ACTIVE = 2

interface IMessage extends IChatCompletionMessage {
	timestamp: Date
	id: number
}

const DEFAULT_COUNTER_STEP = 1
const generateCounter = (
	start = 0,
	step = DEFAULT_COUNTER_STEP
): { assign: () => number } => {
	let current = start
	return {
		assign: (): number => {
			const value = current
			current += step
			return value
		}
	}
}

export default function FixedSystemPromptChat(): ReactElement {
	const [text, setText] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const openai = useOpenAI()
	const [openSnackbar, closeSnackbar, snackbarComponent] = useSnackbar()
	const { id } = useParams()
	const promptId = Number.parseInt(id ?? '0', 10) || 0
	const [selectedPrompt, setSelectedPrompt] = useState<IPrompt>(
		prompts[promptId]
	)
	const [messages, setMessages] = useState<IMessage[]>([])
	const counter = useMemo(() => generateCounter(0), [])
	const navigate = useNavigate()

	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setText(event.target.value)
		},
		[]
	)

	const handleSubmit = useCallback(async (): Promise<void> => {
		if (isSubmitting) {
			return
		}
		setIsSubmitting(true)
		closeSnackbar()
		setText('')

		const newUserPrompt = selectedPrompt.userPrompt
			? generateUserPrompt(selectedPrompt.userPrompt, text)
			: text

		setMessages([
			...messages,
			{
				id: counter.assign(),
				role: 'user',
				content: newUserPrompt,
				timestamp: new Date()
			},
			{
				id: counter.assign(),
				role: 'assistant',
				content: '',
				timestamp: new Date()
			}
		])

		try {
			await openai.chatCompletion({
				messages: [
					{
						role: 'system',
						content: selectedPrompt.systemPrompt
					},
					...messages.map(({ role, content }) => ({ role, content })),
					{
						role: 'user',
						content: `${newUserPrompt}\n\n${assistantOutputHint}`
					}
				],
				onContent: (content: string): void => {
					const LATEST = -1
					setMessages((previousMessages): IMessage[] => {
						const latestMessage = previousMessages.at(LATEST) as IMessage
						return [
							...previousMessages.slice(0, LATEST),
							{
								id: latestMessage.id,
								role: 'assistant',
								content: latestMessage.content + content,
								timestamp: new Date()
							}
						]
					})
				},
				onFinish: (): void => {
					setIsSubmitting(false)
					openSnackbar('Finish', 'success')
				},
				temperature: GPT_TEMPERATURE
			})
		} catch (error) {
			openSnackbar((error as Error).message, 'error')
			setIsSubmitting(false)
		}
	}, [
		closeSnackbar,
		counter,
		isSubmitting,
		messages,
		openSnackbar,
		openai,
		selectedPrompt.systemPrompt,
		selectedPrompt.userPrompt,
		text
	])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.metaKey && event.key === 'Enter') {
				void handleSubmit()
			}
		},
		[handleSubmit]
	)

	const handlePromptSelected = useCallback(
		(prompt: IPrompt): void => {
			setSelectedPrompt(prompt)
			navigate(`/fixed-system-prompt-chat/${prompts.indexOf(prompt)}/`)
		},
		[navigate]
	)

	const handleSystemPromptChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setSelectedPrompt(previousPrompt => ({
				...previousPrompt,
				systemPrompt: event.target.value
			}))
		},
		[]
	)

	const handleMessageDeleteClick = useCallback((messageId: number) => {
		setMessages(previousMessage =>
			previousMessage.filter(message => message.id !== messageId)
		)
	}, [])

	const handleClearClick = useCallback((): void => {
		setMessages([])
	}, [])

	return (
		<>
			<Head title={`${selectedPrompt.key} | Fixed System Prompt Chat`} />

			<div className='min-h-screen min-w-full bg-gray-100'>
				<div className='bg-gray-800 p-3'>
					<h1 className='text-xl font-bold text-green-200'>
						Fixed System Prompt Chat
					</h1>
				</div>
				<div className='bg-gray-200 p-3'>
					<Setting />
				</div>
				<div className='bg-gray-100 p-3'>
					<ButtonGroup color='secondary'>
						{prompts.map(prompt => (
							<Button
								key={prompt.key}
								onClick={(): void => handlePromptSelected(prompt)}
								variant={
									selectedPrompt.key === prompt.key ? 'contained' : 'outlined'
								}
							>
								{prompt.key}
							</Button>
						))}
					</ButtonGroup>
				</div>
				<div className='w-[800px] p-3'>
					<div className='flex'>
						<div className='flex items-center'>
							<TextareaAutosize
								value={text}
								onChange={handleTextChange}
								onKeyDown={handleKeyDown}
								className='w-[500px] rounded-xl border-gray-300'
								autoFocus
								maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
							/>
							<div className='m-2 flex h-[100px] w-[100px] flex-col justify-around'>
								<LoadingButton
									variant='contained'
									type='submit'
									onClick={handleSubmit}
									loading={isSubmitting}
								>
									Submit
								</LoadingButton>
								<Button variant='outlined' onClick={handleClearClick}>
									Clear
								</Button>
							</div>
						</div>
						<div className='p-3'>
							<small>System Prompt</small>
							<TextareaAutosize
								value={selectedPrompt.systemPrompt}
								onChange={handleSystemPromptChange}
								className='w-[500px] rounded-xl border-gray-300'
								maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
							/>
							{selectedPrompt.userPrompt ? (
								<>
									<small>User Prompt</small>
									<TextareaAutosize
										value={generateUserPrompt(
											selectedPrompt.userPrompt,
											text || USER_PROMPT_SLOT
										)}
										readOnly
										className='w-[500px] rounded-xl border-gray-300'
										maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
									/>
								</>
							) : undefined}
						</div>
					</div>
				</div>
				{[...messages].reverse().map(message => (
					<div
						key={message.id}
						className={`px-14 py-3 ${
							message.role === 'user' ? 'bg-amber-50' : 'bg-green-50'
						}`}
					>
						<Markdown
							content={
								message.role === 'assistant' && message.content === ''
									? 'Thinking ...'
									: message.content
							}
						/>
						<Button
							variant='outlined'
							className='m-3'
							onClick={(): void => handleMessageDeleteClick(message.id)}
						>
							Delete
						</Button>
					</div>
				))}
				<div className='h-[300px] w-full' />
				{snackbarComponent}
			</div>
		</>
	)
}
