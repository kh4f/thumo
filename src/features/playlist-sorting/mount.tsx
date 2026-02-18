import { createRoot, type Root } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { PlaylistsWidget } from './widget'

let widgetRoot: Root | null = null

export const mountPlaylistsWidget = async () => {
	const plsContainer = await waitForEl('#contents.ytd-rich-grid-renderer')
	log('Playlists container:', plsContainer)

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

const handlePlaylistLoad = (el: Element) => {
	console.log('New playlist item added:', el)
}

const observePlaylistNodes = () => {
	const currentPls = document.querySelectorAll('ytd-rich-item-renderer')
	currentPls.forEach(handlePlaylistLoad)
	new MutationObserver(muts => {
		for (const mut of muts)
			for (const node of mut.addedNodes) {
				if (!(node instanceof Element)) continue
				if (node.matches('ytd-rich-item-renderer')) handlePlaylistLoad(node)
			}
	}).observe(document.body, { childList: true, subtree: true })
}

observePlaylistNodes()