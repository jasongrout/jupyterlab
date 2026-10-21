/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

/**
 * Utilities for working with MIME types
 */

/**
 * Preferred file extensions for media MIME types.
 *
 * Mirrors the image, audio and video types of
 * `DocumentRegistry.getDefaultFileTypes()` in `@jupyterlab/docregistry`, plus
 * a few common types the registry does not list.
 */
const MEDIA_EXTENSIONS = new Map<string, string>([
  ['image/avif', 'avif'],
  ['image/bmp', 'bmp'],
  ['image/gif', 'gif'],
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/svg+xml', 'svg'],
  ['image/tiff', 'tif'],
  ['image/webp', 'webp'],
  ['audio/aac', 'aac'],
  ['audio/flac', 'flac'],
  ['audio/midi', 'midi'],
  ['audio/mp3', 'mp3'],
  ['audio/mp4', 'm4a'],
  ['audio/mpeg', 'mp3'],
  ['audio/ogg', 'ogg'],
  ['audio/opus', 'opus'],
  ['audio/wav', 'wav'],
  ['audio/webm', 'webm'],
  ['audio/x-midi', 'midi'],
  ['audio/x-wav', 'wav'],
  ['video/3gpp', '3gp'],
  ['video/mp4', 'mp4'],
  ['video/mpeg', 'mpeg'],
  ['video/ogg', 'ogv'],
  ['video/quicktime', 'mov'],
  ['video/webm', 'webm'],
  ['video/x-m4v', 'm4v'],
  ['video/x-matroska', 'mkv'],
  ['video/x-msvideo', 'avi']
]);

/**
 * Get the preferred file extension for a media MIME type.
 *
 * @param mimeType - The MIME type, with or without parameters (e.g., 'audio/mpeg')
 * @returns The file extension without a dot (e.g., 'mp3'), or 'bin' if unknown
 *
 * #### Notes
 * Unlisted types get 'bin' rather than a guess from the subtype, since the
 * source of dragged media chooses its MIME type.
 * Editor languages are registered in `IEditorLanguageRegistry` from `@jupyterlab/codemirror`.
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const essence = mimeType.split(';')[0].trim().toLowerCase();
  return MEDIA_EXTENSIONS.get(essence) ?? 'bin';
}
