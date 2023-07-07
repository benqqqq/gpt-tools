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

const VERSION = 5

export class MySubClassedDexie extends Dexie {
	public readonly credentials!: Table<ICredential>

	public readonly chatMessages!: Table<IChatMessage>

	public constructor() {
		super('gpt-tools')
		this.version(VERSION).stores({
			// Primary key and indexed props
			credentials: '++id, name',
			chatMessages: '++id, chatId, promptTemplateKey, role, timestamp'
		})
	}
}

export const database = new MySubClassedDexie()
