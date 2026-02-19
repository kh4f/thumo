import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { log, waitForEl } from '@/utils'
import { Grid } from './widget'

const PlaylistsWidget = ({ plsContainer }: { plsContainer: Element }) => {
	const [playlists, setPlaylists] = useState<HTMLElement[]>([])

	const addPlaylist = (el: HTMLElement) => {
		log('Playlist item added:', el)
		const plUrl = el.querySelector('a')?.getAttribute('href')
		if (!plUrl) return
		const plId = new URL(plUrl, location.origin).searchParams.get('list')
		log('ID:', plId)
		if (!plId) return
		el.dataset.id = plId
		setPlaylists(prev => {
			if (prev.some(e => e.dataset.id === plId)) return prev
			return [...prev, el]
		})
	}

	useEffect(() => {
		let observer: MutationObserver | null = null

		const existingPls = plsContainer.querySelectorAll<HTMLElement>('ytd-rich-item-renderer')
		log('Existing playlist items found:', existingPls.length)
		existingPls.forEach(addPlaylist)

		observer = new MutationObserver(muts => {
			for (const mut of muts)
				for (const node of mut.addedNodes) {
					if (!(node instanceof HTMLElement)) continue
					if (node.matches('ytd-rich-item-renderer')) addPlaylist(node)
				}
		})
		observer.observe(plsContainer, { childList: true, subtree: true })

		return () => observer.disconnect()
	}, [plsContainer])

	return <Grid playlists={playlists}/>
}

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