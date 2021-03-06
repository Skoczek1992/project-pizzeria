/* global rangeSlider */
import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';
import {settings, select} from '../settings.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;

  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });

    rangeSlider.create(thisWidget.dom.input, {
      onSlide: function(value) {
        thisWidget.value = value;
      },
    });

  }


  parseValue(val) {
    const thisWidget = this;

    return utils.numberToHour(val);
  }

  inValue() {
    return true;
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerText = thisWidget.value;
  }
}

export default HourPicker;
