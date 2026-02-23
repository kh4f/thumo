import { useEffect, useState } from 'react'
import { log } from '@/utils'
import { PlaylistGrid } from './grid'

export const PlaylistWidget = ({ plOrigContainer }: { plOrigContainer: Element }) => {
	const [plEls, setPlEls] = useState<HTMLElement[]>([])

	const addPlaylist = (el: HTMLElement) => {
		const plUrl = el.querySelector('a')?.getAttribute('href')
		if (!plUrl) return
		const plId = new URL(plUrl, location.origin).searchParams.get('list')
		if (!plId) return
		el.dataset.id = plId
		setPlEls(prev => {
			if (prev.some(e => e.dataset.id === plId)) return prev
			log('Playlist element loaded:', el)
			log('ID:', plId)
			return [...prev, el]
		})
	}

	useEffect(() => {
		let observer: MutationObserver | null = null

		const loadedPls = plOrigContainer.querySelectorAll<HTMLElement>('ytd-rich-item-renderer')
		log('Loaded playlist elements found:', loadedPls.length)
		loadedPls.forEach(addPlaylist)

		observer = new MutationObserver(muts => {
			for (const mut of muts)
				for (const node of mut.addedNodes) {
					if (!(node instanceof HTMLElement)) continue
					if (node.matches('ytd-rich-item-renderer')) addPlaylist(node)
				}
		})
		observer.observe(plOrigContainer, { childList: true, subtree: true })

		return () => observer.disconnect()
	}, [plOrigContainer])

	return <PlaylistGrid plEls={plEls}/>
}