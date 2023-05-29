import type { Table } from 'dexie'
import Dexie from 'dexie'

export interface Credential {
	id?: number
	name: string
	value: string
}

const VERSION = 1

export class MySubClassedDexie extends Dexie {
	// 'friends' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	public readonly credentials!: Table<Credential>

	public constructor() {
		super('gpt-tools')
		this.version(VERSION).stores({
			credentials: '++id, name, value' // Primary key and indexed props
		})
	}
}

export const database = new MySubClassedDexie()
