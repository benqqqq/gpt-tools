import type { ReactElement } from 'react'
import { OpenAIProvider } from '../services/OpenAiContext'
import { SettingProvider } from '../services/SettingContext'
import GptPlayground from '../components/GptPlayground/GptPlayground'

export default function GptPlaygroundPage(): ReactElement {
	return (
		<SettingProvider>
			<OpenAIProvider>
				<GptPlayground />
			</OpenAIProvider>
		</SettingProvider>
	)
}
