import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import {
	Checkbox,
	FormControlLabel,
	FormGroup,
	TextareaAutosize
} from '@mui/material'
import type { IJSONAnswer } from './types'

export default function DebugArea({
	answer,
	jsonAnswer
}: {
	answer: string
	jsonAnswer: IJSONAnswer
}): ReactElement {
	const JSON_SPACE = 2
	const [isDebug, setIsDebug] = useState(true)
	const handleIsDebugClick = useCallback(() => {
		setIsDebug(d => !d)
	}, [])

	return (
		<div>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox checked={isDebug} onChange={handleIsDebugClick} />}
					label='Debug'
				/>
			</FormGroup>
			{isDebug ? (
				<div className='flex'>
					<div className='w-1/2'>
						<h3 className='text-lg'>📑 JSON answer</h3>
						<TextareaAutosize
							value={JSON.stringify(jsonAnswer, undefined, JSON_SPACE)}
							cols={80}
							readOnly
						/>
					</div>
					<div className='w-1/2'>
						<h3 className='text-lg'>📑 Raw answer</h3>
						<TextareaAutosize
							value={answer.replaceAll('\n', '\n\n')}
							cols={80}
							readOnly
						/>
					</div>
				</div>
			) : undefined}
		</div>
	)
}
