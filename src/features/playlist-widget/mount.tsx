import { createRoot } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { PlaylistWidget } from './widget'
import { store } from '@/store'

export const mountPlaylistWidget = async () => {
	const plOrigContainer = await waitForEl('ytd-browse[role="main"] #contents')
	log('Playlist container found:', plOrigContainer)

	let widgetEl = document.getElementById('thumo-playlists-widget')
	if (widgetEl) log('Playlist widget already exists:', widgetEl)
	else {
		widgetEl = Object.assign(document.createElement('div'), { id: 'thumo-playlists-widget' })
		plOrigContainer.before(widgetEl)
		createRoot(widgetEl).render(<PlaylistWidget {...{ plOrigContainer }}/>)
		log('Playlist widget mounted:', widgetEl)
	}

	applyPlGridVars(widgetEl)
}

const applyPlGridVars = (plWidget: HTMLElement) => {
	const vars = store.getSnapshot().context.plGrid
	plWidget.style.setProperty('--cols', `${vars.cols}`)
	plWidget.style.setProperty('--rows', `${vars.rows}`)
	plWidget.style.setProperty('--cgap', `${vars.cgap}px`)
	plWidget.style.setProperty('--rgap', `${vars.rgap}px`)
	log('Applied playlist grid variables:', vars)
}