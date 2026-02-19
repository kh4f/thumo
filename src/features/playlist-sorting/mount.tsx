import { createRoot, type Root } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { PlaylistsWidget } from './widget'

let widgetRoot: Root | null = null
const playlists: Element[] = []
let plsObserver: MutationObserver | null = null

export const mountPlaylistsWidget = async () => {
	const plsContainer = await waitForEl('#contents.ytd-rich-grid-renderer')
	log('Playlists container:', plsContainer)
	if (plsObserver) {
		plsObserver.disconnect()
		plsObserver = null
	}
	observePlaylistItems(plsContainer)

	let widgetEl = document.getElementById('thumo-playlists-widget')
	if (widgetEl) widgetRoot?.unmount()
	else widgetEl = Object.assign(document.createElement('div'), { id: 'thumo-playlists-widget', class: 'style-scope ytd-rich-grid-renderer' })

	if (widgetEl.parentElement !== plsContainer) plsContainer.before(widgetEl)
	widgetRoot = createRoot(widgetEl)

	setTimeout(() => {
		const pls = document.querySelectorAll('ytd-rich-item-renderer:has(yt-collection-thumbnail-view-model)')
		const clones = [...pls].map(el => el.cloneNode(true) as Element)
		widgetRoot!.render(<PlaylistsWidget playlists={clones}/>)
		log('Playlists widget mounted:', widgetEl)
	}, 2000)
}

const handlePlaylistLoad = (el: HTMLElement) => {
	log('Playlist item added:', el)
	const plUrl = el.querySelector('a')?.getAttribute('href')
	if (!plUrl) return
	const plId = new URL(plUrl, location.origin).searchParams.get('list')
	log('ID:', plId)
	if (!plId) return
	el.dataset.id = plId
	playlists.push(el)
}

const observePlaylistItems = (target: Element) => {
	const selector = '#contents.ytd-rich-grid-renderer ytd-rich-item-renderer'
	const currentPls = document.querySelectorAll<HTMLElement>(selector)
	currentPls.forEach(handlePlaylistLoad)

	plsObserver = new MutationObserver(muts => {
		for (const mut of muts)
			for (const node of mut.addedNodes) {
				if (!(node instanceof HTMLElement)) continue
				if (node.matches(selector)) handlePlaylistLoad(node)
			}
	})
	plsObserver.observe(target, { childList: true, subtree: true })
}