// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Application
} from 'phosphide/lib/core/application';

import {
  DocumentRegistry
} from '../docregistry';

import {
  CSVWidget, CSVWidgetFactory
} from './widget';


/**
 * The list of file extensions for images.
 */
const EXTENSIONS = ['.csv'];


/**
 * The image file handler extension.
 */
export
const csvHandlerExtension = {
  id: 'jupyter.extensions.csvHandler',
  requires: [DocumentRegistry],
  activate: activateCSVWidget
};


/**
 * Activate the image widget extension.
 */
function activateCSVWidget(app: Application, registry: DocumentRegistry): void {
    let options = {
      fileExtensions: EXTENSIONS,
      displayName: 'Table',
      modelName: 'text',
      preferKernel: false,
      canStartKernel: false
    };

    registry.addWidgetFactory(new CSVWidgetFactory(), options);

}
