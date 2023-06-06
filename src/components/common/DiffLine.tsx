import type { ReactElement } from 'react'

export default function DiffLine({
	diffs
}: {
	diffs: { added?: boolean; removed?: boolean; value: string }[]
}): ReactElement {
	const diffsWithKey = diffs.map((d, index) => ({
		...d,
		key: index
	}))
	return (
		<div className='rounded bg-gray-900 p-2 text-white'>
			{diffsWithKey.map(({ added, removed, value, key }) => (
				<span
					key={key}
					className={
						added
							? 'text-green-500'
							: (removed
							? 'text-red-300 line-through'
							: '')
					}
				>
					{value}
				</span>
			))}
		</div>
	)
}
