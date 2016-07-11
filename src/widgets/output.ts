// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView
} from 'jupyter-js-widgets';

import * as _ from 'underscore';

/**
 * Output widget:
 * 
 * Model has the msg_id to listen for. The *model*, on change of msg_id, registers a hook for that message id. The hook stores the output message in the model's message list with a unique id and returns false to halt other processing of that output message. The hook also maybe changes the 'current change' index???
 * 
 * The view is notified of changes to the output message queue (how?). Perhaps we finally use backbone collections? Perhaps we trigger a single update of the output index that changed/added (maybe -1 if the output was cleared?). The view the renders the appropriate output index and updates the widget appropriately.
 * 
 * OR the view is a wrapper around an OutputWidget, and just feeds it the list??
 * 
 * The *view* merely renders whatever output messages it sees. Should it use the output area widget, or just the output renderer??? My guess is just the output renderer. It tries to be smart about not rerendering output that it has already renderered.
 */


// how is the output model going to get a handle on the kernel?
// how is the view going to get a handle on the rendermime instance?
// how is the widget manager know to instantiate an output model/renderer with those particular options, 
// but not other widgets with similar options?
export
class OutputModel extends DOMWidgetModel {
  defaults() {
    return _.extend(super.defaults(), {
      _model_name: 'OutputModel',
      _view_name: 'OutputView',
      msg_id: '',
      messages: []
    });
  }
  initialize() {
    // on change of msg_id, remove the old message handler, clear the output, and register a new handler.
        this.listenTo(this, 'change:msg_id', this.reset_msg_id);
  }
  reset_msg_id() {
      this.clear_output();
      this.msg_hook.dispose();
      this.msg_hook = context.kernel.
  }

}

export
class OutputView extends DOMWidgetView {
  render() {
    /**
     * Called when view is rendered.
     */
    this.pWidget.addClass('jupyter-widgets');
    this.pWidget.addClass('widget-image');
    this.update(); // Set defaults.
  }

  update() {
    /**
     * Update the contents of this view
     *
     * Called when the model is changed.  The model may have been
     * changed by another view or by a state update from the back-end.
     */
    var image_src = 'data:image/' + this.model.get('format') + ';base64,' + this.model.get('_b64value');
    this.el.setAttribute('src', image_src);

    var width = this.model.get('width');
    if (width !== undefined && width.length > 0) {
      this.el.setAttribute('width', width);
    } else {
      this.el.removeAttribute('width');
    }

    var height = this.model.get('height');
    if (height !== undefined && height.length > 0) {
      this.el.setAttribute('height', height);
    } else {
      this.el.removeAttribute('height');
    }
    return super.update();
  }
}
