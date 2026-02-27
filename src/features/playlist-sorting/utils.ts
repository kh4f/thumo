import { log } from '@/utils'
import type { Config } from '@/store'
import type { PlGridElement } from './grid'

export const assignPlId = (el: HTMLElement) => {
	const plUrl = el.querySelector('a')!.getAttribute('href')!
	const plId = new URL(plUrl, location.origin).searchParams.get('list')
	if (!plId) return log('Failed to extract playlist ID from element:', el)
	el.dataset.id = plId
}

export const sortElIds = (els: PlGridElement[], order: Config['plOrder']) => {
	const elIds = new Set(els.map(e => e.dataset.id))
	const ordered = new Set(order.flat())
	const colCount = Math.max(...order.map(r => r.length))

	const remaining = Array.from(elIds).filter(id => !ordered.has(id))
	let remIdx = 0

	const sorted = order.map(row =>
		Array.from({ length: colCount }, (_, col) =>
			elIds.has(row[col]) ? row[col] : remaining.at(remIdx++) ?? '')
	)

	while (remIdx < remaining.length)
		sorted.push(Array.from({ length: colCount }, () => remaining.at(remIdx++) ?? ''))

	return sorted
}

export const getClosestCell = (pl: PlGridElement, cells: PlGridElement[]) => {
	const rect = pl.getBoundingClientRect()
	const plCenterX = rect.left + rect.width / 2
	const plCenterY = rect.top + rect.height / 2
	return cells.reduce((closest, cell) => {
		const cellRect = cell.getBoundingClientRect()
		const cellCenterX = cellRect.left + cellRect.width / 2
		const cellCenterY = cellRect.top + cellRect.height / 2
		const dist = Math.hypot(plCenterX - cellCenterX, plCenterY - cellCenterY)
		return dist < closest.dist ? { cell, dist } : closest
	}, { cell: null as PlGridElement | null, dist: Infinity }).cell
}