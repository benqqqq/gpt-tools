import type { Table } from 'dexie'
import Dexie from 'dexie'

export interface Credential {
	id?: number
	name: string
	value: string
}

export interface Conversation {
	id?: number
	scope: string
	key: string
	value: string
	createdAt: Date
}

const VERSION = 4

export class MySubClassedDexie extends Dexie {
	// 'friends' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	public readonly credentials!: Table<Credential>

	public readonly conversations!: Table<Conversation>

	public constructor() {
		super('gpt-tools')
		this.version(VERSION).stores({
			// Primary key and indexed props
			credentials: '++id, name',
			conversations: '++id, scope, key, createdAt'
		})
	}
}

export const database = new MySubClassedDexie()
