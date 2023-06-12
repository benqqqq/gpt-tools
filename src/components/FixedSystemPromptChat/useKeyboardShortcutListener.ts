import { useEffect } from 'react'

interface IBinding {
	onCmdK?: () => void
	onCmdJ?: () => void
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
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [binding])
}
