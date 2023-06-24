import type { ReactElement, SyntheticEvent } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import Setting from '../common/Setting'
import type {
	IChatCompletionMessage,
	IChatCompletionOptions
} from '../../services/OpenAiContext'
import { GPT_MODELS, useOpenAI } from '../../services/OpenAiContext'
import { useSnackbar } from '../common/useSnackbar'
import type { IMessage, IPrompt } from './types'
import {
	assistantOutputHint,
	generateUserPrompt,
	prompts
} from './prompts/prompts'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Head from '../common/Head'
import Message from './Message'
import PromptChatBox from './PromptChatBox'
import PromptSearchCombobox from './PromptSearchCombobox'
import useKeyboardShortcutListener from './useKeyboardShortcutListener'
import { Autocomplete, Slider, TextField } from '@mui/material'

const GPT_TEMPERATURE = 1

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

function mapLatest<T>(items: T[], mapFunction: (item: T) => T): T[] {
	const LATEST = -1
	const latestItem = items.at(LATEST)
	return latestItem === undefined
		? items
		: [...items.slice(0, LATEST), mapFunction(latestItem)]
}

export default function GptPlayground(): ReactElement {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const openai = useOpenAI()
	const [openSnackbar, closeSnackbar, snackbarComponent] = useSnackbar()
	const { id } = useParams()
	const promptId = Number.parseInt(id ?? '0', 10) || 0
	const [selectedPrompt, setSelectedPrompt] = useState<IPrompt>(
		prompts[promptId]
	)
	const [messages, setMessages] = useState<IMessage[]>([])
	const [submittedMessages, setSubmittedMessages] = useState<
		IChatCompletionMessage[]
	>([])
	const counter = useMemo(() => generateCounter(0), [])
	const navigate = useNavigate()
	const [gptTemperature, setGptTemperature] = useState(GPT_TEMPERATURE)
	const [gptModel, setGptModel] =
		useState<IChatCompletionOptions['model']>('gpt-3.5-turbo-0613')
	const messageRef = useRef<HTMLDivElement>(null)

	const submitMessages = useCallback(
		async (chatCompletionMessages: IChatCompletionMessage[]) => {
			if (isSubmitting) {
				return
			}
			setIsSubmitting(true)
			closeSnackbar()
			setSubmittedMessages(chatCompletionMessages)

			try {
				await openai.chatCompletion({
					messages: chatCompletionMessages,
					model: gptModel,
					onContent: (content: string): void => {
						setMessages((previousMessages): IMessage[] =>
							mapLatest<IMessage>(
								previousMessages,
								(message): IMessage => ({
									id: message.id,
									role: 'assistant',
									content: message.content + content,
									timestamp: new Date()
								})
							)
						)
					},
					onFinish: (): void => {
						setIsSubmitting(false)
						openSnackbar('Finish', 'success')
					},
					temperature: gptTemperature
				})
			} catch (error) {
				const errorMessage = (error as Error).message
				openSnackbar(errorMessage, 'error')
				setIsSubmitting(false)
				setMessages((previousMessages): IMessage[] =>
					mapLatest<IMessage>(
						previousMessages,
						(message): IMessage => ({
							id: message.id,
							role: 'assistant',
							content: message.content,
							timestamp: new Date(),
							error: errorMessage
						})
					)
				)
			}
		},
		[
			closeSnackbar,
			gptModel,
			gptTemperature,
			isSubmitting,
			openSnackbar,
			openai
		]
	)

	const handleSubmitUserPrompt = useCallback(
		async (userPrompt: string, systemPrompt: string): Promise<void> => {
			const newUserPrompt = selectedPrompt.userPrompt
				? generateUserPrompt(selectedPrompt.userPrompt, userPrompt)
				: userPrompt

			// add the next conversation
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

			// add system prompt and user prompt
			await submitMessages([
				{
					role: 'system',
					content: systemPrompt
				},
				...messages.map(({ role, content }) => ({ role, content })),
				{
					role: 'user',
					content: `${newUserPrompt}\n\n${assistantOutputHint}`
				}
			])
		},
		[counter, messages, selectedPrompt.userPrompt, submitMessages]
	)

	const selectPrompt = useCallback(
		(prompt: IPrompt): void => {
			setSelectedPrompt(prompt)
			navigate(`/gpt-playground/${prompts.indexOf(prompt)}/`)
		},
		[navigate]
	)

	const handleMessageDeleteClick = useCallback((messageId: number) => {
		setMessages(previousMessage =>
			previousMessage.filter(message => message.id !== messageId)
		)
	}, [])

	const handleMessageRegenerateClick = useCallback(() => {
		void submitMessages(submittedMessages)
	}, [submitMessages, submittedMessages])

	const clearMessages = useCallback(() => {
		setMessages([])
	}, [])

	const handleClearClick = useCallback((): void => {
		clearMessages()
	}, [clearMessages])

	const userPromptRef = useRef<HTMLTextAreaElement>(null)

	const handlePromptSearchSelect = useCallback(
		(promptKey: string) => {
			const prompt = prompts.find(p => p.key === promptKey)
			if (prompt) {
				selectPrompt(prompt)
				userPromptRef.current?.focus()
			} else {
				openSnackbar(`Prompt ${promptKey} not found`, 'error')
			}
		},
		[openSnackbar, selectPrompt]
	)

	const promptSearchRef = useRef<HTMLInputElement>(null)

	const SCROLL_STEP = 100
	useKeyboardShortcutListener(
		useMemo(
			() => ({
				onCmdK: (): void => {
					promptSearchRef.current?.focus()
				},
				onCmdJ: (): void => {
					clearMessages()
				},
				onCmdU: (): void => {
					userPromptRef.current?.focus()
				},
				onCmdArrowUp: (): void => {
					messageRef.current?.scrollBy({
						top: -SCROLL_STEP,
						behavior: 'smooth'
					})
				},
				onCmdArrowDown: (): void => {
					messageRef.current?.scrollBy({ top: SCROLL_STEP, behavior: 'smooth' })
				},
				onEsc: (): void => {
					messageRef.current?.focus()
				}
			}),
			[clearMessages]
		)
	)

	const handleGptTemperatureSlideChange = useCallback(
		(event: Event, newValue: number[] | number) => {
			if (typeof newValue === 'number') {
				setGptTemperature(newValue)
			}
		},
		[]
	)

	const handleGptModelChange = useCallback(
		(event: SyntheticEvent, value: string | null) => {
			setGptModel(value as IChatCompletionOptions['model'])
		},
		[]
	)

	return (
		<div className='flex w-full'>
			<Head title={`${selectedPrompt.key} | Fixed System Prompt Chat`} />

			{/* Sidebar on Left */}
			<div className='flex h-screen w-[250px] flex-col items-start bg-gray-800 p-3'>
				<div className='my-5'>
					<h1 className='m-0 text-xl font-bold text-green-200'>
						GPT Playground
					</h1>
					<strong className='text-amber-100 '>- {selectedPrompt.key}</strong>
				</div>
				<div className='my-5 rounded-lg bg-white p-1'>
					<Setting />
				</div>
				<div className='my-5 w-full rounded-lg bg-white'>
					<PromptSearchCombobox
						onSelect={handlePromptSearchSelect}
						ref={promptSearchRef}
					/>
				</div>
				<div className='w-full px-1 text-white'>
					Temperature
					<Slider
						value={gptTemperature}
						onChange={handleGptTemperatureSlideChange}
						min={0}
						max={2}
						step={0.1}
						marks
						valueLabelDisplay='auto'
					/>
				</div>
				<div className='my-5 w-full rounded-lg bg-white'>
					<Autocomplete
						options={GPT_MODELS}
						autoHighlight
						openOnFocus
						selectOnFocus
						disableClearable
						value={gptModel}
						onChange={handleGptModelChange}
						renderInput={(params): ReactElement => (
							<TextField {...params} label='Model' type='text' />
						)}
					/>
				</div>
				<div className='my-5'>
					<Link to='/prompt-list' className='italic text-white no-underline'>
						📍Prompt list
					</Link>
				</div>
			</div>

			{/* Content on Right */}
			<div className='flex h-screen flex-grow flex-col-reverse'>
				{/* Prompt at Bottom */}
				<div className=' bg-white p-3'>
					<PromptChatBox
						selectedPrompt={selectedPrompt}
						isSubmitting={isSubmitting}
						onClear={handleClearClick}
						onSubmit={handleSubmitUserPrompt}
						userPromptInputRef={userPromptRef}
					/>
				</div>

				{/* Messages grows from bottom to top */}
				<div
					className='flex max-w-[calc(100vw-250px)] flex-col-reverse overflow-y-auto bg-gray-100'
					tabIndex={-1} // to make it focusable
					ref={messageRef}
				>
					{[...messages].reverse().map(message => (
						<Message
							key={message.id}
							message={message}
							onDeleteMessage={handleMessageDeleteClick}
							onRegenerateMessage={handleMessageRegenerateClick}
							isSubmitting={isSubmitting}
						/>
					))}
				</div>
			</div>
			{snackbarComponent}
		</div>
	)
}
