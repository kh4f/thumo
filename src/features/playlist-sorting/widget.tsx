import { useEffect, useState } from 'react'
import { log } from '@/utils'
import { Grid } from './grid'

export const PlaylistsWidget = ({ plsContainer }: { plsContainer: Element }) => {
	const [plEls, setPlEls] = useState<HTMLElement[]>([])

	const addPlaylist = (el: HTMLElement) => {
		const plUrl = el.querySelector('a')?.getAttribute('href')
		if (!plUrl) return
		const plId = new URL(plUrl, location.origin).searchParams.get('list')
		log('ID:', plId)
		if (!plId) return
		el.dataset.id = plId
		setPlEls(prev => {
			if (prev.some(e => e.dataset.id === plId)) return prev
			log('Playlist element loaded:', el)
			return [...prev, el]
		})
	}

	useEffect(() => {
		let observer: MutationObserver | null = null

		const existingPls = plsContainer.querySelectorAll<HTMLElement>('ytd-rich-item-renderer')
		log('Loaded playlist elements found:', existingPls.length)
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

	return <Grid plEls={plEls}/>
}