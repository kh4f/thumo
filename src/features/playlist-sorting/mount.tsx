import { createRoot } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { PlaylistsWidget } from './widget'
import { store } from '@/store'

export const mountPlaylistsWidget = async () => {
	const plsContainer = await waitForEl('ytd-browse[role="main"] #contents.ytd-rich-grid-renderer')
	log('Playlists container found:', plsContainer)

	let widgetEl = document.getElementById('thumo-playlists-widget')
	if (widgetEl) log('Playlists widget already exists:', widgetEl)
	else {
		widgetEl = Object.assign(document.createElement('div'), { id: 'thumo-playlists-widget', class: 'style-scope ytd-rich-grid-renderer' })
		plsContainer.before(widgetEl)
		createRoot(widgetEl).render(<PlaylistsWidget plsContainer={plsContainer}/>)
		log('Playlists widget mounted:', widgetEl)
	}

	applyPlsGridVars(widgetEl)
}

const applyPlsGridVars = (plsWidget: HTMLElement) => {
	const vars = store.getSnapshot().context.plsGrid
	plsWidget.style.setProperty('--cols', `${vars.cols}`)
	plsWidget.style.setProperty('--rows', `${vars.rows}`)
	plsWidget.style.setProperty('--cgap', `${vars.cgap}px`)
	plsWidget.style.setProperty('--rgap', `${vars.rgap}px`)
	log('Applied playlists grid variables:', vars)
}