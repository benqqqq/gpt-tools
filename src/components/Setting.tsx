import type { ChangeEvent, ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
	defaultSettingContext,
	useSettingContext
} from '../services/SettingContext'

export default function Setting(): ReactElement {
	const settingContext = useSettingContext()
	const [setting, setSetting] = useState(defaultSettingContext.setting)

	useEffect(() => {
		setSetting(settingContext.setting)
	}, [settingContext.setting])

	const handleOnBlur = useCallback(async () => {
		settingContext.storeSetting('openaiApiKey', setting.openaiApiKey)
	}, [settingContext, setting])

	const handleOnChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSetting({ ...setting, openaiApiKey: event.target.value })
		},
		[setting]
	)

	return (
		<div>
			<h1>Setting</h1>
			<ul>
				<li>
					OPENAI_API_KEY :
					<input
						className='text-orange-700'
						value={setting.openaiApiKey}
						onBlur={handleOnBlur}
						onChange={handleOnChange}
						type='password'
						placeholder='openai api key'
						readOnly={settingContext.isLoading}
					/>
				</li>
			</ul>
		</div>
	)
}
