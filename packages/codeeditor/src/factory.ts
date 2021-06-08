// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { CodeEditor } from './editor';
import { ISignal } from '@lumino/signaling';

/**
 * The editor factory service interface.
 */
export interface IEditorFactoryService {
  /**
   * Create a new editor for inline code.
   */
  newInlineEditor(options: CodeEditor.IOptions): CodeEditor.IEditor;

  /**
   * Create a new editor for a full document.
   */
  newDocumentEditor(options: CodeEditor.IOptions): CodeEditor.IEditor;

  /**
   * Signal for when the default inline editor settings change.
   *
   * Updated settings are included in the change, and can be used with
   * setOptions() to update the settings.
   */
  inlineDefaultConfigChanged: ISignal<IEditorFactoryService, Partial<CodeEditor.IConfig>>;

  /**
   * Signal for when the default document editor settings change.
   *
   * Updated settings are included in the change, and can be used with
   * setOptions() to update the settings.
   */
  documentDefaultConfigChanged: ISignal<IEditorFactoryService, Partial<CodeEditor.IConfig>>;
}
