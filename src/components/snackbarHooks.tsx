import { Alert, Snackbar } from '@mui/material'
import type { ReactElement } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { AlertColor } from '@mui/material/Alert/Alert'

export const useSnackbar = (): [
	(message: string, severity: AlertColor) => void,
	ReactElement
] => {
	const [isOpen, setIsOpen] = useState(false)
	const [snackSeverity, setSnackSeverity] = useState<AlertColor>('success')
	const [snackMessage, setSnackMessage] = useState('')
	const handleClose = useCallback(() => {
		setIsOpen(false)
	}, [])
	const open = useCallback((message: string, severity: AlertColor) => {
		setSnackMessage(message)
		setSnackSeverity(severity)
		setIsOpen(true)
	}, [])

	const snackbarComponent = useMemo(
		() => (
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={isOpen}
				onClose={handleClose}
				message={snackMessage}
			>
				<Alert onClose={handleClose} severity={snackSeverity}>
					{snackMessage}
				</Alert>
			</Snackbar>
		),
		[handleClose, isOpen, snackMessage, snackSeverity]
	)

	return [open, snackbarComponent]
}

export default {
	useSnackbar
}
