import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import TextInputModal from '../common/TextInputModal'
import ImportIcon from '../ui/ImportIcon'
import CopyToClipboardIcon from '../ui/CopyToClipboardIcon'
import GenerateSequenceDiagramIcon from '../ui/GenerateSequenceDiagramIcon'
import { promptImportContext } from './prompts/usefulPrompts'
import type { IMessage, IPromptTemplate } from './types'
import {
	flowchartDocument,
	mindmapDocument,
	sequenceDiagramDocument
} from './prompts/mermaidDocuments'
import GenerateFlowchartIcon from '../ui/GenerateFlowchartIcon'
import MapIcon from '@mui/icons-material/Map'

interface IPromptToolsProps {
	submitPrompt: (
		userPrompt: string,
		systemPrompt: string,
		disableMarkdownUserPromptHint?: boolean
	) => Promise<void>
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
			`Please use mermaid js syntax (refer to the document below) to draw a sequence diagram that describes the concept discussed above.
			${sequenceDiagramDocument}`,
			selectedPrompt.systemPrompt,
			true
		)
	}, [selectedPrompt.systemPrompt, submitPrompt])

	const handleGenerateFlowchartClick = useCallback(() => {
		void submitPrompt(
			`Please use mermaid js syntax (refer to the document below) to draw a flowchart that describes the concept discussed above.
			${flowchartDocument}`,
			selectedPrompt.systemPrompt,
			true
		)
	}, [selectedPrompt.systemPrompt, submitPrompt])

	const handleGenerateMindmapClick = useCallback(() => {
		void submitPrompt(
			`Please use mermaid js syntax (refer to the document below) to draw a mindmap that describes the concept discussed above.
			${mindmapDocument}`,
			selectedPrompt.systemPrompt,
			true
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
			<Tooltip title='Import context' className='m-1'>
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

			<Tooltip title='Copy conversations to clipboard' className='m-1'>
				<Button variant='contained' onClick={handleCopyConversationsClick}>
					<CopyToClipboardIcon />
				</Button>
			</Tooltip>

			<Tooltip title='Generate sequence diagram' className='m-1'>
				<Button
					variant='contained'
					onClick={handleGenerateSequenceDiagramClick}
				>
					<GenerateSequenceDiagramIcon />
				</Button>
			</Tooltip>

			<Tooltip title='Generate flowchart' className='m-1'>
				<Button variant='contained' onClick={handleGenerateFlowchartClick}>
					<GenerateFlowchartIcon />
				</Button>
			</Tooltip>

			<Tooltip title='Generate mindmap' className='m-1'>
				<Button variant='contained' onClick={handleGenerateMindmapClick}>
					<MapIcon />
				</Button>
			</Tooltip>
		</>
	)
}
