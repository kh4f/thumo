import { useEffect, useRef, useState } from 'react'
import { useSelector } from '@xstate/store-react'
import { store, type Config } from '@/store'
import { log } from '@/utils'

let cells: HTMLElement[] = []

export const PlaylistGrid = ({ origPlContainer }: { origPlContainer: HTMLElement }) => {
	const cfg = useSelector(store, state => state.context)
	const cellCount = cfg.plGrid.cols * cfg.plGrid.rows
	const [plEls, setPlEls] = useState<HTMLElement[]>([])

	useEffect(() => {
		const syncPlEls = () => {
			const pls = [...origPlContainer.querySelectorAll<HTMLElement>('ytd-rich-item-renderer')]
			log('Syncing playlists with grid:', pls.length)
			pls.forEach(assignPlId)
			setPlEls(pls)
		}

		const assignPlId = (el: HTMLElement) => {
			const plUrl = el.querySelector('a')!.getAttribute('href')!
			const plId = new URL(plUrl, location.origin).searchParams.get('list')
			if (!plId) return log('Failed to extract playlist ID from element:', el)
			el.dataset.id = plId
		}

		syncPlEls()

		const observer = new MutationObserver(muts => {
			let needsSync = false
			for (const mut of muts)
				for (const node of mut.addedNodes)
					if (node instanceof HTMLElement && node.matches('ytd-rich-item-renderer')) needsSync = true

			if (needsSync) syncPlEls()
		})
		observer.observe(origPlContainer, { childList: true, subtree: true })

		return () => observer.disconnect()
	}, [origPlContainer])

	const plOrder = Array.from({ length: cellCount }).reduce<string[]>((acc, _, i) => (
		acc.push((cfg.plOrder[i]
			? plEls.find(el => el.dataset.id === cfg.plOrder[i])
			: plEls.find(el => !acc.includes(el.dataset.id!) && !cfg.plOrder.includes(el.dataset.id!)))?.dataset.id ?? ''), acc
	), [])

	log('Playlist grid rendered with order:', plOrder)

	return plOrder.map((plId, i) => {
		const el = plEls.find(p => p.dataset.id === plId)
		return <div className="cell" key={i} data-id={i}>
			{el && <Playlist el={el} plOrder={plOrder}/>}
		</div>
	})
}

const getClosestCell = (pl: HTMLDivElement) => {
	const rect = pl.getBoundingClientRect()
	const plCenterX = rect.left + rect.width / 2
	const plCenterY = rect.top + rect.height / 2
	return cells.reduce((closest, cell) => {
		const cellRect = cell.getBoundingClientRect()
		const cellCenterX = cellRect.left + cellRect.width / 2
		const cellCenterY = cellRect.top + cellRect.height / 2
		const dist = Math.hypot(plCenterX - cellCenterX, plCenterY - cellCenterY)
		return dist < closest.dist ? { cell, dist } : closest
	}, { cell: null as HTMLElement | null, dist: Infinity }).cell
}

