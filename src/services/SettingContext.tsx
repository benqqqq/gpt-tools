import type { ReactElement } from 'react'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { database } from '../storage/database'

interface ISetting {
	openaiApiKey: string
}

export interface ISettingContext {
	setting: ISetting
	isLoading: boolean
	storeSetting: (settingKey: keyof ISetting, value: string) => void
}

export const defaultSettingContext: ISettingContext = {
	setting: {
		openaiApiKey: ''
	},
	isLoading: false,
	storeSetting: () => void 0
}

const SettingContext = createContext<ISettingContext>(defaultSettingContext)

export function SettingProvider({
	children
}: {
	children: React.ReactNode
}): ReactElement {
	const [setting, setSetting] = useState<ISetting>(
		defaultSettingContext.setting
	)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const getSettingsFromStorage = async (): Promise<void> => {
			setIsLoading(true)
			const credentials = await database.credentials.toArray()
			const settingFromStorage = {} as ISetting
			for (const credential of credentials) {
				settingFromStorage[credential.name as keyof ISetting] = credential.value
			}
			setSetting(settingFromStorage)
			setIsLoading(false)
		}

		void getSettingsFromStorage()
	}, [])

	const storeSetting = useCallback(
		async (settingKey: keyof ISetting, value: string) => {
			setIsLoading(true)

			const updatedCount = await database.credentials
				.where('name')
				.equals(settingKey)
				.modify(s => {
					// eslint-disable-next-line no-param-reassign
					s.value = value
				})

			if (updatedCount === 0) {
				await database.credentials.add({
					name: settingKey,
					value
				})
			}
			setIsLoading(false)
		},
		[]
	)

	const settingContext: ISettingContext = useMemo(
		() => ({
			setting,
			isLoading,
			storeSetting
		}),
		[setting, isLoading, storeSetting]
	)

	return (
		<SettingContext.Provider value={settingContext}>
			{children}
		</SettingContext.Provider>
	)
}

export const useSettingContext = (): ISettingContext =>
	useContext(SettingContext)

export default {
	SettingProvider
}
