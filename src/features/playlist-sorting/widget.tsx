import { useRef, useEffect } from 'react'

export const Playlist = ({ el }: { el: Element }) => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (ref.current) ref.current.appendChild(el)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <div ref={ref}></div>
}

export const PlaylistsWidget = ({ playlists }: { playlists: Element[] }) => (
	<>
		{playlists.map(el => <Playlist key={crypto.randomUUID()} el={el}/>)}
	</>
)

void gcss`
	body[data-page-type="playlists"] {
		#thumo-playlists-widget {
			width: 100%;
			border: 1px solid #888888;
			padding: 24px;
			display: grid;
			grid-template-columns: repeat(6, minmax(150px, 200px));
			justify-content: start;
			gap: 19px 16px;
			--inside-thumo-widget: 1;

			&, * {
				box-sizing: border-box;
			}
		}

		#contents.ytd-rich-grid-renderer {
			box-sizing: border-box;
			padding-left: 24px;
			gap: 19px 16px;
			/* display: none; */
		}

		:is(#contents.ytd-rich-grid-renderer, #thumo-playlists-widget) ytd-rich-item-renderer {
			display: block;
			width: if(style(--inside-thumo-widget: 1): 100%; else: 200px);
			margin: 6px 0 0 0;
			border-radius: 12px;
			background-color: #ffffff05;

			> #content > yt-lockup-view-model > div > a {
				padding-bottom: 0px;

				.ytThumbnailViewModelAspectRatio16By9 {
					padding-top: 48%;
				}

				+ div {
					padding: 6px 12px;

					h3 span {
						font-size: 14px;
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
	}
`