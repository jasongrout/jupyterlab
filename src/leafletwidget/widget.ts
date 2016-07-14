// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  IKernel
} from 'jupyter-js-services';

import {
  Message
} from 'phosphor-messaging';

import {
  Widget
} from 'phosphor-widget';

import {
  ABCWidgetFactory, IDocumentModel, IDocumentContext
} from '../docregistry';


import leaflet = require('leaflet');

/**
 * The class name added to a imagewidget.
 */
const MAP_CLASS = 'jp-MapWidget';


/**
 * A widget for images.
 */
export
class MapWidget extends Widget {
  /**
   * Construct a new image widget.
   */
  constructor(context: IDocumentContext<IDocumentModel>) {
    super();
    this._context = context;
    this.node.tabIndex = -1;
    this.addClass(MAP_CLASS);

    if (context.model.toString()) {
      this.update();
    }
    context.pathChanged.connect(() => {
      this.update();
    });
    context.model.contentChanged.connect(() => {
      this.update();
    });
    context.contentsModelChanged.connect(() => {
      this.update();
    });
  }

  /**
   * Dispose of the resources used by the widget.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._context = null;
    super.dispose();
  }

  onAfterAttach() {
    this.update();
  }

  /**
   * Handle `update-request` messages for the widget.
   */
  protected onUpdateRequest(msg: Message): void {
    this.title.text = this._context.path.split('/').pop();
    let cm = this._context.contentsModel;
    if (cm === null) {
      return;
    }
    let content = JSON.parse(this._context.model.toString());
    var mymap = leaflet.map(this.node).setView([51.505, -0.09], 13);
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution : 'Map data (c) <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        min_zoom : 0,
        max_zoom : 18,
}).addTo(mymap);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

let geojsonLayer = leaflet.geoJson(content, {
    pointToLayer: function (feature, latlng) {
        return leaflet.circleMarker(latlng);
    }
}).addTo(mymap);
mymap.fitBounds((geojsonLayer as any).getBounds());
    //    var geojsonLayer: any = leaflet.geoJson(cm.content).addTo(mymap);
        //mymap.fitBounds(geojsonLayer['getBounds']());

    // let geojsonLayer = leaflet.geoJson(cm.content);
    // mymap.addLayer(geojsonLayer);
    // var jsonGroup = new leaflet.FeatureGroup(cm.content);
    // //mymap.fitBounds(jsonGroup.getBounds());
  }

  private _context: IDocumentContext<IDocumentModel>;
}


/**
 * A widget factory for images.
 */
export
class MapWidgetFactory extends ABCWidgetFactory<MapWidget, IDocumentModel> {
  /**
   * Create a new widget given a context.
   */
  createNew(context: IDocumentContext<IDocumentModel>, kernel?: IKernel.IModel): MapWidget {
    let widget = new MapWidget(context);
    this.widgetCreated.emit(widget);
    return widget;
  }
}
