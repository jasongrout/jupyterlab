// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Application
} from 'phosphide/lib/core/application';

import {
  DocumentRegistry
} from '../docregistry';

import {
  MapWidget, MapWidgetFactory
} from './widget';

/**
 * The list of file extensions for images.
 */
const EXTENSIONS = ['.geojson'];
import 'leaflet/dist/leaflet.css';

/**
 * The image file handler extension.
 */
export
const mapHandlerExtension = {
  id: 'jupyter.extensions.mapHandler',
  requires: [DocumentRegistry],
  activate: activateMapWidget
};


/**
 * Activate the image widget extension.
 */
function activateMapWidget(app: Application, registry: DocumentRegistry): void {
    let options = {
      fileExtensions: EXTENSIONS,
      displayName: 'Map',
      modelName: 'text',
      preferKernel: false,
      canStartKernel: false
    };

    registry.addWidgetFactory(new MapWidgetFactory(), options);

}
