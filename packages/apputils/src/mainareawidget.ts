// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  uuid
} from '@jupyterlab/coreutils';

import {
  Message
} from '@phosphor/messaging';

import {
  BoxLayout, Widget
} from '@phosphor/widgets';

import {
  Spinner
} from './spinner';

import {
  Toolbar
} from './toolbar';


/**
 * A widget meant to be contained in the JupyterLab main area.
 *
 * #### Notes
 * Mirrors all of the `title` attributes of the content.
 * This widget is `closable` by default.
 * This widget is automatically disposed when closed.
 * This widget ensures its own focus when activated.
 */
export
class MainAreaWidget<T extends Widget = Widget> extends Widget {
  /**
   * Construct a new main area widget.
   *
   * @param options - The options for initializing the widget.
   */
  constructor(options: MainAreaWidget.IOptions<T>) {
    super(options);
    this.addClass('jp-MainAreaWidget');
    this.id = uuid();

    const content = this.content = options.content;
    const toolbar = this.toolbar = options.toolbar || new Toolbar();
    const spinner = this._spinner;

    const layout = this.layout = new BoxLayout({spacing: 0});
    layout.direction = 'top-to-bottom';

    BoxLayout.setStretch(toolbar, 0);
    BoxLayout.setStretch(content, 1);
    BoxLayout.setStretch(spinner, 1);

    layout.addWidget(toolbar);

    if (!content.id) {
      content.id = uuid();
    }
    content.node.tabIndex = -1;

    this._updateTitle();
    content.title.changed.connect(this._updateTitle, this);
    this.title.closable = true;
    this.title.changed.connect(this._updateContentTitle, this);
    content.disposed.connect(() => this.dispose());

    if (options.populated) {
      layout.addWidget(spinner);
      this.populated = options.populated;
      this.populated.then(() => {
        this._isPopulated = true;
        const active = document.activeElement === spinner.node;
        spinner.dispose();
        layout.addWidget(content);
        if (active) {
          this._focusContent();
        }
      }).catch(e => {
        // Catch a population error.
        const error = new Widget();
        // Show the error to the user.
        const pre = document.createElement('pre');
        pre.textContent = String(e);
        error.node.appendChild(pre);
        BoxLayout.setStretch(error, 1);
        spinner.dispose();
        layout.addWidget(error);
      });
    // Handle no populated promise.
    } else {
      spinner.dispose();
      layout.addWidget(content);
      this._isPopulated = true;
      this.populated = Promise.resolve(void 0);
    }
  }

  /**
   * The content hosted by the widget.
   */
  readonly content: T;

  /**
   * The toolbar hosted by the widget.
   */
  readonly toolbar: Toolbar;

  /**
   * Whether the widget is fully populated.
   */
  get isPopulated(): boolean {
    return this._isPopulated;
  }

  /**
   * A promise that resolves when the widget is fully populated.
   */
  readonly populated: Promise<void>;

  /**
   * Handle the DOM events for the widget.
   *
   * @param event - The DOM event sent to the widget.
   *
   * #### Notes
   * This method implements the DOM `EventListener` interface and is
   * called in response to events on the main area widget's node. It should
   * not be called directly by user code.
   */
  handleEvent(event: Event): void {
    switch (event.type) {
    case 'mouseup':
    case 'mouseout':
      let target = event.target as HTMLElement;
      if (this._isPopulated &&
          this.toolbar.node.contains(document.activeElement) &&
          target.tagName !== 'SELECT') {
        this._focusContent();
      }
      break;
    default:
      break;
    }
  }

  /**
   * Handle `after-attach` messages for the widget.
   */
  protected onAfterAttach(msg: Message): void {
    this.toolbar.node.addEventListener('mouseup', this);
    this.toolbar.node.addEventListener('mouseout', this);
  }

  /**
   * Handle `before-detach` messages for the widget.
   */
  protected onBeforeDetach(msg: Message): void {
    this.toolbar.node.removeEventListener('mouseup', this);
    this.toolbar.node.removeEventListener('mouseout', this);
  }

  /**
   * Handle `'activate-request'` messages.
   */
  protected onActivateRequest(msg: Message): void {
    if (this._isPopulated) {
      this._focusContent();
    } else {
      this._spinner.node.focus();
    }
  }

  /**
   * Handle `'close-request'` messages.
   */
  protected onCloseRequest(msg: Message): void {
    this.dispose();
  }

  /**
   * Update the title based on the attributes of the child widget.
   */
  private _updateTitle(): void {
    if (this._changeGuard) {
      return;
    }
    this._changeGuard = true;
    const content = this.content;
    this.title.label = content.title.label;
    this.title.mnemonic = content.title.mnemonic;
    this.title.iconClass = content.title.iconClass;
    this.title.iconLabel = content.title.iconLabel;
    this.title.caption = content.title.caption;
    this.title.className = content.title.className;
    this.title.dataset = content.title.dataset;
    this._changeGuard = false;
  }

  /**
   * Update the content title based on attributes of the main widget.
   */
  private _updateContentTitle(): void {
    if (this._changeGuard) {
      return;
    }
    this._changeGuard = true;
    const content = this.content;
    content.title.label = this.title.label;
    content.title.mnemonic = this.title.mnemonic;
    content.title.iconClass = this.title.iconClass;
    content.title.iconLabel = this.title.iconLabel;
    content.title.caption = this.title.caption;
    content.title.className = this.title.className;
    content.title.dataset = this.title.dataset;
    this._changeGuard = false;
  }

  /**
   * Give focus to the content.
   */
  private _focusContent(): void {
    if (!this.content.node.contains(document.activeElement)) {
      this.content.node.focus();
    }
    // Give the content a chance to activate.
    this.content.activate();
  }

  private _changeGuard = false;
  private _isPopulated = false;
  private _spinner = new Spinner();
}


/**
 * The namespace for the `MainAreaWidget` class statics.
 */
export
namespace MainAreaWidget {
  /**
   * An options object for creating a main area widget.
   */
  export
  interface IOptions<T extends Widget = Widget> extends Widget.IOptions {
    /**
     * The child widget to wrap.
     */
    content: T;

    /**
     * The toolbar to use for the widget.  Defaults to an empty toolbar.
     */
    toolbar?: Toolbar;

    /**
     * An optional promise for when the content is fully populated.
     */
    populated?: Promise<void>;
  }
}
