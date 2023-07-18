import type { Table } from 'dexie'
import Dexie from 'dexie'

interface ICredential {
	id?: number
	name: string
	value: string
}

/**
 * TODO: implement the storing logic inside GpyPlayground (currently only have interface here)
 */
interface IChatMessage {
	id?: number
	chatId: number
	promptTemplateKey: string
	role: 'assistant' | 'system' | 'user'
	content: string
	timestamp: Date
}

interface IVocabulary {
	id?: number
	word: string
	timestamp: Date
	archived: boolean
}

const VERSION = 6

export class MySubClassedDexie extends Dexie {
	public readonly credentials!: Table<ICredential>

	public readonly chatMessages!: Table<IChatMessage>

	public readonly vocabulary!: Table<IVocabulary>

	public constructor() {
		super('gpt-tools')
		this.version(VERSION).stores({
			// Primary key and indexed props
			credentials: '++id, name',
			chatMessages: '++id, chatId, promptTemplateKey, role, timestamp',
			vocabulary: '++id, word, timestamp, archived'
		})
	}
}

export const database = new MySubClassedDexie()
