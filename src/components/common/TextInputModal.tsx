import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import { Box, Button, Modal, TextareaAutosize } from '@mui/material'

interface ITextInputModal {
	children: ({ openModal }: { openModal: () => void }) => ReactElement
	onCloseModal: (text: string) => void
}
export default function TextInputModal({
	children,
	onCloseModal
}: ITextInputModal): ReactElement {
	const [isOpen, setIsOpen] = useState(false)
	const [text, setText] = useState('')
	const handleClose = useCallback(() => {
		setIsOpen(false)
		onCloseModal(text)
	}, [onCloseModal, text])

	const openModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			setText(event.target.value)
		},
		[]
	)

	const handleOkClick = useCallback(() => {
		setIsOpen(false)
		onCloseModal(text)
	}, [onCloseModal, text])

	return (
		<>
			{children({ openModal })}
			<Modal open={isOpen} onClose={handleClose}>
				<Box
					sx={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<TextareaAutosize
						style={{ width: '50%' }}
						placeholder='Enter text here'
						value={text}
						onChange={handleTextChange}
					/>
					<Button variant='contained' onClick={handleOkClick}>
						OK
					</Button>
				</Box>
			</Modal>
		</>
	)
}
