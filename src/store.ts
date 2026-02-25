import { createStore } from '@xstate/store-react'
import { log } from '@/utils'

export interface Config {
	plOrder: string[]
	plGrid: { cols: number, rows: number, gap: number }
}

export const store = createStore({
	context: { plOrder: [], plGrid: { cols: 7, rows: 3, gap: 12 } } as Config,
	on: {
		set: (ctx, e: { config: Config }) => ({ ...ctx, ...e.config }),
		setPlOrder: (ctx, e: { plOrder: Config['plOrder'] }) => ({ ...ctx, plOrder: e.plOrder }),
		assignPlToCell: (ctx, e: { plId: string, cellId: number }) => {
			log(`Assigning playlist '${e.plId}' to cell '${e.cellId}'`)
			while (e.cellId > ctx.plOrder.length) ctx.plOrder.push('')
			ctx.plOrder[e.cellId] = e.plId
			const lastValidIdx = ctx.plOrder.findLastIndex(Boolean)
			return { ...ctx, plOrder: ctx.plOrder.slice(0, lastValidIdx + 1) }
		},
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