import type { ReactElement, Ref } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { TextareaAutosizeProps } from '@mui/material'
import { TextareaAutosize as MuiTextareaAutosize } from '@mui/material'

interface ITextareaAutosizeProperties extends TextareaAutosizeProps {
	maxRowsWhenNotActive?: number
}
const TextareaAutosize = forwardRef(
	(
		{
			maxRowsWhenNotActive,
			maxRows,
			...properties
		}: ITextareaAutosizeProperties,
		ref: Ref<HTMLTextAreaElement>
	): ReactElement => {
		// eslint-disable-next-line react/jsx-props-no-spreading
		const [isActive, setIsActive] = useState(false)
		const handleFocus = useCallback(() => setIsActive(true), [])
		const handleBlur = useCallback(() => setIsActive(false), [])

		return (
			<MuiTextareaAutosize
				onFocus={handleFocus}
				onBlur={handleBlur}
				maxRows={isActive ? maxRows : maxRowsWhenNotActive}
				ref={ref}
				{...properties}
			/>
		)
	}
)

TextareaAutosize.defaultProps = {
	maxRowsWhenNotActive: undefined
}

export default TextareaAutosize
