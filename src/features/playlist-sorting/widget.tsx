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
`