const Playlist = ({ el, plOrder }: { el: HTMLElement, plOrder: Config['plOrder'] }) => {
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => ref.current?.replaceChildren(el), [el])

	const offsetRef = useRef({ offsetX: 0, offsetY: 0 })
	const skipPlOpenRef = useRef(false)
	const dragStartRef = useRef<{ x: number, y: number } | null>(null)

	const handlePointerDown = (e: React.PointerEvent) => {
		e.preventDefault() // prevent link dragging on title
		if (e.button !== 0) return // only allow left mouse button for dragging
		if (['.yt-lockup-metadata-view-model__menu-button', '.yt-lockup-metadata-view-model__metadata'].some(selector => (e.target as HTMLElement).closest(selector))) {
			skipPlOpenRef.current = true
			return
		}

		log('Drag started:', el.dataset.id)
		const pl = e.currentTarget as HTMLDivElement
		const rect = pl.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top
		offsetRef.current = { offsetX, offsetY }
		dragStartRef.current = { x: e.clientX, y: e.clientY }
		pl.dataset.dragging = ''
		pl.parentElement!.dataset.dragSource = ''
		pl.style.width = `${pl.offsetWidth}px`
		pl.setPointerCapture(e.pointerId)
		cells = [...document.querySelectorAll<HTMLElement>('#thumo-playlist-grid .cell')]
	}

	const handlePointerMove = (e: React.PointerEvent) => {
		const pl = e.currentTarget as HTMLDivElement
		if (!('dragging' in pl.dataset)) return

		// prevent accidental drag on click
		if (dragStartRef.current) {
			const cursorDist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y)
			if (cursorDist < 3) return
			dragStartRef.current = null
		}

		log('Dragging:', el.dataset.id)
		pl.style.position = 'absolute'
		pl.style.zIndex = '1'
		pl.style.left = `${e.clientX - offsetRef.current.offsetX}px`
		pl.style.top = `${e.clientY - offsetRef.current.offsetY}px`

		const dropCell = getClosestCell(pl)
		cells.forEach(cell => {
			if (cell === dropCell) cell.dataset.dropTarget = ''
			else delete cell.dataset.dropTarget
		})
	}

	const handlePointerUp = (e: React.PointerEvent) => {
		const pl = e.currentTarget as HTMLDivElement
		if (skipPlOpenRef.current) return (skipPlOpenRef.current = false)
		if (!('dragging' in pl.dataset)) return
		if (!pl.style.position) return open(pl.querySelector('a')!.href, e.button === 1 ? '_blank' : '_self')

		log('Dropped:', el.dataset.id)
		const dropCell = getClosestCell(pl)
		if (dropCell && dropCell !== pl.parentElement) {
			store.trigger.setPlOrder({ plOrder })
			store.trigger.assignPlToCell({ plId: pl.dataset.id!, cellId: Number(dropCell.dataset.id) })
			store.trigger.assignPlToCell({ plId: '', cellId: Number(pl.parentElement!.dataset.id) })
			const swapPl = dropCell.firstElementChild as HTMLDivElement | null
			if (swapPl) store.trigger.assignPlToCell({ plId: swapPl.dataset.id!, cellId: Number(pl.parentElement!.dataset.id) })
		}

		pl.style.cssText = ''
		delete pl.dataset.dragging
		pl.releasePointerCapture(e.pointerId)
		cells.forEach(cell => {
			delete cell.dataset.dragSource
			delete cell.dataset.dropTarget
		})
	}

	return <div
		className="playlist"
		ref={ref}
		data-id={el.dataset.id}
		onPointerDown={handlePointerDown}
		onPointerMove={handlePointerMove}
		onPointerUp={handlePointerUp}
	></div>
}

void gcss`
	#thumo-playlist-grid {
		&, * { box-sizing: border-box; }
		width: 100%;
		padding: 24px;
		padding-top: calc(var(--gap) + 10px);
		display: grid;
		grid-template-columns: repeat(var(--cols), minmax(0, 150px));
		grid-template-rows: repeat(var(--rows), minmax(0, auto));
		justify-content: start;
		gap: var(--gap);
		--inside-thumo-grid: 1;

		.cell {
			border: 2px dashed hsl(0, 0%, 100%, 0.05);
			border-radius: 12px;
			transition: all 0.2s ease;

			&[data-drop-target] {
				border-color: hsl(0, 0%, 100%, 0.3);
				background-color: hsl(0, 0%, 100%, 0.03);
			}

			* { user-select: none; }

			.playlist ytd-rich-item-renderer {
				display: block;
				width: if(style(--inside-thumo-grid: 1): 100%; else: 200px);
				margin: 6px 0 0 0;
				border-radius: 12px;
				background-color: hsl(0, 0%, 8%);

				> #content > yt-lockup-view-model > div > a {
					padding-bottom: 0px;

					.ytThumbnailViewModelAspectRatio16By9 {
						padding-top: 48%;
					}

					+ div {
						padding: 6px 12px;

						h3 span {
							font-size: 14px;
							white-space: nowrap;
						}

						.yt-lockup-metadata-view-model__metadata {
							position: absolute;
							z-index: 2;
							right: 0;
							margin-right: -3px;
							margin-top: -60%;

							&:not(ytd-rich-item-renderer:has(.yt-spec-touch-feedback-shape--hovered)
							.yt-lockup-metadata-view-model__metadata) {
								display: none;
							}

							.yt-content-metadata-view-model__metadata-row {
								justify-content: end;

								span {
									font-size: 9px;
									line-height: 1;
									color: hsl(0, 0%, 80%);
								}
							}
						}
					}
				}
			}
		}
	}

	/* hide original playlist grid */
	body[data-page-type="playlists"] ytd-browse[role="main"] #contents { display: none; }

	/* prevent preview from intercepting drag events */
	ytd-video-preview { pointer-events: none !important; }
`