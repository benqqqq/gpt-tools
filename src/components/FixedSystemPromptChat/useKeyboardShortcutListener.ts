import { useEffect } from 'react'

interface IBinding {
	onCmdK?: () => void
}

export default function useKeyboardShortcutListener(binding: IBinding): void {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.metaKey && event.key === 'k') {
				binding.onCmdK?.()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [binding])
}
