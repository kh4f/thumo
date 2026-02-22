import { createStore } from '@xstate/store-react'
import { log } from '@/utils'

interface Config {
	plsOrder: (string | null | undefined)[]
	plsGrid: { cols: number, rows: number, cgap: number, rgap: number }
}

export const store = createStore({
	context: {
		plsOrder: [],
		plsGrid: { cols: 7, rows: 3, cgap: 12, rgap: 12 },
	} as Config,
	on: {
		set: (ctx, e: { config: Config }) => ({ ...ctx, ...e.config }),
		assignPlToCell: (ctx, e: { plId: string | null, cellId: number }) => {
			log(`Assigning playlist '${e.plId}' to cell '${e.cellId}'`)
			ctx.plsOrder[e.cellId] = e.plId
			const lastValidIdx = ctx.plsOrder.findLastIndex(v => v != null)
			return { ...ctx, plsOrder: ctx.plsOrder.slice(0, lastValidIdx + 1) }
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