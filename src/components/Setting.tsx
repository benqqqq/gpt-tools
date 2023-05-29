import type { ChangeEvent, ReactElement } from 'react'
import { useCallback } from 'react'
import { useOpenAiApiKey } from '../storage/hooks'

export default function Setting(): ReactElement {
	const [openAiApiKey, setOpenAiApiKey, storeOpenAiApiKey, isLoading] =
		useOpenAiApiKey()

	const handleOnBlur = useCallback(async () => {
		storeOpenAiApiKey()
	}, [storeOpenAiApiKey])

	const handleOnChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setOpenAiApiKey(event.target.value)
		},
		[setOpenAiApiKey]
	)

	return (
		<div>
			<h1>Setting</h1>
			<ul>
				<li>
					OPENAI_API_KEY :{' '}
					<input
						className='text-orange-700'
						value={openAiApiKey}
						onBlur={handleOnBlur}
						onChange={handleOnChange}
						type='password'
						placeholder='openai api key'
						readOnly={isLoading}
					/>
				</li>
			</ul>
		</div>
	)
}
