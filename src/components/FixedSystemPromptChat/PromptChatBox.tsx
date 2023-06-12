import type { ReactElement, Ref } from 'react'
import { useCallback, useEffect, useState } from 'react'
import TextareaAutosize from '../common/TextareaAutosize'
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'
import { generateUserPrompt, USER_PROMPT_SLOT } from './prompts'
import type { IPrompt } from './types'

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

	useEffect(() => {
		setSystemPrompt(selectedPrompt.systemPrompt)
	}, [selectedPrompt])

	const submit = useCallback(() => {
		setUserPrompt('')
		onSubmit(userPrompt, systemPrompt)
	}, [onSubmit, systemPrompt, userPrompt])

	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
			setUserPrompt(event.target.value)
		},
		[]
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
			<div className='flex items-center'>
				<TextareaAutosize
					value={userPrompt}
					onChange={handleTextChange}
					onKeyDown={handleKeyDown}
					className='w-[500px] rounded-xl border-gray-300'
					autoFocus
					maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
					ref={userPromptInputRef}
				/>
				<div className='m-2 flex h-[100px] w-[100px] flex-col justify-around'>
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
			<div className='p-3'>
				<small>System Prompt</small>
				<TextareaAutosize
					value={systemPrompt}
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
								userPrompt || USER_PROMPT_SLOT
							)}
							readOnly
							className='w-[500px] rounded-xl border-gray-300'
							maxRowsWhenNotActive={MAX_ROWS_WHEN_NOT_ACTIVE}
						/>
					</>
				) : undefined}
			</div>
		</div>
	)
}

PromptChatBox.defaultProps = {
	userPromptInputRef: undefined
}
