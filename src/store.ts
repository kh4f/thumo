import { createStore } from '@xstate/store-react'
import { log } from '@/utils'

export interface Config {
	plOrder: string[][]
	plGrid: { cols: number, rows: number, gap: number }
}

export const store = createStore({
	context: { plOrder: [], plGrid: { cols: 7, rows: 3, gap: 12 } } as Config,
	on: {
		set: (ctx, e: { config: Config }) => ({ ...ctx, ...e.config }),
		setPlOrder: (ctx, e: { plOrder: Config['plOrder'] }) => ({ ...ctx, plOrder: e.plOrder }),
		assignPlToCell: (ctx, e: { plId: string, cellId: string }) => {
			log(`Assigning playlist '${e.plId}' to cell [${e.cellId}]`)
			const [row, col] = e.cellId.split('-').map(Number)
			while (row > ctx.plOrder.length) ctx.plOrder.push([])
			while (col > ctx.plOrder[row].length) ctx.plOrder[row].push('')
			ctx.plOrder[row][col] = e.plId
			return { ...ctx, plOrder: ctx.plOrder }
		},
		trimPlOrder: ctx => {
			for (const row of ctx.plOrder)
				while (row.length > 0 && !row[row.length - 1]) row.pop()
			while (ctx.plOrder.length > 0 && !ctx.plOrder[ctx.plOrder.length - 1].length)
				ctx.plOrder.pop()
			log('Trimmed playlist order matrix:', ctx.plOrder)
			return { ...ctx, plOrder: ctx.plOrder }
		},
		resetPlOrder: ctx => ({ ...ctx, plOrder: [] }),
	},
})

store.subscribe(state => {
	log('Store updated:', state)
	void chrome.storage.sync.set(state.context)
})

export async function hydrateStore() {
	const config = await chrome.storage.sync.get<Config>()
	log('Hydrating store with config:', config)
	store.trigger.set({ config })
}