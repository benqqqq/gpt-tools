import type { ReactElement, Ref } from 'react'
import { forwardRef, useCallback } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { prompts } from './prompts'
import { matchSorter } from 'match-sorter'

const promptOptions = [...prompts.map(prompt => prompt.key), '']
const filterOptions = (
	options: string[],
	{ inputValue }: { inputValue: string }
): string[] => matchSorter(promptOptions, inputValue)

const PromptSearchCombobox = forwardRef(
	(
		{
			onSelect
		}: {
			onSelect: (key: string) => void
		},
		ref: Ref<HTMLInputElement>
	): ReactElement => {
		const handleOnChange = useCallback(
			(event: React.SyntheticEvent, value: string | null) => {
				if (value) {
					onSelect(value)
				}
			},
			[onSelect]
		)

		return (
			<Autocomplete
				value=''
				options={promptOptions}
				filterOptions={filterOptions}
				className='w-[200px]'
				autoHighlight
				openOnFocus
				selectOnFocus
				onChange={handleOnChange}
				renderInput={(params): ReactElement => (
					<TextField {...params} label='Prompt' type='text' inputRef={ref} />
				)}
			/>
		)
	}
)
export default PromptSearchCombobox
