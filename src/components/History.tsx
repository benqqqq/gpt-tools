import type { ReactElement } from 'react'
import { useCallback, useMemo } from 'react'
import { List, ListItemButton, ListItemText } from '@mui/material'
import type { IAnswerMapValue } from './types'

const MAX_LENGTH_OF_HISTORY_NAME = 50
const MAX_LENGTH_OF_HISTORY_ITEM = 50

const noopFunction = (): void => {}

export default function History({
	answerMap,
	onItemClick = noopFunction
}: {
	answerMap: Record<string, IAnswerMapValue | undefined>
	onItemClick?: (historyKey: string) => void
}): ReactElement {
	const historyKeys = useMemo(
		() =>
			Object.entries(answerMap)
				.filter(([, value]) => value !== undefined)
				.sort(
					([, valueA], [, valueB]) =>
						(valueB?.createdAt.getTime() ?? 0) -
						(valueA?.createdAt.getTime() ?? 0)
				)
				.map(([key]) => key)
				.slice(0, MAX_LENGTH_OF_HISTORY_ITEM),
		[answerMap]
	)

	const handleItemClick = useCallback(
		(t: string): void => {
			onItemClick(t)
		},
		[onItemClick]
	)

	return (
		<>
			<h3 className='text-xl font-bold'>History</h3>
			<List component='div' className='max-h-[550px] overflow-y-auto'>
				{historyKeys.map(t => (
					<ListItemButton
						key={t}
						onClick={(): void => handleItemClick(t)}
						sx={{ bgcolor: 'background.paper', margin: '0.5rem' }}
					>
						<ListItemText
							primary={t.slice(0, MAX_LENGTH_OF_HISTORY_NAME)}
							secondary={`${
								answerMap[t]?.createdAt.toLocaleDateString() ?? ''
							} ${answerMap[t]?.createdAt.toLocaleTimeString() ?? ''}`}
						/>
					</ListItemButton>
				))}
			</List>
		</>
	)
}

History.defaultProps = {
	onItemClick: noopFunction
}
