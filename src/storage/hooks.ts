import { useCallback, useEffect, useRef, useState } from 'react'
import { database } from './database'

export const useOpenAiApiKey = (): [
	string,
	(value: string) => void,
	() => void,
	boolean
] => {
	const [openAiApiKey, setOpenAiApiKey] = useState<string>('')
	const databaseKeyId = useRef<number | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			setIsLoading(true)
			const key = await database.credentials
				.where('name')
				.equals('openaiApiKey')
				.first()
			if (key) {
				setOpenAiApiKey(key.value)
				databaseKeyId.current = key.id as number
			}
			setIsLoading(false)
		}
		void fetchData()
	}, [])

	const storeOpenAiApiKey = useCallback(async () => {
		// setIsSaving(true);

		setIsLoading(true)
		await (databaseKeyId.current
			? database.credentials.update(databaseKeyId.current, {
					value: openAiApiKey
			  })
			: database.credentials.add({
					name: 'openaiApiKey',
					value: openAiApiKey
			  }))
		setIsLoading(false)
	}, [openAiApiKey])

	return [openAiApiKey, setOpenAiApiKey, storeOpenAiApiKey, isLoading]
}

export default {
	useOpenAiApiKey
}
