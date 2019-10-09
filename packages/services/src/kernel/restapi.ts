// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ServerConnection } from '../serverconnection';
import { Kernel } from './kernel';
import { URLExt } from '@jupyterlab/coreutils';
import { validateModel, validateModels } from './validate';

/**
 * The url for the kernel service.
 */
export const KERNEL_SERVICE_URL = 'api/kernels';

/**
 * Fetch the running kernels.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export async function listRunning(
  settings: ServerConnection.ISettings = ServerConnection.makeSettings()
): Promise<Kernel.IModel[]> {
  let url = URLExt.join(settings.baseUrl, KERNEL_SERVICE_URL);
  const response = await ServerConnection.makeRequest(url, {}, settings);
  if (response.status !== 200) {
    throw new ServerConnection.ResponseError(response);
  }
  const data = await response.json();
  validateModels(data);
  return data;
}

/**
 * Start a new kernel.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export async function startNew(
  options: Partial<Kernel.IModel>,
  settings: ServerConnection.ISettings = ServerConnection.makeSettings()
): Promise<Kernel.IModel> {
  let url = URLExt.join(settings.baseUrl, KERNEL_SERVICE_URL);
  let init = {
    method: 'POST',
    body: JSON.stringify({ name: options.name, env: options.env })
  };
  let response = await ServerConnection.makeRequest(url, init, settings);
  if (response.status !== 201) {
    throw new ServerConnection.ResponseError(response);
  }
  let data = await response.json();
  validateModel(data);
  return data;
}

/**
 * Restart a kernel.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export async function restartKernel(
  kernel: Kernel.IKernelConnection,
  settings?: ServerConnection.ISettings
): Promise<void> {
  if (kernel.status === 'dead') {
    throw new Error('Kernel is dead');
  }
  settings = settings || ServerConnection.makeSettings();
  let url = URLExt.join(
    settings.baseUrl,
    KERNEL_SERVICE_URL,
    encodeURIComponent(kernel.id),
    'restart'
  );
  let init = { method: 'POST' };

  let response = await ServerConnection.makeRequest(url, init, settings);
  if (response.status !== 200) {
    throw new ServerConnection.ResponseError(response);
  }
  let data = await response.json();
  validateModel(data);
}

/**
 * Interrupt a kernel.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export async function interruptKernel(
  kernel: Kernel.IKernelConnection,
  settings: ServerConnection.ISettings = ServerConnection.makeSettings()
): Promise<void> {
  if (kernel.status === 'dead') {
    throw new Error('Kernel is dead');
  }
  let url = URLExt.join(
    settings.baseUrl,
    KERNEL_SERVICE_URL,
    encodeURIComponent(kernel.id),
    'interrupt'
  );
  let init = { method: 'POST' };
  let response = await ServerConnection.makeRequest(url, init, settings);
  if (response.status !== 204) {
    throw new ServerConnection.ResponseError(response);
  }
}

/**
 * Delete a kernel.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export async function shutdownKernel(
  id: string,
  settings: ServerConnection.ISettings = ServerConnection.makeSettings()
): Promise<void> {
  let url = URLExt.join(
    settings.baseUrl,
    KERNEL_SERVICE_URL,
    encodeURIComponent(id)
  );
  let init = { method: 'DELETE' };
  let response = await ServerConnection.makeRequest(url, init, settings);
  if (response.status === 404) {
    let msg = `The kernel "${id}" does not exist on the server`;
    console.warn(msg);
  } else if (response.status !== 204) {
    throw new ServerConnection.ResponseError(response);
  }
}

/**
 * Get a full kernel model from the server by kernel id string.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export async function getKernelModel(
  id: string,
  settings: ServerConnection.ISettings = ServerConnection.makeSettings()
): Promise<Kernel.IModel | undefined> {
  settings = settings || ServerConnection.makeSettings();
  let url = URLExt.join(
    settings.baseUrl,
    KERNEL_SERVICE_URL,
    encodeURIComponent(id)
  );

  let response = await ServerConnection.makeRequest(url, {}, settings);
  if (response.status === 404) {
    return undefined;
  } else if (response.status !== 200) {
    throw new ServerConnection.ResponseError(response);
  }
  let data = await response.json();
  validateModel(data);
  return data;
}