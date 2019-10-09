// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IObservableDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';
import { ServerConnection } from './serverconnection';

/**
 * Object which manages kernel instances for a given base url.
 *
 * #### Notes
 * The manager is responsible for maintaining the state of kernel specs.
 */
export interface IManager extends IObservableDisposable {
  /**
   * A signal emitted when there is a connection failure.
   * TODO: figure out the relationship between this and the other connection status signals for kernels.
   */
  connectionFailure: ISignal<IManager, ServerConnection.NetworkError>;

  /**
   * The server settings for the manager.
   */
  readonly serverSettings: ServerConnection.ISettings;

  /**
   * Whether the manager is ready.
   */
  readonly isReady: boolean;

  /**
   * A promise that resolves when the manager is initially ready.
   */
  readonly ready: Promise<void>;
}

export abstract class BaseManager implements IManager {
  constructor(options: BaseManager.IOptions) {
    this.serverSettings =
      options.serverSettings || ServerConnection.makeSettings();
  }
  /**
   * A signal emitted when the delegate is disposed.
   */
  get disposed(): ISignal<this, void> {
    return this._disposed;
  }

  /**
   * A signal emitted when there is a connection failure.
   */
  abstract connectionFailure: ISignal<this, Error>;

  /**
   * Test whether the delegate has been disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Test whether the manager is ready.
   */
  abstract isReady: boolean;

  /**
   * A promise that fulfills when the manager is ready.
   */
  abstract ready: Promise<void>;

  /**
   * Dispose of the delegate and invoke the callback function.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._disposed.emit(undefined);
    Signal.clearData(this);
  }

  /**
   * The server settings of the manager.
   */
  readonly serverSettings: ServerConnection.ISettings;

  private _isDisposed = false;
  private _disposed = new Signal<this, void>(this);
}

/**
 * The namespace for `BaseManager` class statics.
 */
export namespace BaseManager {
  /**
   * The options used to initialize a SessionManager.
   */
  export interface IOptions {
    /**
     * The server settings for the manager.
     */
    serverSettings?: ServerConnection.ISettings;
  }
}