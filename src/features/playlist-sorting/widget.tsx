export const Playlist = () => {
	return <div className={playlist}></div>
}

const playlist = css`
	height: 137px;
	border: 1px solid rgba(0, 255, 13, 0.692);
`

export const PlaylistsWidget = () => {
	return (
		<>
			<Playlist/>
			<Playlist/>
			<Playlist/>
			<Playlist/>
			<Playlist/>
			<Playlist/>
			<Playlist/>
			<Playlist/>
			<Playlist/>
		</>
	)
}

void gcss`
	#thumo-playlists-widget {
		width: 100%;
		border: 1px solid red;
		padding: 24px;
		display: grid;
		grid-template-columns: repeat(6, minmax(150px, 200px));
		justify-content: start;
		gap: 19px 16px;

		&, * {
			box-sizing: border-box;
		}
	}

	#contents.ytd-rich-grid-renderer {
		box-sizing: border-box;
		padding-left: 24px;
		gap: 19px 16px;

		ytd-rich-item-renderer {
			width: 200px;
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