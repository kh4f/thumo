import { useEffect, useRef, useState } from 'react'

let cells: HTMLElement[] = []

export const Grid = ({ pls }: { pls: HTMLElement[] }) => {
	useEffect(() => {
		cells = [...document.querySelectorAll<HTMLElement>('#thumo-playlists-widget .cell')]
	})

	return (
		<>
			{Array.from({ length: 18 }, (_, i) => (
				<div className="cell" key={i}>
					{pls[i] && <Playlist el={pls[i]}/> }
				</div>
			))}
		</>
	)
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

const Playlist = ({ el }: { el: HTMLElement }) => {
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => ref.current?.append(el), [el])

	const [offset, setOffset] = useState({ offsetX: 0, offsetY: 0 })

	const handlePointerDown = (e: React.PointerEvent) => {
		e.preventDefault() // prevent link dragging on title

		const pl = e.currentTarget as HTMLDivElement
		const rect = pl.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top
		setOffset({ offsetX, offsetY })
		pl.dataset.dragging = ''
		pl.parentElement!.dataset.dragSource = ''
		pl.style.width = `${pl.offsetWidth}px`
		pl.setPointerCapture(e.pointerId)
	}

	const handlePointerMove = (e: React.PointerEvent) => {
		e.preventDefault()
		e.stopPropagation()
		const pl = e.currentTarget as HTMLDivElement
		if (!('dragging' in pl.dataset)) return

		pl.style.position = 'absolute'
		pl.style.zIndex = '1000'
		pl.style.left = `${e.clientX - offset.offsetX}px`
		pl.style.top = `${e.clientY - offset.offsetY}px`

		const dropCell = getClosestCell(pl)
		cells.forEach(cell => {
			if (cell === dropCell) cell.dataset.dropTarget = ''
			else delete cell.dataset.dropTarget
		})
	}

	const handlePointerUp = (e: React.PointerEvent) => {
		const pl = e.currentTarget as HTMLDivElement

		const dropCell = getClosestCell(pl)
		if (dropCell) {
			const replacePl = dropCell.firstElementChild
			if (replacePl) pl.parentElement!.append(replacePl)
			dropCell.append(pl)
		}

		pl.style.position = ''
		pl.style.width = ''
		pl.style.zIndex = ''
		delete pl.dataset.dragging
		cells.forEach(cell => {
			delete cell.dataset.dragSource
			delete cell.dataset.dropTarget
		})
	}

	return (
		<div
			className="playlist"
			ref={ref}
			data-id={el.dataset.id}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
		>
		</div>
	)
}

void gcss`
	#thumo-playlists-widget {
		&, * { box-sizing: border-box; }
		width: 100%;
		padding: 24px;
		display: grid;
		grid-template-columns: repeat(7, minmax(150px, 200px));
		grid-template-rows: repeat(auto-fill, minmax(100px, auto));
		justify-content: start;
		gap: 19px 16px;
		--inside-thumo-widget: 1;

		.cell {
			border: 2px dashed hsl(0, 0%, 100%, 0.05);
			border-radius: 12px;
			transition: all 0.2s ease;

			&[data-drop-target] {
				border-color: hsl(0, 0%, 100%, 0.3);
				background-color: hsl(0, 0%, 100%, 0.03);
			}

			.playlist {
				&, * { user-select: none; }
			}
		}
	}

	body[data-page-type="playlists"] #contents.ytd-rich-grid-renderer {
		box-sizing: border-box;
		padding-left: 24px;
		gap: 19px 16px;
		display: none;
	}

	:is(body[data-page-type="playlists"] #contents.ytd-rich-grid-renderer, #thumo-playlists-widget) ytd-rich-item-renderer {
		display: block;
		width: if(style(--inside-thumo-widget: 1): 100%; else: 200px);
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
					margin-top: -98px;

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
`