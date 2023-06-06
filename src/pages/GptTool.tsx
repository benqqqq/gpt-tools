import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import EnglishCorrectnessChecker from '../components/EnglishCorrectnessChecker/EnglishCorrectnessChecker'
import { OpenAIProvider } from '../services/OpenAiContext'
import { SettingProvider } from '../services/SettingContext'

export default function GptToolPage(): ReactElement {
	// const { isLoading, isError, error, data } = useQuery(['fruits'], getFruits)
	// if (isLoading || isError) {
	// 	return <LoadingOrError error={error as Error} />
	// }

	return (
		<>
			<Head title='English Correctness Checker' />
			<SettingProvider>
				<OpenAIProvider>
					<EnglishCorrectnessChecker />
				</OpenAIProvider>
			</SettingProvider>
		</>
	)
}
