import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import type { TextareaAutosizeProps } from '@mui/material'
import { TextareaAutosize as MuiTextareaAutosize } from '@mui/material'

interface ITextareaAutosizeProperties extends TextareaAutosizeProps {
	maxRowsWhenNotActive?: number
}
export default function TextareaAutosize({
	maxRowsWhenNotActive,
	maxRows,
	...properties
}: ITextareaAutosizeProperties): ReactElement {
	// eslint-disable-next-line react/jsx-props-no-spreading
	const [isActive, setIsActive] = useState(false)
	const handleFocus = useCallback(() => setIsActive(true), [])
	const handleBlur = useCallback(() => setIsActive(false), [])

	return (
		<MuiTextareaAutosize
			onFocus={handleFocus}
			onBlur={handleBlur}
			maxRows={isActive ? maxRows : maxRowsWhenNotActive}
			/* eslint-disable-next-line react/jsx-props-no-spreading */
			{...properties}
		/>
	)
}

TextareaAutosize.defaultProps = {
	maxRowsWhenNotActive: undefined
}
