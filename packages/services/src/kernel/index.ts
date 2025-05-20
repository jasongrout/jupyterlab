// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Namespace some of our modules for convenience and backwards compatibility.
import { CommsOverSubshells } from './comm.js';
import * as Kernel from './kernel.js';
import * as KernelMessage from './messages.js';
import * as KernelAPI from './restapi.js';
import { KernelConnection } from './default.js';

export * from './manager.js';
export {
  Kernel,
  KernelMessage,
  KernelAPI,
  KernelConnection,
  CommsOverSubshells
};
