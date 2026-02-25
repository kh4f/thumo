# Changelog


## &ensp; [` 📦 v0.3.0  `](https://github.com/kh4f/thumo/compare/v0.2.0...v0.3.0)

### &emsp; 🧨 BREAKING CHANGES
- **Grid gap configuration**: the `plGrid` interface now uses a single `gap` property instead of separate `rgap` and `cgap` options. [🡥](https://github.com/kh4f/thumo/commit/01c755e)

### &emsp; 🎁 Features
- **Playlist grid auto-refresh**: the grid now automatically refreshes when playlists are renamed or edited, eliminating the need to manually reload the page. [🡥](https://github.com/kh4f/thumo/commit/73e0ce9)

### &emsp; 🩹 Fixes
- **Reliable playlist synchronization**:
    - Playlists no longer shift positions when new items are added. [🡥](https://github.com/kh4f/thumo/commit/691d09d)
    - Grid stays synchronized with YouTube's playlist container on mutations. [🡥](https://github.com/kh4f/thumo/commit/c6f3cd3)
    - Sparse array assignments no longer fill with undefined values. [🡥](https://github.com/kh4f/thumo/commit/0e32f41)
    - Empty strings are now properly trimmed from playlist order. [🡥](https://github.com/kh4f/thumo/commit/495e4b3)
- **Enhanced drag & drop**:
    - Accidental drags on simple clicks are now prevented with cursor movement threshold. [🡥](https://github.com/kh4f/thumo/commit/f0669a5)
    - Only left mouse button can trigger dragging; middle and right buttons work normally. [🡥](https://github.com/kh4f/thumo/commit/1f9c2aa)
    - Pointer capture is properly released after drag operations complete. [🡥](https://github.com/kh4f/thumo/commit/ba47310)
- **Thumbnail widget updates**: widget now re-renders with correct thumbnail when navigating between videos. [🡥](https://github.com/kh4f/thumo/commit/9a58c88)

##### &emsp;&emsp; [Full Changelog](https://github.com/kh4f/thumo/compare/v0.2.0...v0.3.0) &ensp;•&ensp; Feb 25, 2026


## &ensp; [` 📦 v0.2.0  `](https://github.com/kh4f/thumo/compare/v0.1.0...v0.2.0)

### &emsp; 🎁 Features
- **Persistent configuration**: playlist order and grid settings now sync across devices via Chrome Sync storage. [🡥](https://github.com/kh4f/thumo/commit/a3b9e6c)
- **Adaptive playlists grid**: removed size constraints for grid cells to improve usability on small devices. [🡥](https://github.com/kh4f/thumo/commit/f650e30)

### &emsp; 🩹 Fixes
- **Responsive metadata positioning**: metadata text no longer overflows on small screens. [🡥](https://github.com/kh4f/thumo/commit/8d7ed99)
- **Fixed settings button**: playlist menu button now opens settings instead of playlist page. [🡥](https://github.com/kh4f/thumo/commit/bc5d8f7)
- **Correct tab behavior**: playlists open in new tabs only on middle-click. [🡥](https://github.com/kh4f/thumo/commit/124a26b)
- **Enabled thumbnail dragging**: playlists can now be dragged from their preview. [🡥](https://github.com/kh4f/thumo/commit/1252c75)
- **Prevented title wrapping**: playlist titles no longer wrap on small viewports. [🡥](https://github.com/kh4f/thumo/commit/29653ed)

##### &emsp;&emsp; [Full Changelog](https://github.com/kh4f/thumo/compare/v0.1.0...v0.2.0) &ensp;•&ensp; Feb 22, 2026


## &ensp; [` 📦 v0.1.0  `](https://github.com/kh4f/thumo/commits/v0.1.0)

### &emsp; 🎁 Features
- **Drag-and-drop playlist sorting**: users can now reorder playlists via drag-and-drop. [🡥](https://github.com/kh4f/thumo/commit/c0cca9f)
- **Playlists widget layout**: added a grid-based widget for displaying playlists with a clean, minimal design. [🡥](https://github.com/kh4f/thumo/commit/9123ee6)
- **Compact home thumbnails**: video thumbnails on the YouTube home page are now smaller and tidier for a more concise look. [🡥](https://github.com/kh4f/thumo/commit/566ea3e)
- **Sidebar thumbnail widget**: a video thumbnail is now shown in the sidebar on watch pages, enhancing the UI. [🡥](https://github.com/kh4f/thumo/commit/4f4b831)

##### &emsp;&emsp; [Full Changelog](https://github.com/kh4f/thumo/commits/v0.1.0) &ensp;•&ensp; Feb 20, 2026