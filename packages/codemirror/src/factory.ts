// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { CodeEditor, IEditorFactoryService } from '@jupyterlab/codeeditor';
import { IChangedArgs } from '@jupyterlab/coreutils';

import { nullTranslator, ITranslator } from '@jupyterlab/translation';
import { JSONExt, JSONObject } from '@lumino/coreutils';
import { ISignal, Signal } from '@lumino/signaling';

import { CodeMirrorEditor } from './editor';



/**
 * CodeMirror editor factory.
 */
export class CodeMirrorEditorFactory implements IEditorFactoryService {
  /**
   * Construct an IEditorFactoryService for CodeMirrorEditors.
   * 
   * You can specify a default editor config, which is merged on top of the plugin defaults
   */
  constructor(
    defaults: Partial<CodeMirrorEditor.IConfig> = {},
    translator?: ITranslator
  ) {
    this.translator = translator || nullTranslator;
    this.defaults = defaults;
  }

  /**
   * Create a new editor for inline code.
   */
  newInlineEditor = (options: CodeEditor.IOptions) => {
    options.host.dataset.type = 'inline';
    return new CodeMirrorEditor({
      ...options,
      config: { ...this.inlineCodeMirrorConfig, ...(options.config || {}) },
      translator: this.translator
    });
  };

  /**
   * Create a new editor for a full document.
   */
  newDocumentEditor = (options: CodeEditor.IOptions) => {
    options.host.dataset.type = 'document';
    return new CodeMirrorEditor({
      ...options,
      config: { ...this.documentCodeMirrorConfig, ...(options.config || {}) },
      translator: this.translator
    });
  };

  set defaults(newValue: Partial<CodeMirrorEditor.IConfig>) {
    const oldValue = this._defaults;

    // Only proceed if there really is a change
    if (JSONExt.deepEqual(oldValue as JSONObject, newValue as JSONObject)) {
      return;
    }

    this.inlineCodeMirrorConfig = {
      ...CodeMirrorEditor.defaultConfig,
      extraKeys: {
        'Cmd-Right': 'goLineRight',
        End: 'goLineRight',
        'Cmd-Left': 'goLineLeft',
        Tab: 'indentMoreOrinsertTab',
        'Shift-Tab': 'indentLess',
        'Cmd-/': 'toggleComment',
        'Ctrl-/': 'toggleComment',
        'Ctrl-G': 'find',
        'Cmd-G': 'find'
      },
      ...newValue
    };
    this.documentCodeMirrorConfig = {
      ...CodeMirrorEditor.defaultConfig,
      extraKeys: {
        Tab: 'indentMoreOrinsertTab',
        'Shift-Tab': 'indentLess',
        'Cmd-/': 'toggleComment',
        'Ctrl-/': 'toggleComment',
        'Shift-Enter': () => {
          /* no-op */
        }
      },
      lineNumbers: true,
      scrollPastEnd: true,
      ...newValue
    };
    this._defaults = newValue;
    this._defaultsChanged.emit({name: 'defaults', oldValue, newValue})
  }



  /**
   * A signal emitted when defaults change.
   * 
   * Once we create the codemirror and hand it off, the user doesn't know it is a codemirror thing, so we can't use codemirror-specific configuration, i.e., we can't just tell the user to set the options blindly. I mean, we *could* from a typing standpoint, but there is no guarantee the user will apply our codemirror-specific options to a codemirror editor vs some other codeeditor. This comes because the codemirror configuration may be more specific than the generic editor configuration.
   * 
   * Another way to do it is to just keep track of our editors ourselves. This introduces a reference (but we have disposal to clean those up), but doesn't allow the consumer to control when/how defaults are applied, and we have no way to tell the consumer it should apply its own customizations after we reset the defaults.
   * 
   * The way we currently do it, each consumer maintains its own set of options as settings, and so the user has to configure things for each use of the editor.
   */
   get defaultsChanged(): ISignal<this, IChangedArgs<Partial<CodeMirrorEditor.IConfig>>> {
    return this._defaultsChanged;
  }

  private _defaultsChanged = new Signal<this, IChangedArgs<Partial<CodeMirrorEditor.IConfig>>>(this);
  private _defaults: Partial<CodeMirrorEditor.IConfig>;
  protected translator: ITranslator;
  protected inlineCodeMirrorConfig: Partial<CodeMirrorEditor.IConfig>;
  protected documentCodeMirrorConfig: Partial<CodeMirrorEditor.IConfig>;
}
