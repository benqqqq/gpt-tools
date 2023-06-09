import type { ReactElement } from 'react'
import { useCallback, useMemo, useState } from 'react'
import Setting from '../common/Setting'
import { Button, ButtonGroup } from '@mui/material'
import { useOpenAI } from '../../services/OpenAiContext'
import { useSnackbar } from '../common/useSnackbar'
import type { IMessage, IPrompt } from './types'
import { assistantOutputHint, generateUserPrompt, prompts } from './prompts'
import { useNavigate, useParams } from 'react-router-dom'
import Head from '../common/Head'
import Message from './Message'
import PromptChatBox from './PromptChatBox'

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

	const handlePromptSelected = useCallback(
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
					<PromptChatBox
						selectedPrompt={selectedPrompt}
						isSubmitting={isSubmitting}
						onClear={handleClearClick}
						onSubmit={handleSubmit}
					/>
				</div>
				{[...messages].reverse().map(message => (
					<Message
						key={message.id}
						message={message}
						onDeleteMessage={handleMessageDeleteClick}
					/>
				))}
				<div className='h-[300px] w-full' />
				{snackbarComponent}
			</div>
		</>
	)
}
