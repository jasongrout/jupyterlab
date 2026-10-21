// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { getExtensionFromMimeType } from '@jupyterlab/coreutils';

describe('@jupyterlab/coreutils', () => {
  describe('getExtensionFromMimeType()', () => {
    it('should return common extensions', () => {
      expect(getExtensionFromMimeType('image/png')).toBe('png');
      expect(getExtensionFromMimeType('image/jpeg')).toBe('jpg');
      expect(getExtensionFromMimeType('image/gif')).toBe('gif');
      expect(getExtensionFromMimeType('image/webp')).toBe('webp');

      expect(getExtensionFromMimeType('audio/mp3')).toBe('mp3');
      expect(getExtensionFromMimeType('audio/wav')).toBe('wav');

      expect(getExtensionFromMimeType('video/mp4')).toBe('mp4');
      expect(getExtensionFromMimeType('video/webm')).toBe('webm');
    });

    it('should return the conventional extension for standard media types', () => {
      expect(getExtensionFromMimeType('audio/mpeg')).toBe('mp3');
      expect(getExtensionFromMimeType('audio/ogg')).toBe('ogg');
      expect(getExtensionFromMimeType('audio/aac')).toBe('aac');
      expect(getExtensionFromMimeType('video/quicktime')).toBe('mov');
    });

    it('should ignore MIME type parameters and case', () => {
      expect(getExtensionFromMimeType('image/svg+xml;charset=utf-8')).toBe(
        'svg'
      );
      expect(getExtensionFromMimeType('audio/mpeg; codecs="mp3"')).toBe('mp3');
      expect(getExtensionFromMimeType('Image/PNG')).toBe('png');
    });

    it('should fall back to a single-word subtype for other media types', () => {
      expect(getExtensionFromMimeType('image/avif')).toBe('avif');
      expect(getExtensionFromMimeType('audio/webm')).toBe('webm');
      expect(getExtensionFromMimeType('image/x-unknown')).toBe('bin');
      expect(getExtensionFromMimeType('text/plain')).toBe('bin');
    });

    it('should return bin for unknown MIME types', () => {
      expect(getExtensionFromMimeType('application/x-unknown-type')).toBe(
        'bin'
      );
      expect(getExtensionFromMimeType('')).toBe('bin');
      expect(getExtensionFromMimeType('not-a-mime-type')).toBe('bin');
    });
  });
});
