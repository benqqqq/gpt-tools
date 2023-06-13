import type { ReactElement } from 'react'
import { memo, useCallback } from 'react'
import Markdown from './Markdown'
import { Button } from '@mui/material'
import type { IMessage } from './types'

function Message({
	message,
	onDeleteMessage,
	onRegenerateMessage,
	isSubmitting
}: {
	message: IMessage
	onDeleteMessage: (id: number) => void
	onRegenerateMessage: () => void
	isSubmitting: boolean
}): ReactElement {
	const handleMessageDeleteClick = useCallback(
		(id: number): void => {
			onDeleteMessage(id)
		},
		[onDeleteMessage]
	)
	const handleMessageRegenerateClick = useCallback((): void => {
		onRegenerateMessage()
	}, [onRegenerateMessage])
	return (
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
			<div className='flex items-center justify-end'>
				<small className='text-gray-500'>{`${message.timestamp.toLocaleDateString()} ${message.timestamp.toLocaleTimeString()}`}</small>

				<Button
					variant='outlined'
					className='m-3'
					onClick={(): void => handleMessageDeleteClick(message.id)}
					disabled={isSubmitting}
				>
					Delete
				</Button>
				{message.error ? (
					<Button
						variant='outlined'
						color='warning'
						onClick={(): void => handleMessageRegenerateClick()}
						disabled={isSubmitting}
					>
						Regenerate
					</Button>
				) : undefined}
			</div>
		</div>
	)
}
export default memo(Message)
