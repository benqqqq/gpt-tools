import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import Setting from '../common/Setting'
import { Button, ButtonGroup, TextareaAutosize } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useOpenAI } from '../../services/OpenAiContext'
import { useSnackbar } from '../common/useSnackbar'
import type { IPrompt } from './types'
import {
	defaultSystemPrompt,
	generateUserPrompt,
	prompts,
	USER_PROMPT_SLOT
} from './prompts'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import remarkGfm from 'remark-gfm'

const GPT_TEMPERATURE = 0.8
export default function FixedSystemPromptChat(): ReactElement {
	const [text, setText] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [answer, setAnswer] = useState('')
	const openai = useOpenAI()
	const [openSnackbar, closeSnackbar, snackbarComponent] = useSnackbar()
	const [selectedPrompt, setSelectedPrompt] = useState<IPrompt>(prompts[0])

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
		setAnswer('')
		setIsSubmitting(true)
		closeSnackbar()
		try {
			await openai.chatCompletion({
				systemPrompts: [defaultSystemPrompt, selectedPrompt.systemPrompt],
				userPrompt: selectedPrompt.userPrompt
					? generateUserPrompt(selectedPrompt.userPrompt, text)
					: text,
				onContent: (content: string): void => {
					setAnswer(ans => ans + content)
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
		isSubmitting,
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

	const handlePromptSelected = useCallback((prompt: IPrompt): void => {
		setSelectedPrompt(prompt)
	}, [])

	const handleSystemPromptChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setSelectedPrompt(previousPrompt => ({
				...previousPrompt,
				systemPrompt: event.target.value
			}))
		},
		[]
	)

	return (
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
							className='w-[600px] rounded-xl border-gray-300'
							autoFocus
							maxRows={20}
						/>
						<div className='w-2' />
						<LoadingButton
							variant='outlined'
							type='submit'
							onClick={handleSubmit}
							loading={isSubmitting}
						>
							Submit
						</LoadingButton>
					</div>
					<div className='p-3'>
						<small>System Prompt</small>
						<TextareaAutosize
							value={selectedPrompt.systemPrompt}
							onChange={handleSystemPromptChange}
							className='w-[600px] rounded-xl border-gray-300'
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
									className='w-[600px] rounded-xl border-gray-300'
								/>
							</>
						) : undefined}
					</div>
				</div>
			</div>
			<div className='bg-white px-14 py-3'>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={{
						// eslint-disable-next-line react/no-unstable-nested-components
						code({
							node,
							inline,
							// eslint-disable-next-line unicorn/no-keyword-prefix
							className,
							children,
							...properties
						}): ReactElement {
							// eslint-disable-next-line unicorn/no-keyword-prefix
							const match = /language-(\w+)/.exec(className ?? '')
							const matchIndex = 1
							return !inline && match ? (
								<SyntaxHighlighter
									/* eslint-disable-next-line react/jsx-props-no-spreading */
									{...properties}
									/* eslint-disable-next-line react/no-children-prop */
									children={String(children).replace(/\n$/, '')}
									style={docco}
									language={match[matchIndex]}
									PreTag='div'
									className='m-4 rounded-xl border-gray-300'
								/>
							) : (
								// eslint-disable-next-line react/jsx-props-no-spreading,unicorn/no-keyword-prefix
								<code {...properties} className={className}>
									{children}
								</code>
							)
						},
						// eslint-disable-next-line react/no-unstable-nested-components,unicorn/no-keyword-prefix
						li({ children, ordered, className, ...properties }): ReactElement {
							return (
								<li
									/* eslint-disable-next-line unicorn/no-keyword-prefix */
									className={`${className ?? ''} ${
										ordered ? ' list-decimal' : 'list-disc'
									}`}
									/* eslint-disable-next-line react/jsx-props-no-spreading */
									{...properties}
								>
									{children}
								</li>
							)
						}
					}}
				>
					{answer}
				</ReactMarkdown>
			</div>
			{snackbarComponent}
		</div>
	)
}
