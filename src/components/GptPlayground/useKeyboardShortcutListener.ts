import { useEffect } from 'react'

interface IBinding {
	onCmdK?: () => void
	onCmdJ?: () => void
	onCmdArrowUp?: () => void
	onCmdArrowDown?: () => void
}

export default function useKeyboardShortcutListener(binding: IBinding): void {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.metaKey && event.key === 'k') {
				binding.onCmdK?.()
			}
			if (event.metaKey && event.key === 'j') {
				binding.onCmdJ?.()
			}
			if (event.metaKey && event.key === 'ArrowUp') {
				binding.onCmdArrowUp?.()
			}
			if (event.metaKey && event.key === 'ArrowDown') {
				binding.onCmdArrowDown?.()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [binding])
}
