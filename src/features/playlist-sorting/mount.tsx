import { createRoot } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { PlaylistsWidget } from './widget'

export const mountPlaylistsWidget = async () => {
	const plsContainer = await waitForEl('ytd-browse[role="main"] #contents.ytd-rich-grid-renderer')
	log('Playlists container:', plsContainer)

	let widgetEl = document.getElementById('thumo-playlists-widget')
	if (widgetEl) return log('Playlists widget already exists:', widgetEl)
	else {
		widgetEl = Object.assign(document.createElement('div'), { id: 'thumo-playlists-widget', class: 'style-scope ytd-rich-grid-renderer' })
		plsContainer.before(widgetEl)
		createRoot(widgetEl).render(<PlaylistsWidget plsContainer={plsContainer}/>)
		log('Playlists widget mounted:', widgetEl)
	}
}