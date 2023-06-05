import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import { Tooltip } from '@mui/material'

function CopyClipboardIcon(): ReactElement {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			style={{ height: '24', width: '24' }}
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			strokeWidth={2}
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
			/>
		</svg>
	)
}

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
				<button type='button' onClick={handleCopy}>
					<CopyClipboardIcon />
				</button>
			)}
		</Tooltip>
	)
}

CopyToClipboard.defaultProps = {
	onCopied: noopFunction
}

export default CopyToClipboard
