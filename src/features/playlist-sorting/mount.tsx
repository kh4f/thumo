import { createRoot } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { PlaylistGrid } from './grid'
import { store } from '@/store'

export const mountPlaylistGrid = async () => {
	const origPlContainer = await waitForEl('ytd-browse[role="main"] #contents')
	log('Original playlist container found:', origPlContainer)

	let widgetEl = document.getElementById('thumo-playlist-grid')
	if (widgetEl) log('Playlist grid already exists:', widgetEl)
	else {
		widgetEl = Object.assign(document.createElement('div'), { id: 'thumo-playlist-grid' })
		origPlContainer.before(widgetEl)
		createRoot(widgetEl).render(<PlaylistGrid origPlContainer={origPlContainer}/>)
		log('Playlist grid mounted:', widgetEl)
		applyPlGridVars(widgetEl)
	}
}

const applyPlGridVars = (plWidget: HTMLElement) => {
	const vars = store.getSnapshot().context.plGrid
	plWidget.style.setProperty('--cols', `${vars.cols}`)
	plWidget.style.setProperty('--rows', `${vars.rows}`)
	plWidget.style.setProperty('--gap', `${vars.gap}px`)
	log('Applied playlist grid variables:', vars)
}