import type { ReactElement } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import Setting from '../common/Setting'
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
	const counter = useMemo(() => generateCounter(0), [])
	const navigate = useNavigate()

	const handleSubmit = useCallback(
		async (userPrompt: string, systemPrompt: string): Promise<void> => {
			if (isSubmitting) {
				return
			}
			setIsSubmitting(true)
			closeSnackbar()

			const newUserPrompt = selectedPrompt.userPrompt
				? generateUserPrompt(selectedPrompt.userPrompt, userPrompt)
				: userPrompt

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
							content: systemPrompt
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
		},
		[
			closeSnackbar,
			counter,
			isSubmitting,
			messages,
			openSnackbar,
			openai,
			selectedPrompt.userPrompt
		]
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

			{/* Header */}
			<div className='flex h-screen w-[250px] flex-col items-start bg-gray-800 p-3'>
				<div className='my-5'>
					<h1 className='m-0 text-xl font-bold text-green-200'>
						Role based Chat
					</h1>
					<strong className='text-amber-100'>- {selectedPrompt.key}</strong>
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
			</div>

			{/* Messages */}
			<div className='flex h-screen flex-grow flex-col-reverse overflow-y-auto bg-gray-100 pb-[125px]'>
				<div>
					{messages.map(message => (
						<Message
							key={message.id}
							message={message}
							onDeleteMessage={handleMessageDeleteClick}
						/>
					))}
				</div>
			</div>

			{/* Prompt */}
			<div className='fixed bottom-0 w-full bg-white p-3'>
				<PromptChatBox
					selectedPrompt={selectedPrompt}
					isSubmitting={isSubmitting}
					onClear={handleClearClick}
					onSubmit={handleSubmit}
					userPromptInputRef={userPromptRef}
				/>
			</div>
			{snackbarComponent}
		</div>
	)
}
