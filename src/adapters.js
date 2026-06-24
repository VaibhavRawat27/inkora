/**
 * @typedef {Object} EditorAdapters
 * 
 * @property {function(File): Promise<{src: string, id: string}>} onUpload
 * Injected media upload handler. Must return a promise resolving to an object with:
 * - src: A logical reference or persistent URL (e.g. "uuid-image.png").
 * - id: A unique identifier for the upload session.
 * 
 * @property {function(Object): Promise<void>} onSave
 * Injected document save handler. Called with the JSON output of the editor.
 * Implementation should handle debouncing if needed, or the editor will debounce internally.
 * 
 * @property {function(): Promise<Object>} onLoad
 * Injected document load handler. Should return the saved JSON or a default empty document.
 * 
 * @property {function(string): string} resolveMediaUrl
 * Maps a stored logical reference (e.g. "uuid-image.png") to a servable URL.
 * In simple cases, this returns the string as-is.
 * 
 * @property {function(string): Promise<Array<{id: string, label: string}>>} [mentionSource]
 * Optional: Resolves a query string to a list of mention suggestions.
 */

export {};
