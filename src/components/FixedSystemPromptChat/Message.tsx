import type { ReactElement } from 'react'
import { memo, useCallback } from 'react'
import Markdown from './Markdown'
import { Button } from '@mui/material'
import type { IMessage } from './types'

function Message({
	message,
	onDeleteMessage
}: {
	message: IMessage
	onDeleteMessage: (id: number) => void
}): ReactElement {
	const handleMessageDeleteClick = useCallback(
		(id: number): void => {
			onDeleteMessage(id)
		},
		[onDeleteMessage]
	)
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
			<Button
				variant='outlined'
				className='m-3'
				onClick={(): void => handleMessageDeleteClick(message.id)}
			>
				Delete
			</Button>
		</div>
	)
}
export default memo(Message)
