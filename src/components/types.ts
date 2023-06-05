export interface IJSONAnswer {
	corrections: ({
		sentence?: number
		original?: string
		refined?: string
		score?: number
		reasons: string[]
		diff: {
			added?: boolean
			removed?: boolean
			value: string
		}[]
	} | null)[]
	grade: {
		score?: number
		grade_reasons: string[]
		improve_directions: string[]
	}
}

export interface IDataJsonLine {
	type: string
	data: unknown
}

export interface IDataCorrection {
	line: number
	original: string
	refined: string
	score: number
}

export interface IDataReason {
	line: number
	reason: string
}
