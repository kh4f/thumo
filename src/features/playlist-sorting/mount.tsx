import { createRoot, type Root } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { PlaylistsWidget } from './widget'

let widgetEl: HTMLElement | null = null
let widgetRoot: Root | null = null

export const mountPlaylistsWidget = async () => {
	const plsContainer = await waitForEl('#contents.ytd-rich-grid-renderer')
	log('Playlists container:', plsContainer)

	widgetEl ??= document.getElementById('thumo-playlists-widget')
		?? Object.assign(document.createElement('div'), { id: 'thumo-playlists-widget' })

	if (widgetEl.parentElement !== plsContainer) plsContainer.before(widgetEl)
	widgetRoot ??= createRoot(widgetEl)

	widgetRoot.render(<PlaylistsWidget/>)
	log('Playlists widget mounted:', widgetEl)
}