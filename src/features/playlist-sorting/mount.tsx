import { createRoot, type Root } from 'react-dom/client'
import { log } from '@/utils'
import { PlaylistsWidget } from './widget'

let widgetEl: HTMLElement | null = null
let widgetRoot: Root | null = null

export const mountPlaylistsWidget = async () => {
	const plsContainer = await waitForPlsContainer()
	log('Playlists container:', plsContainer)

	widgetEl ??= document.getElementById('thumo-playlists-widget')
		?? Object.assign(document.createElement('div'), { id: 'thumo-playlists-widget' })

	if (widgetEl.parentElement !== plsContainer) plsContainer.before(widgetEl)
	widgetRoot ??= createRoot(widgetEl)

	widgetRoot.render(<PlaylistsWidget/>)
	log('Playlists widget mounted:', widgetEl)
}

const waitForPlsContainer = (): Promise<HTMLElement> => {
	const ytdApp = document.querySelector('body > ytd-app')!
	const getPlsContainer = () => ytdApp.querySelector<HTMLElement>('#contents.ytd-rich-grid-renderer')

	let plsContainer = getPlsContainer()
	if (plsContainer) return Promise.resolve(plsContainer)

	return new Promise(resolve => {
		new MutationObserver((_, obs) => {
			plsContainer = getPlsContainer()
			if (plsContainer) {
				obs.disconnect()
				resolve(plsContainer)
			}
		}).observe(ytdApp, { childList: true, subtree: true })
	})
}

void gcss`
	/* body[data-page-type="playlists"] {

	} */
`