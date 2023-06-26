import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import TextInputModal from '../common/TextInputModal'
import ImportIcon from '../ui/ImportIcon'
import CopyToClipboardIcon from '../ui/CopyToClipboardIcon'
import GenerateSequenceDiagramIcon from '../ui/GenerateSequenceDiagramIcon'
import {
	promptGenerateMermaidSequenceDiagram,
	promptImportContext
} from './prompts/usefulPrompts'
import type { IMessage, IPromptTemplate } from './types'

interface IPromptToolsProps {
	submitPrompt: (userPrompt: string, systemPrompt: string) => Promise<void>
	selectedPrompt: IPromptTemplate
	messages: IMessage[]
}
export default function PromptTools({
	submitPrompt,
	selectedPrompt,
	messages
}: IPromptToolsProps): ReactElement {
	const handleCopyConversationsClick = useCallback(() => {
		const text = messages
			.map(({ role, content }) => `${role}: ${content}`)
			.join('\n')
		void navigator.clipboard.writeText(text)
	}, [messages])

	const handleGenerateSequenceDiagramClick = useCallback(() => {
		void submitPrompt(
			promptGenerateMermaidSequenceDiagram,
			selectedPrompt.systemPrompt
		)
	}, [selectedPrompt.systemPrompt, submitPrompt])

	const handleImportContextClick = useCallback(
		(openModal: () => void) => () => openModal(),
		[]
	)

	const handleImportTextModalClose = useCallback(
		(text: string) => {
			void submitPrompt(
				`${text}\n\n${promptImportContext}`,
				selectedPrompt.systemPrompt
			)
		},
		[selectedPrompt.systemPrompt, submitPrompt]
	)

	return (
		<>
			<Tooltip title='Import context'>
				<Box className='inline-block'>
					<TextInputModal onOk={handleImportTextModalClose}>
						{({ openModal }): ReactElement => (
							<Button
								variant='contained'
								onClick={handleImportContextClick(openModal)}
							>
								<ImportIcon />
							</Button>
						)}
					</TextInputModal>
				</Box>
			</Tooltip>

			<Tooltip title='Copy conversations to clipboard'>
				<Button variant='contained' onClick={handleCopyConversationsClick}>
					<CopyToClipboardIcon />
				</Button>
			</Tooltip>

			<Tooltip title='Generate sequence diagram'>
				<Button
					variant='contained'
					onClick={handleGenerateSequenceDiagramClick}
				>
					<GenerateSequenceDiagramIcon />
				</Button>
			</Tooltip>
		</>
	)
}
