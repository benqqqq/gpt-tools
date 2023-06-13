import type { ReactElement } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import Setting from '../common/Setting'
import type { IChatCompletionMessage } from '../../services/OpenAiContext'
import { useOpenAI } from '../../services/OpenAiContext'
import { useSnackbar } from '../common/useSnackbar'
import type { IMessage, IPrompt } from './types'
import { assistantOutputHint, generateUserPrompt, prompts } from './prompts'
import { useNavigate, useParams } from 'react-router-dom'
import Head from '../common/Head'
import Message from './Message'
import PromptChatBox from './PromptChatBox'
import PromptSearchCombobox from './PromptSearchCombobox'
import useKeyboardShortcutListener from './useKeyboardShortcutListener'

const GPT_TEMPERATURE = 0.8

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

export default function FixedSystemPromptChat(): ReactElement {
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
					temperature: GPT_TEMPERATURE
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
		[closeSnackbar, isSubmitting, openSnackbar, openai]
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
			navigate(`/fixed-system-prompt-chat/${prompts.indexOf(prompt)}/`)
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

	useKeyboardShortcutListener(
		useMemo(
			() => ({
				onCmdK: (): void => {
					promptSearchRef.current?.focus()
				},
				onCmdJ: (): void => {
					clearMessages()
				}
			}),
			[clearMessages]
		)
	)

	return (
		<div className='flex w-full'>
			<Head title={`${selectedPrompt.key} | Fixed System Prompt Chat`} />

			{/* Sidebar on Left */}
			<div className='flex h-screen w-[250px] flex-col items-start bg-gray-800 p-3'>
				<div className='my-5'>
					<h1 className='m-0 text-xl font-bold text-green-200'>
						Role based Chat
					</h1>
				</div>
				<div className='my-5 rounded-lg bg-white p-1'>
					<Setting />
				</div>
				<div className='my-5 rounded-lg bg-white'>
					<PromptSearchCombobox
						onSelect={handlePromptSearchSelect}
						ref={promptSearchRef}
					/>
				</div>
				<strong className='text-amber-100 '>- {selectedPrompt.key}</strong>
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
				<div className='flex  flex-col-reverse overflow-y-auto bg-gray-100'>
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
