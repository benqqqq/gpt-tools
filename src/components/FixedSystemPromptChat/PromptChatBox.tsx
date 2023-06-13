import type { ReactElement, Ref } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TextareaAutosize from '../common/TextareaAutosize'
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'
import { generateUserPrompt, USER_PROMPT_SLOT } from './prompts'
import type { IPrompt } from './types'
import getLocalStorage from '../../storage/localStorage'

interface IPromptChatBoxProperties {
	onSubmit: (userPrompt: string, systemPrompt: string) => void
	onClear: () => void
	isSubmitting: boolean
	selectedPrompt: IPrompt
	userPromptInputRef?: Ref<HTMLTextAreaElement>
}

const MAX_ROWS_WHEN_NOT_ACTIVE = 2

export default function PromptChatBox({
	onSubmit,
	onClear,
	isSubmitting,
	selectedPrompt,
	userPromptInputRef
}: IPromptChatBoxProperties): ReactElement {
	const [userPrompt, setUserPrompt] = useState('')
	const [systemPrompt, setSystemPrompt] = useState('')

	const userPromptLocalStorage = useMemo(
		() => getLocalStorage(`PromptChatBox-${selectedPrompt.key}-UserPrompt`),
		[selectedPrompt.key]
	)

	useEffect(() => {
		setSystemPrompt(selectedPrompt.systemPrompt)
	}, [selectedPrompt])

	useEffect(() => {
		const cacheUserPrompt = userPromptLocalStorage.get()
		if (cacheUserPrompt) {
			setUserPrompt(cacheUserPrompt)
		}
	}, [userPromptLocalStorage])

	const submit = useCallback(() => {
		setUserPrompt('')
		userPromptLocalStorage.set('')
		onSubmit(userPrompt, systemPrompt)
	}, [onSubmit, systemPrompt, userPrompt, userPromptLocalStorage])

	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setUserPrompt(event.target.value)
			userPromptLocalStorage.set(event.target.value)
		},
		[userPromptLocalStorage]
	)
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.metaKey && event.key === 'Enter') {
				submit()
			}
		},
		[submit]
	)

	const handleSystemPromptChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setSystemPrompt(event.target.value)
		},
		[]
	)

	const handleSubmitClick = useCallback((): void => {
		submit()
	}, [submit])

	const handleClearClick = useCallback((): void => {
		onClear()
	}, [onClear])

	return (
		<div className='flex'>
			<div className='flex flex-grow items-center'>
				<TextareaAutosize
					placeholder='user prompt'
					value={userPrompt}
					onChange={handleTextChange}
					onKeyDown={handleKeyDown}
					className='flex-grow rounded-xl border-gray-300'
					autoFocus
					maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
					ref={userPromptInputRef}
				/>
				<div className='m-2 flex space-x-1'>
					<LoadingButton
						variant='contained'
						type='submit'
						onClick={handleSubmitClick}
						loading={isSubmitting}
					>
						Submit
					</LoadingButton>
					<Button variant='outlined' onClick={handleClearClick}>
						Clear
					</Button>
				</div>
			</div>
			<div className='flex flex-grow flex-col space-y-1 p-3'>
				<TextareaAutosize
					placeholder='system prompt'
					value={systemPrompt}
					onChange={handleSystemPromptChange}
					className='flex-grow rounded-xl border-gray-300'
					maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
				/>
				{selectedPrompt.userPrompt ? (
					<TextareaAutosize
						placeholder='user prompt'
						value={generateUserPrompt(
							selectedPrompt.userPrompt,
							userPrompt || USER_PROMPT_SLOT
						)}
						readOnly
						className='flex-grow rounded-xl border-gray-300'
						maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
					/>
				) : undefined}
			</div>
		</div>
	)
}

PromptChatBox.defaultProps = {
	userPromptInputRef: undefined
}
