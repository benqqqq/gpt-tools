import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import { Button, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const noopFunction = (): void => {}

interface CopyToClipboardProperties {
	text: string
	onCopied?: () => void
}
function CopyToClipboard({
	text,
	onCopied = noopFunction
}: CopyToClipboardProperties): ReactElement {
	const [isCopied, setIsCopied] = useState(false)
	const COPIED_TIMEOUT_MS = 1000
	const handleCopy = useCallback(() => {
		const handleCopyFunction = async (): Promise<void> => {
			setIsCopied(true)
			try {
				await navigator.clipboard.writeText(text)
				onCopied()
				setTimeout(() => {
					setIsCopied(false)
				}, COPIED_TIMEOUT_MS)
			} catch (error) {
				console.error('Failed to copy text:', error)
			}
		}

		void handleCopyFunction()
	}, [text, onCopied])
	return (
		<Tooltip title='Copy to Clipboard'>
			{isCopied ? (
				<span>Copied !</span>
			) : (
				<Button variant='text' type='button' onClick={handleCopy}>
					<ContentCopyIcon />
				</Button>
			)}
		</Tooltip>
	)
}

CopyToClipboard.defaultProps = {
	onCopied: noopFunction
}

export default CopyToClipboard
