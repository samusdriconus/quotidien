/* vue-onsenui v2.4.3 - 2017-12-14 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('onsenui')) :
	typeof define === 'function' && define.amd ? define(['onsenui'], factory) :
	(global.VueOnsen = factory(global.ons));
}(this, (function (ons) { 'use strict';

ons = ons && ons.hasOwnProperty('default') ? ons['default'] : ons;

var setup = function (ons$$1) {
  return Object.keys(ons$$1).filter(function (k) {
    return [/^is/, /^disable/, /^enable/, /^mock/, /^open/, /^set/, /animit/, /elements/, /fastClick/, /GestureDetector/, /notification/, /orientation/, /platform/, /ready/].some(function (t) {
      return k.match(t);
    });
  }).reduce(function (r, k) {
    r[k] = ons$$1[k];
    return r;
  }, { _ons: ons$$1 });
};

var capitalize = function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var camelize = function camelize(string) {
  return string.toLowerCase().replace(/-([a-z])/g, function (m, l) {
    return l.toUpperCase();
  });
};

var eventToHandler = function eventToHandler(name) {
  return '_on' + capitalize(name);
};

var handlerToProp = function handlerToProp(name) {
  return name.slice(2).charAt(0).toLowerCase() + name.slice(2).slice(1);
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* Private */
var _setupDBB = function _setupDBB(component) {
  var dbb = 'onDeviceBackButton';
  // Call original handler or parent handler by default
  var handler = component[dbb] || component.$el[dbb] && component.$el[dbb]._callback || function (e) {
    return e.callParentHandler();
  };

  component.$el[dbb] = function (event) {
    var runDefault = true;

    component.$emit(handlerToProp(dbb), _extends({}, event, {
      preventDefault: function preventDefault() {
        return runDefault = false;
      }
    }));

    runDefault && handler(event);
  };

  component._isDBBSetup = true;
};

/* Public */
// Device Back Button Handler
var deriveDBB = {
  mounted: function mounted() {
    _setupDBB(this);
  },


  // Core destroys deviceBackButton handlers on disconnectedCallback.
  // This fixes the behavior for <keep-alive> component.
  activated: function activated() {
    this._isDBBSetup === false && _setupDBB(this);
  },
  deactivated: function deactivated() {
    this._isDBBSetup === true && (this._isDBBSetup = false);
  },
  destroyed: function destroyed() {
    this.$el.onDeviceBackButton && this.$el.onDeviceBackButton.destroy();
  }
};

var deriveEvents = {
  computed: {
    unrecognizedListeners: function unrecognizedListeners() {
      var _this = this;

      var name = camelize('-' + this.$options._componentTag.slice(6));
      return Object.keys(this.$listeners || {}).filter(function (k) {
        return (_this.$ons.elements[name].events || []).indexOf(k) === -1;
      }).reduce(function (r, k) {
        r[k] = _this.$listeners[k];
        return r;
      }, {});
    }
  },

  mounted: function mounted() {
    var _this2 = this;

    this._handlers = {};

    (this.$el.constructor.events || []).forEach(function (key) {
      _this2._handlers[eventToHandler(key)] = function (event) {
        // Filter events from different components with the same name
        if (event.target === _this2.$el || !/^ons-/i.test(event.target.tagName)) {
          _this2.$emit(key, event);
        }
      };
      _this2.$el.addEventListener(key, _this2._handlers[eventToHandler(key)]);
    });
  },
  beforeDestroy: function beforeDestroy() {
    var _this3 = this;

    Object.keys(this._handlers).forEach(function (key) {
      _this3.$el.removeEventListener(key, _this3._handlers[key]);
    });
    this._handlers = null;
  }
};

/* Private */
var _toggleVisibility = function _toggleVisibility() {
  if (typeof this.visible === 'boolean' && this.visible !== this.$el.visible) {
    this.$el[this.visible ? 'show' : 'hide'].call(this.$el, this.normalizedOptions || this.options);
  }
};
var _teleport = function _teleport() {
  if (!this._isDestroyed && (!this.$el.parentNode || this.$el.parentNode !== document.body)) {
    document.body.appendChild(this.$el);
  }
};
var _unmount = function _unmount() {
  var _this = this;

  if (this.$el.visible === true) {
    this.$el.hide().then(function () {
      return _this.$el.remove();
    });
  } else {
    this.$el.remove();
  }
};

/* Public */
// Components that can be shown or hidden
var hidable = {
  props: {
    visible: {
      type: Boolean,
      default: undefined // Avoid casting to false
    }
  },

  watch: {
    visible: function visible() {
      _toggleVisibility.call(this);
    }
  },

  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      return _toggleVisibility.call(_this2);
    });
  },
  activated: function activated() {
    var _this3 = this;

    this.$nextTick(function () {
      return _toggleVisibility.call(_this3);
    });
  }
};

// Components with 'options' property
var hasOptions = {
  props: {
    options: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
};

// Provides itself to its descendants
var selfProvider = {
  provide: function provide() {
    return defineProperty({}, this.$options._componentTag.slice(6), this);
  }
};

// Common event for Dialogs
var dialogCancel = {
  mounted: function mounted() {
    var _this4 = this;

    this.$on('dialog-cancel', function () {
      return _this4.$emit('update:visible', false);
    });
  }
};

// Moves the element to a global position
var portal = {
  mounted: function mounted() {
    _teleport.call(this);
  },
  updated: function updated() {
    _teleport.call(this);
  },
  activated: function activated() {
    _teleport.call(this);
  },
  deactivated: function deactivated() {
    _unmount.call(this);
  },
  beforeDestroy: function beforeDestroy() {
    _unmount.call(this);
  }
};

var _props;
var _props2;

/* Private */
var model = {
  prop: 'modelProp',
  event: 'modelEvent'
};

/* Public */

// Generic input
var modelInput = {
  model: model,
  props: (_props = {}, defineProperty(_props, model.prop, [Number, String]), defineProperty(_props, model.event, {
    type: String,
    default: 'input'
  }), _props),

  methods: {
    _updateValue: function _updateValue() {
      if (this[model.prop] !== undefined && this.$el.value !== this[model.prop]) {
        this.$el.value = this[model.prop];
      }
    },
    _onModelEvent: function _onModelEvent(event) {
      this.$emit(model.event, event.target.value);
    }
  },

  watch: defineProperty({}, model.prop, function () {
    this._updateValue();
  }),

  mounted: function mounted() {
    this._updateValue();
    this.$el.addEventListener(this[model.event], this._onModelEvent);
  },
  beforeDestroy: function beforeDestroy() {
    this.$el.removeEventListener(this[model.event], this._onModelEvent);
  }
};

// Checkable inputs
var modelCheckbox = {
  mixins: [modelInput],

  props: (_props2 = {}, defineProperty(_props2, model.prop, [Array, Boolean]), defineProperty(_props2, model.event, {
    type: String,
    default: 'change'
  }), _props2),

  methods: {
    _updateValue: function _updateValue() {
      if (this[model.prop] instanceof Array) {
        this.$el.checked = this[model.prop].indexOf(this.$el.value) >= 0;
      } else {
        this.$el.checked = this[model.prop];
      }
    },
    _onModelEvent: function _onModelEvent(event) {
      var _event$target = event.target,
          value = _event$target.value,
          checked = _event$target.checked;

      var newValue = void 0;

      if (this[model.prop] instanceof Array) {
        // Is Array
        var index = this[model.prop].indexOf(value);
        var included = index >= 0;

        if (included && !checked) {
          newValue = [].concat(toConsumableArray(this[model.prop].slice(0, index)), toConsumableArray(this[model.prop].slice(index + 1, this[model.prop].length)));
        }

        if (!included && checked) {
          newValue = [].concat(toConsumableArray(this[model.prop]), [value]);
        }
      } else {
        // Is Boolean
        newValue = checked;
      }

      // Emit if value changed
      newValue !== undefined && this.$emit(model.event, newValue);
    }
  }
};

// Radio input
var modelRadio = {
  mixins: [modelInput],
  props: defineProperty({}, model.event, {
    type: String,
    default: 'change'
  }),

  methods: {
    _updateValue: function _updateValue() {
      this.$el.checked = this[model.prop] === this.$el.value;
    },
    _onModelEvent: function _onModelEvent(event) {
      var _event$target2 = event.target,
          value = _event$target2.value,
          checked = _event$target2.checked;

      checked && this.$emit(model.event, value);
    }
  }
};

/* This file is generated automatically */
// 'ons-toolbar';
var VOnsToolbar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-toolbar', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-toolbar',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-bottom-toolbar';
var VOnsBottomToolbar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-bottom-toolbar', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-bottom-toolbar',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-toolbar-button';
var VOnsToolbarButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-toolbar-button', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-toolbar-button',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-alert-dialog-button';
var VOnsAlertDialogButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-alert-dialog-button', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-alert-dialog-button',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-button';
var VOnsButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-button', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-button',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-icon';
var VOnsIcon = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-icon', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-icon',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-card';
var VOnsCard = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-card', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-card',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-list';
var VOnsList = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-list-item';
var VOnsListItem = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list-item', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list-item',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-list-title';
var VOnsListTitle = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list-title', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list-title',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-list-header';
var VOnsListHeader = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-list-header', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-list-header',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-ripple';
var VOnsRipple = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-ripple', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-ripple',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-row';
var VOnsRow = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-row', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-row',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-col';
var VOnsCol = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-col', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-col',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-progress-bar';
var VOnsProgressBar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-progress-bar', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-progress-bar',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-progress-circular';
var VOnsProgressCircular = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-progress-circular', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-progress-circular',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-carousel-item';
var VOnsCarouselItem = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-carousel-item', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-carousel-item',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-splitter-mask';
var VOnsSplitterMask = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter-mask', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter-mask',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-splitter-content';
var VOnsSplitterContent = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter-content', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter-content',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-splitter';
var VOnsSplitter = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter',
  mixins: [deriveEvents, selfProvider, deriveDBB]
};

/* This file is generated automatically */
// 'ons-switch';
var VOnsSwitch = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-switch', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-switch',
  mixins: [deriveEvents, modelCheckbox]
};

/* This file is generated automatically */
// 'ons-checkbox';
var VOnsCheckbox = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-checkbox', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-checkbox',
  mixins: [deriveEvents, modelCheckbox]
};

/* This file is generated automatically */
// 'ons-input';
var VOnsInput = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-input', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-input',
  mixins: [deriveEvents, modelInput]
};

/* This file is generated automatically */
// 'ons-search-input';
var VOnsSearchInput = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-search-input', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-search-input',
  mixins: [deriveEvents, modelInput]
};

/* This file is generated automatically */
// 'ons-range';
var VOnsRange = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-range', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-range',
  mixins: [deriveEvents, modelInput]
};

/* This file is generated automatically */
// 'ons-radio';
var VOnsRadio = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-radio', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-radio',
  mixins: [deriveEvents, modelRadio]
};

/* This file is generated automatically */
// 'ons-fab';
var VOnsFab = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-fab', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-fab',
  mixins: [deriveEvents, hidable]
};

/* This file is generated automatically */
// 'ons-speed-dial-item';
var VOnsSpeedDialItem = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-speed-dial-item', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-speed-dial-item',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-dialog';
var VOnsDialog = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-dialog', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-dialog',
  mixins: [deriveEvents, hidable, hasOptions, dialogCancel, deriveDBB, portal]
};

/* This file is generated automatically */
// 'ons-action-sheet';
var VOnsActionSheet = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-action-sheet', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-action-sheet',
  mixins: [deriveEvents, hidable, hasOptions, dialogCancel, deriveDBB, portal]
};

/* This file is generated automatically */
// 'ons-action-sheet-button';
var VOnsActionSheetButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-action-sheet-button', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-action-sheet-button',
  mixins: [deriveEvents]
};

/* This file is generated automatically */
// 'ons-modal';
var VOnsModal = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-modal', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-modal',
  mixins: [deriveEvents, hidable, hasOptions, deriveDBB, portal]
};

/* This file is generated automatically */
// 'ons-toast';
var VOnsToast = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-toast', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-toast',
  mixins: [deriveEvents, hidable, hasOptions, deriveDBB, portal]
};

// 'ons-popover';
var VOnsPopover = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-popover', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-popover',
  mixins: [hidable, hasOptions, dialogCancel, deriveEvents, deriveDBB, portal],

  props: {
    target: {
      validator: function validator(value) {
        return value._isVue || typeof value === 'string' || value instanceof Event || value instanceof HTMLElement;
      }
    }
  },

  computed: {
    normalizedTarget: function normalizedTarget() {
      if (this.target && this.target._isVue) {
        return this.target.$el;
      }
      return this.target;
    },
    normalizedOptions: function normalizedOptions() {
      if (this.target) {
        return _extends({
          target: this.normalizedTarget
        }, this.options);
      }
      return this.options;
    }
  }
};

// 'ons-alert-dialog';
var VOnsAlertDialog = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-alert-dialog', _vm._g({}, _vm.unrecognizedListeners), [_c('div', { staticClass: "alert-dialog-title" }, [_vm._t("title", [_vm._v(_vm._s(_vm.title))])], 2), _vm._v(" "), _c('div', { staticClass: "alert-dialog-content" }, [_vm._t("default")], 2), _vm._v(" "), _c('div', { staticClass: "alert-dialog-footer" }, [_vm._t("footer", _vm._l(_vm.footer, function (handler, key) {
      return _c('ons-alert-dialog-button', { key: key, on: { "click": handler } }, [_vm._v(_vm._s(key))]);
    }))], 2)]);
  }, staticRenderFns: [],
  name: 'v-ons-alert-dialog',
  mixins: [hidable, hasOptions, dialogCancel, deriveEvents, deriveDBB, portal],

  props: {
    title: {
      type: String
    },
    footer: {
      type: Object,
      validator: function validator(value) {
        return Object.keys(value).every(function (key) {
          return value[key] instanceof Function;
        });
      }
    }
  }
};

// 'ons-speed-dial';
var VOnsSpeedDial = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-speed-dial', { domProps: { "onClick": _vm.action } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-speed-dial',
  mixins: [deriveEvents, hidable],

  props: {
    open: {
      type: Boolean,
      default: undefined
    }
  },

  methods: {
    action: function action() {
      var runDefault = true;
      this.$emit('click', { preventDefault: function preventDefault() {
          return runDefault = false;
        } });

      if (runDefault) {
        this.$el.toggleItems();
      }
    },
    _shouldUpdate: function _shouldUpdate() {
      return this.open !== undefined && this.open !== this.$el.isOpen();
    },
    _updateToggle: function _updateToggle() {
      this._shouldUpdate() && this.$el[this.open ? 'showItems' : 'hideItems'].call(this.$el);
    }
  },

  watch: {
    open: function open() {
      this._updateToggle();
    }
  },

  mounted: function mounted() {
    var _this = this;

    this.$on(['open', 'close'], function () {
      return _this._shouldUpdate() && _this.$emit('update:open', _this.$el.isOpen());
    });

    this._updateToggle();
  }
};

// 'ons-carousel';
var VOnsCarousel = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-carousel', _vm._g({ attrs: { "initial-index": _vm.index }, domProps: { "onSwipe": _vm.onSwipe }, on: { "postchange": function postchange($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm.$emit('update:index', $event.activeIndex);
        } } }, _vm.unrecognizedListeners), [_c('div', [_vm._t("default")], 2), _vm._v(" "), _c('div')]);
  }, staticRenderFns: [],
  name: 'v-ons-carousel',
  mixins: [hasOptions, deriveEvents],

  props: {
    index: {
      type: Number
    },
    onSwipe: {
      type: Function
    }
  },

  watch: {
    index: function index() {
      if (this.index !== this.$el.getActiveIndex()) {
        this.$el.setActiveIndex(this.index, this.options);
      }
    }
  }
};

// 'ons-tab';

var VOnsTab = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-tab', { attrs: { "active": _vm.active }, domProps: { "onClick": _vm.action } });
  }, staticRenderFns: [],
  name: 'v-ons-tab',
  inject: ['tabbar'],

  props: {
    page: {},
    props: {},
    active: {
      type: Boolean
    }
  },

  methods: {
    action: function action() {
      var runDefault = true;
      this.$emit('click', { preventDefault: function preventDefault() {
          return runDefault = false;
        } });

      if (runDefault) {
        this.tabbar.$el.setActiveTab(this.$el.index, _extends({ reject: false }, this.tabbar.options));
      }
    }
  },

  watch: {
    active: function active() {
      this.$el.setActive(this.active);
    }
  }
};

// 'ons-tabbar';
var VOnsTabbar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-tabbar', _vm._g({ attrs: { "activeIndex": _vm.index }, domProps: { "onSwipe": _vm.onSwipe }, on: { "prechange": function prechange($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm.$nextTick(function () {
            return !$event.detail.canceled && _vm.$emit('update:index', $event.index);
          });
        } } }, _vm.unrecognizedListeners), [_c('div', { staticClass: "tabbar__content" }, [_c('div', [_vm._t("pages", _vm._l(_vm.tabs, function (tab) {
      return _c(tab.page, _vm._g(_vm._b({ key: tab.page.key || tab.page.name || _vm._tabKey(tab), tag: "component" }, 'component', tab.props, false), _vm.unrecognizedListeners));
    }))], 2), _vm._v(" "), _c('div')]), _vm._v(" "), _c('div', { staticClass: "tabbar", style: _vm.tabbarStyle }, [_vm._t("default", _vm._l(_vm.tabs, function (tab) {
      return _c('v-ons-tab', _vm._b({ key: _vm._tabKey(tab) }, 'v-ons-tab', tab, false));
    })), _vm._v(" "), _c('div', { staticClass: "tabbar__border" })], 2)]);
  }, staticRenderFns: [],
  name: 'v-ons-tabbar',
  mixins: [deriveEvents, hasOptions, hidable, selfProvider],

  props: {
    index: {
      type: Number
    },
    tabs: {
      type: Array,
      validator: function validator(value) {
        return value.every(function (tab) {
          return ['icon', 'label', 'page'].some(function (prop) {
            return !!Object.getOwnPropertyDescriptor(tab, prop);
          });
        });
      }
    },
    onSwipe: {
      type: Function
    },
    tabbarStyle: {
      type: null
    }
  },

  methods: {
    _tabKey: function _tabKey(tab) {
      return tab.key || tab.label || tab.icon;
    }
  },

  watch: {
    index: function index() {
      if (this.index !== this.$el.getActiveTabIndex()) {
        this.$el.setActiveTab(this.index, _extends({ reject: false }, this.options));
      }
    }
  }
};

// 'ons-back-button';

var VOnsBackButton = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-back-button', { domProps: { "onClick": _vm.action } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-back-button',
  inject: ['navigator'],

  methods: {
    action: function action() {
      var runDefault = true;
      this.$emit('click', { preventDefault: function preventDefault() {
          return runDefault = false;
        } });

      if (runDefault && this.navigator.pageStack.length > 1) {
        this.navigator.popPage();
      }
    }
  }
};

// 'ons-navigator';
var VOnsNavigator = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-navigator', _vm._g({ on: { "postpop": function postpop($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm._checkSwipe($event);
        } } }, _vm.unrecognizedListeners), [_vm._t("default", _vm._l(_vm.pageStack, function (page) {
      return _c(page, _vm._g({ key: page.key || page.name, tag: "component" }, _vm.unrecognizedListeners));
    }))], 2);
  }, staticRenderFns: [],
  name: 'v-ons-navigator',
  mixins: [hasOptions, selfProvider, deriveEvents, deriveDBB],

  props: {
    pageStack: {
      type: Array,
      required: true
    },
    popPage: {
      type: Function,
      default: function _default() {
        this.pageStack.pop();
      }
    }
  },

  methods: {
    isReady: function isReady() {
      if (this.hasOwnProperty('_ready') && this._ready instanceof Promise) {
        return this._ready;
      }
      return Promise.resolve();
    },
    onDeviceBackButton: function onDeviceBackButton(event) {
      if (this.pageStack.length > 1) {
        this.popPage();
      } else {
        event.callParentHandler();
      }
    },
    _findScrollPage: function _findScrollPage(page) {
      var nextPage = page._contentElement.children.length === 1 && this.$ons._ons._util.getTopPage(page._contentElement.children[0]);
      return nextPage ? this._findScrollPage(nextPage) : page;
    },
    _setPagesVisibility: function _setPagesVisibility(start, end, visibility) {
      for (var i = start; i < end; i++) {
        this.$children[i].$el.style.visibility = visibility;
      }
    },
    _reattachPage: function _reattachPage(pageElement) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var restoreScroll = arguments[2];

      this.$el.insertBefore(pageElement, position);
      restoreScroll instanceof Function && restoreScroll();
      pageElement._isShown = true;
    },
    _redetachPage: function _redetachPage(pageElement) {
      pageElement._destroy();
      return Promise.resolve();
    },
    _animate: function _animate(_ref) {
      var _this = this;

      var lastLength = _ref.lastLength,
          currentLength = _ref.currentLength,
          lastTopPage = _ref.lastTopPage,
          currentTopPage = _ref.currentTopPage,
          restoreScroll = _ref.restoreScroll;


      // Push
      if (currentLength > lastLength) {
        var isReattached = false;
        if (lastTopPage.parentElement !== this.$el) {
          this._reattachPage(lastTopPage, this.$el.children[lastLength - 1], restoreScroll);
          isReattached = true;
          lastLength--;
        }
        this._setPagesVisibility(lastLength, currentLength, 'hidden');

        return this.$el._pushPage(_extends({}, this.options, { leavePage: lastTopPage })).then(function () {
          _this._setPagesVisibility(lastLength, currentLength, '');
          if (isReattached) {
            _this._redetachPage(lastTopPage);
          }
        });
      }

      // Pop
      if (currentLength < lastLength) {
        this._reattachPage(lastTopPage, null, restoreScroll);
        return this.$el._popPage(_extends({}, this.options), function () {
          return _this._redetachPage(lastTopPage);
        });
      }

      // Replace page
      currentTopPage.style.visibility = 'hidden';
      this._reattachPage(lastTopPage, currentTopPage, restoreScroll);
      return this.$el._pushPage(_extends({}, this.options, { _replacePage: true })).then(function () {
        return _this._redetachPage(lastTopPage);
      });
    },
    _checkSwipe: function _checkSwipe(event) {
      if (this.$el.hasAttribute('swipeable') && event.leavePage !== this.$el.lastChild && event.leavePage === this.$children[this.$children.length - 1].$el) {
        this.popPage();
      }
    }
  },

  watch: {
    pageStack: function pageStack(after, before) {
      if (this.$el.hasAttribute('swipeable') && this.$children.length !== this.$el.children.length) {
        return;
      }

      var propWasMutated = after === before; // Can be mutated or replaced
      var lastTopPage = this.$children[this.$children.length - 1].$el;
      var scrollElement = this._findScrollPage(lastTopPage);
      var scrollValue = scrollElement.scrollTop || 0;

      this._pageStackUpdate = {
        lastTopPage: lastTopPage,
        lastLength: propWasMutated ? this.$children.length : before.length,
        currentLength: !propWasMutated && after.length,
        restoreScroll: function restoreScroll() {
          return scrollElement.scrollTop = scrollValue;
        }
      };

      // this.$nextTick(() => { }); // Waits too long, updated() hook is faster and prevents flickerings
    }
  },

  updated: function updated() {
    if (this._pageStackUpdate) {
      var currentTopPage = this.$children[this.$children.length - 1].$el;
      var _pageStackUpdate = this._pageStackUpdate,
          lastTopPage = _pageStackUpdate.lastTopPage,
          currentLength = _pageStackUpdate.currentLength;
      var _pageStackUpdate2 = this._pageStackUpdate,
          lastLength = _pageStackUpdate2.lastLength,
          restoreScroll = _pageStackUpdate2.restoreScroll;

      currentLength = currentLength === false ? this.$children.length : currentLength;

      if (currentTopPage !== lastTopPage) {
        this._ready = this._animate({ lastLength: lastLength, currentLength: currentLength, lastTopPage: lastTopPage, currentTopPage: currentTopPage, restoreScroll: restoreScroll });
      } else if (currentLength !== lastLength) {
        currentTopPage.updateBackButton(currentLength > 1);
      }

      lastTopPage = currentTopPage = this._pageStackUpdate = null;
    }
  }
};

// 'ons-splitter-side';
var VOnsSplitterSide = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-splitter-side', _vm._g({}, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-splitter-side',
  mixins: [hasOptions, deriveEvents],

  props: {
    open: {
      type: Boolean,
      default: undefined
    }
  },

  methods: {
    action: function action() {
      this._shouldUpdate() && this.$el[this.open ? 'open' : 'close'].call(this.$el, this.options).catch(function () {});
    },
    _shouldUpdate: function _shouldUpdate() {
      return this.open !== undefined && this.open !== this.$el.isOpen;
    }
  },

  watch: {
    open: function open() {
      this.action();
    }
  },

  mounted: function mounted() {
    var _this = this;

    this.$on(['postopen', 'postclose', 'modechange'], function () {
      return _this._shouldUpdate() && _this.$emit('update:open', _this.$el.isOpen);
    });

    this.action();
  }
};

// 'ons-lazy-repeat';

var VOnsLazyRepeat = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-lazy-repeat');
  }, staticRenderFns: [],
  name: 'v-ons-lazy-repeat',

  props: {
    renderItem: {
      type: Function,
      required: true,
      validator: function validator(value) {
        var component = value(0);
        if (component._isVue && !component._isMounted) {
          component.$destroy();
          return true;
        }
        return false;
      }
    },
    length: {
      type: Number,
      required: true
    },
    calculateItemHeight: {
      type: Function,
      default: undefined
    }
  },

  data: function data() {
    return {
      provider: null
    };
  },


  methods: {
    _setup: function _setup() {
      var _this = this;

      this.provider && this.provider.destroy();

      var delegate = new this.$ons._ons._internal.LazyRepeatDelegate({
        calculateItemHeight: this.calculateItemHeight,
        createItemContent: function createItemContent(i) {
          return _this.renderItem(i).$mount().$el;
        },
        destroyItem: function destroyItem(i, _ref) {
          var element = _ref.element;
          return element.__vue__.$destroy();
        },
        countItems: function countItems() {
          return _this.length;
        }
      }, null);

      this.provider = new this.$ons._ons._internal.LazyRepeatProvider(this.$parent.$el, delegate);
    },
    refresh: function refresh() {
      return this.provider.refresh();
    }
  },

  watch: {
    renderItem: function renderItem() {
      this._setup();
    },
    length: function length() {
      this._setup();
    },
    calculateItemHeight: function calculateItemHeight() {
      this._setup();
    }
  },

  mounted: function mounted() {
    this._setup();
    this.$vnode.context.$on('refresh', this.refresh);
  },
  beforeDestroy: function beforeDestroy() {
    this.$vnode.context.$off('refresh', this.refresh);

    // This will destroy the provider once the rendered element
    // is detached (detachedCallback). Therefore, animations
    // have time to finish before elements start to disappear.
    // It cannot be set earlier in order to prevent accidental
    // destroys if this element is retached by something else.
    this.$el._lazyRepeatProvider = this.provider;
    this.provider = null;
  }
};

// 'ons-select';
var VOnsSelect = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-select', _vm._g({}, _vm.$listeners), [_c('select', [_vm._t("default")], 2)]);
  }, staticRenderFns: [],
  name: 'v-ons-select',
  mixins: [modelInput]
};

// 'ons-segment';
var VOnsSegment = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-segment', { attrs: { "active-index": _vm.index }, on: { "postchange": function postchange($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }_vm.$emit('update:index', $event.index);
        } } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-segment',
  mixins: [deriveEvents],

  props: {
    index: {
      type: Number
    }
  },

  watch: {
    index: function index() {
      if (this.index !== this.$el.getActiveButtonIndex()) {
        this.$el.setActiveButton(this.index, { reject: false });
      }
    }
  }
};

// 'ons-pull-hook';
var VOnsPullHook = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-pull-hook', _vm._g({ domProps: { "onAction": _vm.action, "onPull": _vm.onPull } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-pull-hook',
  mixins: [deriveEvents],

  props: {
    action: {
      type: Function
    },
    onPull: {
      type: Function
    }
  }
};

// 'ons-page';
var VOnsPage = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ons-page', _vm._g({ domProps: { "onInfiniteScroll": _vm.infiniteScroll } }, _vm.unrecognizedListeners), [_vm._t("default")], 2);
  }, staticRenderFns: [],
  name: 'v-ons-page',
  mixins: [deriveEvents, deriveDBB],

  props: {
    infiniteScroll: {
      type: Function
    }
  }
};

// Generic components:


var components = Object.freeze({
	VOnsToolbar: VOnsToolbar,
	VOnsBottomToolbar: VOnsBottomToolbar,
	VOnsToolbarButton: VOnsToolbarButton,
	VOnsAlertDialogButton: VOnsAlertDialogButton,
	VOnsButton: VOnsButton,
	VOnsIcon: VOnsIcon,
	VOnsCard: VOnsCard,
	VOnsList: VOnsList,
	VOnsListItem: VOnsListItem,
	VOnsListTitle: VOnsListTitle,
	VOnsListHeader: VOnsListHeader,
	VOnsRipple: VOnsRipple,
	VOnsRow: VOnsRow,
	VOnsCol: VOnsCol,
	VOnsProgressBar: VOnsProgressBar,
	VOnsProgressCircular: VOnsProgressCircular,
	VOnsCarouselItem: VOnsCarouselItem,
	VOnsSplitterMask: VOnsSplitterMask,
	VOnsSplitterContent: VOnsSplitterContent,
	VOnsSplitter: VOnsSplitter,
	VOnsSwitch: VOnsSwitch,
	VOnsCheckbox: VOnsCheckbox,
	VOnsInput: VOnsInput,
	VOnsSearchInput: VOnsSearchInput,
	VOnsRange: VOnsRange,
	VOnsRadio: VOnsRadio,
	VOnsFab: VOnsFab,
	VOnsSpeedDialItem: VOnsSpeedDialItem,
	VOnsDialog: VOnsDialog,
	VOnsActionSheet: VOnsActionSheet,
	VOnsActionSheetButton: VOnsActionSheetButton,
	VOnsModal: VOnsModal,
	VOnsToast: VOnsToast,
	VOnsPopover: VOnsPopover,
	VOnsAlertDialog: VOnsAlertDialog,
	VOnsSpeedDial: VOnsSpeedDial,
	VOnsCarousel: VOnsCarousel,
	VOnsTab: VOnsTab,
	VOnsTabbar: VOnsTabbar,
	VOnsBackButton: VOnsBackButton,
	VOnsNavigator: VOnsNavigator,
	VOnsSplitterSide: VOnsSplitterSide,
	VOnsLazyRepeat: VOnsLazyRepeat,
	VOnsSelect: VOnsSelect,
	VOnsSegment: VOnsSegment,
	VOnsPullHook: VOnsPullHook,
	VOnsPage: VOnsPage
});

var $ons = setup(ons);

$ons.install = function (Vue) {
  Object.keys(components).forEach(function (key) {
    return Vue.component(components[key].name, components[key]);
  });

  /**
   * Expose ons object.
   */
  Vue.prototype.$ons = $ons;
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use({ install: $ons.install });
}

return $ons;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLW9uc2VudWkuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC5qcyIsIi4uL3NyYy9pbnRlcm5hbC91dGlsLmpzIiwiLi4vc3JjL21peGlucy9kZXJpdmUuanMiLCIuLi9zcmMvbWl4aW5zL2NvbW1vbi5qcyIsIi4uL3NyYy9taXhpbnMvbW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zVG9vbGJhci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zQm90dG9tVG9vbGJhci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zVG9vbGJhckJ1dHRvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zQWxlcnREaWFsb2dCdXR0b24udnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0J1dHRvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zSWNvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zQ2FyZC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTGlzdC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTGlzdEl0ZW0udnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0xpc3RUaXRsZS52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTGlzdEhlYWRlci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zUmlwcGxlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNSb3cudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0NvbC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zUHJvZ3Jlc3NCYXIudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1Byb2dyZXNzQ2lyY3VsYXIudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0Nhcm91c2VsSXRlbS52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU3BsaXR0ZXJNYXNrLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTcGxpdHRlckNvbnRlbnQudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1NwbGl0dGVyLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTd2l0Y2gudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0NoZWNrYm94LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNJbnB1dC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU2VhcmNoSW5wdXQudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1JhbmdlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNSYWRpby52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zRmFiLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTcGVlZERpYWxJdGVtLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNEaWFsb2cudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0FjdGlvblNoZWV0LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNBY3Rpb25TaGVldEJ1dHRvbi52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zTW9kYWwudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1RvYXN0LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNQb3BvdmVyLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNBbGVydERpYWxvZy52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU3BlZWREaWFsLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNDYXJvdXNlbC52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zVGFiLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNUYWJiYXIudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc0JhY2tCdXR0b24udnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc05hdmlnYXRvci52dWUiLCIuLi9zcmMvY29tcG9uZW50cy9WT25zU3BsaXR0ZXJTaWRlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNMYXp5UmVwZWF0LnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNTZWxlY3QudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1NlZ21lbnQudnVlIiwiLi4vc3JjL2NvbXBvbmVudHMvVk9uc1B1bGxIb29rLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL1ZPbnNQYWdlLnZ1ZSIsIi4uL3NyYy9jb21wb25lbnRzL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4LnVtZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvbnMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9ucylcbiAgICAuZmlsdGVyKGsgPT4gW1xuICAgICAgL15pcy8sXG4gICAgICAvXmRpc2FibGUvLFxuICAgICAgL15lbmFibGUvLFxuICAgICAgL15tb2NrLyxcbiAgICAgIC9eb3Blbi8sXG4gICAgICAvXnNldC8sXG4gICAgICAvYW5pbWl0LyxcbiAgICAgIC9lbGVtZW50cy8sXG4gICAgICAvZmFzdENsaWNrLyxcbiAgICAgIC9HZXN0dXJlRGV0ZWN0b3IvLFxuICAgICAgL25vdGlmaWNhdGlvbi8sXG4gICAgICAvb3JpZW50YXRpb24vLFxuICAgICAgL3BsYXRmb3JtLyxcbiAgICAgIC9yZWFkeS8sXG4gICAgXS5zb21lKHQgPT4gay5tYXRjaCh0KSkpXG4gICAgLnJlZHVjZSgociwgaykgPT4ge1xuICAgICAgcltrXSA9IG9uc1trXTtcbiAgICAgIHJldHVybiByO1xuICAgIH0sIHsgX29uczogb25zIH0pO1xufVxuIiwiZXhwb3J0IGNvbnN0IGh5cGhlbmF0ZSA9IHN0cmluZyA9PiBzdHJpbmcucmVwbGFjZSgvKFthLXpBLVpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcblxuZXhwb3J0IGNvbnN0IGNhcGl0YWxpemUgPSBzdHJpbmcgPT4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xuXG5leHBvcnQgY29uc3QgY2FtZWxpemUgPSBzdHJpbmcgPT4gc3RyaW5nLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShbYS16XSkvZywgKG0sIGwpID0+IGwudG9VcHBlckNhc2UoKSk7XG5cbmV4cG9ydCBjb25zdCBldmVudFRvSGFuZGxlciA9IG5hbWUgPT4gJ19vbicgKyBjYXBpdGFsaXplKG5hbWUpO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlclRvUHJvcCA9IG5hbWUgPT4gbmFtZS5zbGljZSgyKS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIG5hbWUuc2xpY2UoMikuc2xpY2UoMSk7XG4iLCJpbXBvcnQgeyBjYW1lbGl6ZSwgZXZlbnRUb0hhbmRsZXIsIGhhbmRsZXJUb1Byb3AgfSBmcm9tICcuLi9pbnRlcm5hbC91dGlsJztcblxuLyogUHJpdmF0ZSAqL1xuY29uc3QgX3NldHVwREJCID0gY29tcG9uZW50ID0+IHtcbiAgY29uc3QgZGJiID0gJ29uRGV2aWNlQmFja0J1dHRvbic7XG4gIC8vIENhbGwgb3JpZ2luYWwgaGFuZGxlciBvciBwYXJlbnQgaGFuZGxlciBieSBkZWZhdWx0XG4gIGNvbnN0IGhhbmRsZXIgPSBjb21wb25lbnRbZGJiXSB8fCAoY29tcG9uZW50LiRlbFtkYmJdICYmIGNvbXBvbmVudC4kZWxbZGJiXS5fY2FsbGJhY2spIHx8IChlID0+IGUuY2FsbFBhcmVudEhhbmRsZXIoKSk7XG5cbiAgY29tcG9uZW50LiRlbFtkYmJdID0gZXZlbnQgPT4ge1xuICAgIGxldCBydW5EZWZhdWx0ID0gdHJ1ZTtcblxuICAgIGNvbXBvbmVudC4kZW1pdChoYW5kbGVyVG9Qcm9wKGRiYiksIHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgcHJldmVudERlZmF1bHQ6ICgpID0+IHJ1bkRlZmF1bHQgPSBmYWxzZVxuICAgIH0pO1xuXG4gICAgcnVuRGVmYXVsdCAmJiBoYW5kbGVyKGV2ZW50KTtcbiAgfTtcblxuICBjb21wb25lbnQuX2lzREJCU2V0dXAgPSB0cnVlO1xufTtcblxuLyogUHVibGljICovXG4vLyBEZXZpY2UgQmFjayBCdXR0b24gSGFuZGxlclxuY29uc3QgZGVyaXZlREJCID0ge1xuICBtb3VudGVkKCkge1xuICAgIF9zZXR1cERCQih0aGlzKTtcbiAgfSxcblxuICAvLyBDb3JlIGRlc3Ryb3lzIGRldmljZUJhY2tCdXR0b24gaGFuZGxlcnMgb24gZGlzY29ubmVjdGVkQ2FsbGJhY2suXG4gIC8vIFRoaXMgZml4ZXMgdGhlIGJlaGF2aW9yIGZvciA8a2VlcC1hbGl2ZT4gY29tcG9uZW50LlxuICBhY3RpdmF0ZWQoKSB7XG4gICAgdGhpcy5faXNEQkJTZXR1cCA9PT0gZmFsc2UgJiYgX3NldHVwREJCKHRoaXMpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGVkKCkge1xuICAgIHRoaXMuX2lzREJCU2V0dXAgPT09IHRydWUgJiYgKHRoaXMuX2lzREJCU2V0dXAgPSBmYWxzZSk7XG4gIH0sXG5cbiAgZGVzdHJveWVkKCkge1xuICAgIHRoaXMuJGVsLm9uRGV2aWNlQmFja0J1dHRvbiAmJiB0aGlzLiRlbC5vbkRldmljZUJhY2tCdXR0b24uZGVzdHJveSgpO1xuICB9XG59O1xuXG5jb25zdCBkZXJpdmVFdmVudHMgPSB7XG4gIGNvbXB1dGVkOiB7XG4gICAgdW5yZWNvZ25pemVkTGlzdGVuZXJzKCkge1xuICAgICAgY29uc3QgbmFtZSA9IGNhbWVsaXplKCctJyArIHRoaXMuJG9wdGlvbnMuX2NvbXBvbmVudFRhZy5zbGljZSg2KSk7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy4kbGlzdGVuZXJzIHx8IHt9KVxuICAgICAgICAuZmlsdGVyKGsgPT4gKHRoaXMuJG9ucy5lbGVtZW50c1tuYW1lXS5ldmVudHMgfHwgW10pLmluZGV4T2YoaykgPT09IC0xKVxuICAgICAgICAucmVkdWNlKChyLCBrKSA9PiB7XG4gICAgICAgICAgcltrXSA9IHRoaXMuJGxpc3RlbmVyc1trXTtcbiAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSwge30pO1xuICAgIH1cbiAgfSxcblxuICBtb3VudGVkKCkge1xuICAgIHRoaXMuX2hhbmRsZXJzID0ge307XG5cbiAgICAodGhpcy4kZWwuY29uc3RydWN0b3IuZXZlbnRzIHx8IFtdKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB0aGlzLl9oYW5kbGVyc1tldmVudFRvSGFuZGxlcihrZXkpXSA9IGV2ZW50ID0+IHtcbiAgICAgICAgLy8gRmlsdGVyIGV2ZW50cyBmcm9tIGRpZmZlcmVudCBjb21wb25lbnRzIHdpdGggdGhlIHNhbWUgbmFtZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLiRlbCB8fCAhL15vbnMtL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkpIHtcbiAgICAgICAgICB0aGlzLiRlbWl0KGtleSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcihrZXksIHRoaXMuX2hhbmRsZXJzW2V2ZW50VG9IYW5kbGVyKGtleSldKTtcbiAgICB9KTtcbiAgfSxcblxuICBiZWZvcmVEZXN0cm95KCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX2hhbmRsZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKGtleSwgdGhpcy5faGFuZGxlcnNba2V5XSk7XG4gICAgfSk7XG4gICAgdGhpcy5faGFuZGxlcnMgPSBudWxsO1xuICB9XG59O1xuXG5leHBvcnQgeyBkZXJpdmVEQkIsIGRlcml2ZUV2ZW50cyB9O1xuIiwiLyogUHJpdmF0ZSAqL1xuY29uc3QgX3RvZ2dsZVZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHR5cGVvZiB0aGlzLnZpc2libGUgPT09ICdib29sZWFuJyAmJiB0aGlzLnZpc2libGUgIT09IHRoaXMuJGVsLnZpc2libGUpIHtcbiAgICB0aGlzLiRlbFt0aGlzLnZpc2libGUgPyAnc2hvdycgOiAnaGlkZSddLmNhbGwodGhpcy4kZWwsIHRoaXMubm9ybWFsaXplZE9wdGlvbnMgfHwgdGhpcy5vcHRpb25zKTtcbiAgfVxufTtcbmNvbnN0IF90ZWxlcG9ydCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuX2lzRGVzdHJveWVkICYmICghdGhpcy4kZWwucGFyZW50Tm9kZSB8fCB0aGlzLiRlbC5wYXJlbnROb2RlICE9PSBkb2N1bWVudC5ib2R5KSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy4kZWwpO1xuICB9XG59O1xuY29uc3QgX3VubW91bnQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuJGVsLnZpc2libGUgPT09IHRydWUpIHtcbiAgICB0aGlzLiRlbC5oaWRlKCkudGhlbigoKSA9PiB0aGlzLiRlbC5yZW1vdmUoKSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gIH1cbn07XG5cbi8qIFB1YmxpYyAqL1xuLy8gQ29tcG9uZW50cyB0aGF0IGNhbiBiZSBzaG93biBvciBoaWRkZW5cbmNvbnN0IGhpZGFibGUgPSB7XG4gIHByb3BzOiB7XG4gICAgdmlzaWJsZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCAvLyBBdm9pZCBjYXN0aW5nIHRvIGZhbHNlXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgdmlzaWJsZSgpIHtcbiAgICAgIF90b2dnbGVWaXNpYmlsaXR5LmNhbGwodGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gX3RvZ2dsZVZpc2liaWxpdHkuY2FsbCh0aGlzKSk7XG4gIH0sXG5cbiAgYWN0aXZhdGVkKCkge1xuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IF90b2dnbGVWaXNpYmlsaXR5LmNhbGwodGhpcykpO1xuICB9XG59O1xuXG4vLyBDb21wb25lbnRzIHdpdGggJ29wdGlvbnMnIHByb3BlcnR5XG5jb25zdCBoYXNPcHRpb25zID0ge1xuICBwcm9wczoge1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgIGRlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8vIFByb3ZpZGVzIGl0c2VsZiB0byBpdHMgZGVzY2VuZGFudHNcbmNvbnN0IHNlbGZQcm92aWRlciA9IHtcbiAgcHJvdmlkZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW3RoaXMuJG9wdGlvbnMuX2NvbXBvbmVudFRhZy5zbGljZSg2KV06IHRoaXNcbiAgICB9XG4gIH1cbn07XG5cbi8vIENvbW1vbiBldmVudCBmb3IgRGlhbG9nc1xuY29uc3QgZGlhbG9nQ2FuY2VsID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuJG9uKCdkaWFsb2ctY2FuY2VsJywgKCkgPT4gdGhpcy4kZW1pdCgndXBkYXRlOnZpc2libGUnLCBmYWxzZSkpO1xuICB9XG59O1xuXG4vLyBNb3ZlcyB0aGUgZWxlbWVudCB0byBhIGdsb2JhbCBwb3NpdGlvblxuY29uc3QgcG9ydGFsID0ge1xuICBtb3VudGVkKCkge1xuICAgIF90ZWxlcG9ydC5jYWxsKHRoaXMpO1xuICB9LFxuICB1cGRhdGVkKCkge1xuICAgIF90ZWxlcG9ydC5jYWxsKHRoaXMpO1xuICB9LFxuICBhY3RpdmF0ZWQoKSB7XG4gICAgX3RlbGVwb3J0LmNhbGwodGhpcyk7XG4gIH0sXG4gIGRlYWN0aXZhdGVkKCkge1xuICAgIF91bm1vdW50LmNhbGwodGhpcyk7XG4gIH0sXG4gIGJlZm9yZURlc3Ryb3koKSB7XG4gICAgX3VubW91bnQuY2FsbCh0aGlzKTtcbiAgfVxufTtcblxuZXhwb3J0IHsgaGlkYWJsZSwgaGFzT3B0aW9ucywgc2VsZlByb3ZpZGVyLCBkaWFsb2dDYW5jZWwsIHBvcnRhbCB9O1xuIiwiLyogUHJpdmF0ZSAqL1xuY29uc3QgbW9kZWwgPSB7XG4gIHByb3A6ICdtb2RlbFByb3AnLFxuICBldmVudDogJ21vZGVsRXZlbnQnXG59O1xuXG4vKiBQdWJsaWMgKi9cblxuLy8gR2VuZXJpYyBpbnB1dFxuY29uc3QgbW9kZWxJbnB1dCA9IHtcbiAgbW9kZWwsXG4gIHByb3BzOiB7XG4gICAgW21vZGVsLnByb3BdOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgIFttb2RlbC5ldmVudF06IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdpbnB1dCdcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIF91cGRhdGVWYWx1ZSgpIHtcbiAgICAgIGlmICh0aGlzW21vZGVsLnByb3BdICE9PSB1bmRlZmluZWQgJiYgdGhpcy4kZWwudmFsdWUgIT09IHRoaXNbbW9kZWwucHJvcF0pIHtcbiAgICAgICAgdGhpcy4kZWwudmFsdWUgPSB0aGlzW21vZGVsLnByb3BdO1xuICAgICAgfVxuICAgIH0sXG4gICAgX29uTW9kZWxFdmVudChldmVudCkge1xuICAgICAgdGhpcy4kZW1pdChtb2RlbC5ldmVudCwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBbbW9kZWwucHJvcF0oKSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuICAgIH1cbiAgfSxcblxuICBtb3VudGVkKCkge1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzW21vZGVsLmV2ZW50XSwgdGhpcy5fb25Nb2RlbEV2ZW50KTtcbiAgfSxcbiAgYmVmb3JlRGVzdHJveSgpIHtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXNbbW9kZWwuZXZlbnRdLCB0aGlzLl9vbk1vZGVsRXZlbnQpO1xuICB9XG59O1xuXG4vLyBDaGVja2FibGUgaW5wdXRzXG5jb25zdCBtb2RlbENoZWNrYm94ID0ge1xuICBtaXhpbnM6IFttb2RlbElucHV0XSxcblxuICBwcm9wczoge1xuICAgIFttb2RlbC5wcm9wXTogW0FycmF5LCBCb29sZWFuXSxcbiAgICBbbW9kZWwuZXZlbnRdOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnY2hhbmdlJ1xuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgX3VwZGF0ZVZhbHVlKCkge1xuICAgICAgaWYgKHRoaXNbbW9kZWwucHJvcF0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLiRlbC5jaGVja2VkID0gdGhpc1ttb2RlbC5wcm9wXS5pbmRleE9mKHRoaXMuJGVsLnZhbHVlKSA+PSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuY2hlY2tlZCA9IHRoaXNbbW9kZWwucHJvcF07XG4gICAgICB9XG4gICAgfSxcbiAgICBfb25Nb2RlbEV2ZW50KGV2ZW50KSB7XG4gICAgICBjb25zdCB7IHZhbHVlLCBjaGVja2VkIH0gPSBldmVudC50YXJnZXQ7XG4gICAgICBsZXQgbmV3VmFsdWU7XG5cbiAgICAgIGlmICh0aGlzW21vZGVsLnByb3BdIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgLy8gSXMgQXJyYXlcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzW21vZGVsLnByb3BdLmluZGV4T2YodmFsdWUpO1xuICAgICAgICBjb25zdCBpbmNsdWRlZCA9IGluZGV4ID49IDA7XG5cbiAgICAgICAgaWYgKGluY2x1ZGVkICYmICFjaGVja2VkKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBbXG4gICAgICAgICAgICAuLi50aGlzW21vZGVsLnByb3BdLnNsaWNlKDAsIGluZGV4KSxcbiAgICAgICAgICAgIC4uLnRoaXNbbW9kZWwucHJvcF0uc2xpY2UoaW5kZXggKyAxLCB0aGlzW21vZGVsLnByb3BdLmxlbmd0aClcbiAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbmNsdWRlZCAmJiBjaGVja2VkKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBbIC4uLnRoaXNbbW9kZWwucHJvcF0sIHZhbHVlIF07XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSXMgQm9vbGVhblxuICAgICAgICBuZXdWYWx1ZSA9IGNoZWNrZWQ7XG4gICAgICB9XG5cbiAgICAgIC8vIEVtaXQgaWYgdmFsdWUgY2hhbmdlZFxuICAgICAgbmV3VmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLiRlbWl0KG1vZGVsLmV2ZW50LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBSYWRpbyBpbnB1dFxuY29uc3QgbW9kZWxSYWRpbyA9IHtcbiAgbWl4aW5zOiBbbW9kZWxJbnB1dF0sXG4gIHByb3BzOiB7XG4gICAgW21vZGVsLmV2ZW50XToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2NoYW5nZSdcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIF91cGRhdGVWYWx1ZSgpIHtcbiAgICAgIHRoaXMuJGVsLmNoZWNrZWQgPSB0aGlzW21vZGVsLnByb3BdID09PSB0aGlzLiRlbC52YWx1ZTtcbiAgICB9LFxuICAgIF9vbk1vZGVsRXZlbnQoZXZlbnQpIHtcbiAgICAgIGNvbnN0IHsgdmFsdWUsIGNoZWNrZWQgfSA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGNoZWNrZWQgJiYgdGhpcy4kZW1pdChtb2RlbC5ldmVudCwgdmFsdWUpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHsgbW9kZWxJbnB1dCwgbW9kZWxDaGVja2JveCwgbW9kZWxSYWRpbyB9O1xuXG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtdG9vbGJhciB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy10b29sYmFyPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXRvb2xiYXInO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtdG9vbGJhcicsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWJvdHRvbS10b29sYmFyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWJvdHRvbS10b29sYmFyPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWJvdHRvbS10b29sYmFyJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWJvdHRvbS10b29sYmFyJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtdG9vbGJhci1idXR0b24gdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtdG9vbGJhci1idXR0b24+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtdG9vbGJhci1idXR0b24nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtdG9vbGJhci1idXR0b24nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1hbGVydC1kaWFsb2ctYnV0dG9uIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWFsZXJ0LWRpYWxvZy1idXR0b24+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtYWxlcnQtZGlhbG9nLWJ1dHRvbic7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1hbGVydC1kaWFsb2ctYnV0dG9uJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtYnV0dG9uIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWJ1dHRvbj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1idXR0b24nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtYnV0dG9uJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtaWNvbiB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1pY29uPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWljb24nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtaWNvbicsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWNhcmQgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtY2FyZD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1jYXJkJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWNhcmQnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1saXN0IHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWxpc3Q+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtbGlzdCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1saXN0JyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtbGlzdC1pdGVtIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWxpc3QtaXRlbT5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1saXN0LWl0ZW0nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtbGlzdC1pdGVtJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtbGlzdC10aXRsZSB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1saXN0LXRpdGxlPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWxpc3QtdGl0bGUnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtbGlzdC10aXRsZScsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLWxpc3QtaGVhZGVyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWxpc3QtaGVhZGVyPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWxpc3QtaGVhZGVyJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLWxpc3QtaGVhZGVyJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcmlwcGxlIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXJpcHBsZT5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1yaXBwbGUnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtcmlwcGxlJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcm93IHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXJvdz5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1yb3cnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtcm93JyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtY29sIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWNvbD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1jb2wnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtY29sJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcHJvZ3Jlc3MtYmFyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXByb2dyZXNzLWJhcj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1wcm9ncmVzcy1iYXInO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtcHJvZ3Jlc3MtYmFyJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcHJvZ3Jlc3MtY2lyY3VsYXIgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtcHJvZ3Jlc3MtY2lyY3VsYXI+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtcHJvZ3Jlc3MtY2lyY3VsYXInO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtcHJvZ3Jlc3MtY2lyY3VsYXInLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1jYXJvdXNlbC1pdGVtIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWNhcm91c2VsLWl0ZW0+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtY2Fyb3VzZWwtaXRlbSc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1jYXJvdXNlbC1pdGVtJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtc3BsaXR0ZXItbWFzayB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1zcGxpdHRlci1tYXNrPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNwbGl0dGVyLW1hc2snO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtc3BsaXR0ZXItbWFzaycsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXNwbGl0dGVyLWNvbnRlbnQgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtc3BsaXR0ZXItY29udGVudD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zcGxpdHRlci1jb250ZW50JztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNwbGl0dGVyLWNvbnRlbnQnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zcGxpdHRlciB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1zcGxpdHRlcj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zcGxpdHRlcic7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgc2VsZlByb3ZpZGVyLCBkZXJpdmVEQkIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtc3BsaXR0ZXInLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgc2VsZlByb3ZpZGVyLCBkZXJpdmVEQkJdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtc3dpdGNoIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXN3aXRjaD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zd2l0Y2gnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGVsQ2hlY2tib3ggfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtc3dpdGNoJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGVsQ2hlY2tib3hdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtY2hlY2tib3ggdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtY2hlY2tib3g+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtY2hlY2tib3gnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGVsQ2hlY2tib3ggfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtY2hlY2tib3gnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kZWxDaGVja2JveF1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1pbnB1dCB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1pbnB1dD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIC8qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYXV0b21hdGljYWxseSAqL1xuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1pbnB1dCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgbW9kZWxJbnB1dCB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1pbnB1dCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBtb2RlbElucHV0XVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXNlYXJjaC1pbnB1dCB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1zZWFyY2gtaW5wdXQ+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtc2VhcmNoLWlucHV0JztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RlbElucHV0IH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNlYXJjaC1pbnB1dCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBtb2RlbElucHV0XVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXJhbmdlIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXJhbmdlPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXJhbmdlJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBtb2RlbElucHV0IH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXJhbmdlJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIG1vZGVsSW5wdXRdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcmFkaW8gdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtcmFkaW8+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtcmFkaW8nO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIG1vZGVsUmFkaW8gfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtcmFkaW8nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgbW9kZWxSYWRpb11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1mYWIgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtZmFiPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWZhYic7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgaGlkYWJsZSB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1mYWInLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgaGlkYWJsZV1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1zcGVlZC1kaWFsLWl0ZW0gdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtc3BlZWQtZGlhbC1pdGVtPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNwZWVkLWRpYWwtaXRlbSc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1zcGVlZC1kaWFsLWl0ZW0nLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c11cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1kaWFsb2cgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtZGlhbG9nPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWRpYWxvZyc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGlhbG9nQ2FuY2VsLCBkZXJpdmVEQkIsIHBvcnRhbCB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1kaWFsb2cnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGlhbG9nQ2FuY2VsLCBkZXJpdmVEQkIsIHBvcnRhbF1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1hY3Rpb24tc2hlZXQgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtYWN0aW9uLXNoZWV0PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWFjdGlvbi1zaGVldCc7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cywgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGlhbG9nQ2FuY2VsLCBkZXJpdmVEQkIsIHBvcnRhbCB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1hY3Rpb24tc2hlZXQnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGlhbG9nQ2FuY2VsLCBkZXJpdmVEQkIsIHBvcnRhbF1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1hY3Rpb24tc2hlZXQtYnV0dG9uIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWFjdGlvbi1zaGVldC1idXR0b24+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtYWN0aW9uLXNoZWV0LWJ1dHRvbic7XG4gIGltcG9ydCB7IGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1hY3Rpb24tc2hlZXQtYnV0dG9uJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHNdXG4gIH07XG48L3NjcmlwdD4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtbW9kYWwgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtbW9kYWw+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICAvKiBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgKi9cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtbW9kYWwnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIGhpZGFibGUsIGhhc09wdGlvbnMsIGRlcml2ZURCQiwgcG9ydGFsIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLW1vZGFsJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIGhpZGFibGUsIGhhc09wdGlvbnMsIGRlcml2ZURCQiwgcG9ydGFsXVxuICB9O1xuPC9zY3JpcHQ+IiwiPHRlbXBsYXRlPlxuICA8b25zLXRvYXN0IHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXRvYXN0PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgLyogVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5ICovXG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXRvYXN0JztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBoaWRhYmxlLCBoYXNPcHRpb25zLCBkZXJpdmVEQkIsIHBvcnRhbCB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy10b2FzdCcsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzLCBoaWRhYmxlLCBoYXNPcHRpb25zLCBkZXJpdmVEQkIsIHBvcnRhbF1cbiAgfTtcbjwvc2NyaXB0PiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1wb3BvdmVyIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXBvcG92ZXI+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1wb3BvdmVyJztcbiAgaW1wb3J0IHsgaGlkYWJsZSwgaGFzT3B0aW9ucywgZGlhbG9nQ2FuY2VsLCBkZXJpdmVFdmVudHMsIGRlcml2ZURCQiwgcG9ydGFsIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXBvcG92ZXInLFxuICAgIG1peGluczogW2hpZGFibGUsIGhhc09wdGlvbnMsIGRpYWxvZ0NhbmNlbCwgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkIsIHBvcnRhbF0sXG5cbiAgICBwcm9wczoge1xuICAgICAgdGFyZ2V0OiB7XG4gICAgICAgIHZhbGlkYXRvcih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5faXNWdWUgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIEV2ZW50IHx8IHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIG5vcm1hbGl6ZWRUYXJnZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCAmJiB0aGlzLnRhcmdldC5faXNWdWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQuJGVsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgICAgIH0sXG4gICAgICBub3JtYWxpemVkT3B0aW9ucygpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5ub3JtYWxpemVkVGFyZ2V0LFxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLWFsZXJ0LWRpYWxvZyB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPGRpdiBjbGFzcz1cImFsZXJ0LWRpYWxvZy10aXRsZVwiPlxuICAgICAgPHNsb3QgbmFtZT1cInRpdGxlXCI+e3t0aXRsZX19PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbGVydC1kaWFsb2ctY29udGVudFwiPlxuICAgICAgPHNsb3Q+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbGVydC1kaWFsb2ctZm9vdGVyXCI+XG4gICAgICA8c2xvdCBuYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgIDxvbnMtYWxlcnQtZGlhbG9nLWJ1dHRvbiB2LWZvcj1cIihoYW5kbGVyLCBrZXkpIGluIGZvb3RlclwiIDprZXk9XCJrZXlcIiBAY2xpY2s9XCJoYW5kbGVyXCI+e3trZXl9fTwvb25zLWFsZXJ0LWRpYWxvZy1idXR0b24+XG4gICAgICA8L3Nsb3Q+XG4gICAgPC9kaXY+XG4gIDwvb25zLWFsZXJ0LWRpYWxvZz5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLWFsZXJ0LWRpYWxvZyc7XG4gIGltcG9ydCB7IGhpZGFibGUsIGhhc09wdGlvbnMsIGRpYWxvZ0NhbmNlbCwgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkIsIHBvcnRhbCB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1hbGVydC1kaWFsb2cnLFxuICAgIG1peGluczogW2hpZGFibGUsIGhhc09wdGlvbnMsIGRpYWxvZ0NhbmNlbCwgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkIsIHBvcnRhbF0sXG5cbiAgICBwcm9wczoge1xuICAgICAgdGl0bGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgZm9vdGVyOiB7XG4gICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgdmFsaWRhdG9yKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKS5ldmVyeShrZXkgPT4gdmFsdWVba2V5XSBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLXNwZWVkLWRpYWwgOm9uLWNsaWNrLnByb3A9XCJhY3Rpb25cIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXNwZWVkLWRpYWw+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zcGVlZC1kaWFsJztcbiAgaW1wb3J0IHsgaGlkYWJsZSwgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNwZWVkLWRpYWwnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50cywgaGlkYWJsZV0sXG5cbiAgICBwcm9wczoge1xuICAgICAgb3Blbjoge1xuICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgYWN0aW9uKCkge1xuICAgICAgICBsZXQgcnVuRGVmYXVsdCA9IHRydWU7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgeyBwcmV2ZW50RGVmYXVsdDogKCkgPT4gcnVuRGVmYXVsdCA9IGZhbHNlIH0pO1xuXG4gICAgICAgIGlmIChydW5EZWZhdWx0KSB7XG4gICAgICAgICAgdGhpcy4kZWwudG9nZ2xlSXRlbXMoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9zaG91bGRVcGRhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wZW4gIT09IHRoaXMuJGVsLmlzT3BlbigpO1xuICAgICAgfSxcbiAgICAgIF91cGRhdGVUb2dnbGUoKSB7XG4gICAgICAgIHRoaXMuX3Nob3VsZFVwZGF0ZSgpICYmIHRoaXMuJGVsW3RoaXMub3BlbiA/ICdzaG93SXRlbXMnIDogJ2hpZGVJdGVtcyddLmNhbGwodGhpcy4kZWwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgb3BlbigpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVG9nZ2xlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG1vdW50ZWQoKSB7XG4gICAgICB0aGlzLiRvbihbJ29wZW4nLCAnY2xvc2UnXSwgKCkgPT4gdGhpcy5fc2hvdWxkVXBkYXRlKCkgJiYgdGhpcy4kZW1pdCgndXBkYXRlOm9wZW4nLCB0aGlzLiRlbC5pc09wZW4oKSkpO1xuXG4gICAgICB0aGlzLl91cGRhdGVUb2dnbGUoKTtcbiAgICB9XG4gIH07XG48L3NjcmlwdD5cbiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1jYXJvdXNlbFxuICAgIDpvbi1zd2lwZS5wcm9wPVwib25Td2lwZVwiXG4gICAgOmluaXRpYWwtaW5kZXg9XCJpbmRleFwiXG4gICAgQHBvc3RjaGFuZ2Uuc2VsZj1cIiRlbWl0KCd1cGRhdGU6aW5kZXgnLCAkZXZlbnQuYWN0aXZlSW5kZXgpXCJcbiAgICB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCJcbiAgPlxuICAgIDxkaXY+XG4gICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC9kaXY+XG4gICAgPGRpdj48L2Rpdj5cbiAgPC9vbnMtY2Fyb3VzZWw+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1jYXJvdXNlbCc7XG4gIGltcG9ydCB7IGhhc09wdGlvbnMsIGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1jYXJvdXNlbCcsXG4gICAgbWl4aW5zOiBbaGFzT3B0aW9ucywgZGVyaXZlRXZlbnRzXSxcblxuICAgIHByb3BzOiB7XG4gICAgICBpbmRleDoge1xuICAgICAgICB0eXBlOiBOdW1iZXJcbiAgICAgIH0sXG4gICAgICBvblN3aXBlOiB7XG4gICAgICAgIHR5cGU6IEZ1bmN0aW9uXG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhdGNoOiB7XG4gICAgICBpbmRleCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggIT09IHRoaXMuJGVsLmdldEFjdGl2ZUluZGV4KCkpIHtcbiAgICAgICAgICB0aGlzLiRlbC5zZXRBY3RpdmVJbmRleCh0aGlzLmluZGV4LCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtdGFiIDphY3RpdmU9XCJhY3RpdmVcIiA6b24tY2xpY2sucHJvcD1cImFjdGlvblwiPlxuICA8L29ucy10YWI+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy10YWInO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtdGFiJyxcbiAgICBpbmplY3Q6IFsndGFiYmFyJ10sXG5cbiAgICBwcm9wczoge1xuICAgICAgcGFnZTogeyB9LFxuICAgICAgcHJvcHM6IHsgfSxcbiAgICAgIGFjdGl2ZToge1xuICAgICAgICB0eXBlOiBCb29sZWFuXG4gICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGFjdGlvbigpIHtcbiAgICAgICAgbGV0IHJ1bkRlZmF1bHQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRlbWl0KCdjbGljaycsIHsgcHJldmVudERlZmF1bHQ6ICgpID0+IHJ1bkRlZmF1bHQgPSBmYWxzZSB9KTtcblxuICAgICAgICBpZiAocnVuRGVmYXVsdCkge1xuICAgICAgICAgIHRoaXMudGFiYmFyLiRlbC5zZXRBY3RpdmVUYWIodGhpcy4kZWwuaW5kZXgsIHsgcmVqZWN0OiBmYWxzZSwgLi4udGhpcy50YWJiYXIub3B0aW9ucyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgYWN0aXZlKCkge1xuICAgICAgICB0aGlzLiRlbC5zZXRBY3RpdmUodGhpcy5hY3RpdmUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLXRhYmJhclxuICAgIDpvbi1zd2lwZS5wcm9wPVwib25Td2lwZVwiXG4gICAgOmFjdGl2ZUluZGV4PVwiaW5kZXhcIlxuICAgIEBwcmVjaGFuZ2Uuc2VsZj1cIiRuZXh0VGljaygoKSA9PiAhJGV2ZW50LmRldGFpbC5jYW5jZWxlZCAmJiAkZW1pdCgndXBkYXRlOmluZGV4JywgJGV2ZW50LmluZGV4KSlcIlxuICAgIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIlxuICA+XG4gICAgPGRpdiBjbGFzcz1cInRhYmJhcl9fY29udGVudFwiPlxuICAgICAgPGRpdj5cbiAgICAgICAgPHNsb3QgbmFtZT1cInBhZ2VzXCI+XG4gICAgICAgICAgPGNvbXBvbmVudCB2LWZvcj1cInRhYiBpbiB0YWJzXCIgdi1iaW5kPVwidGFiLnByb3BzXCIgOmlzPVwidGFiLnBhZ2VcIiA6a2V5PVwiKHRhYi5wYWdlLmtleSB8fCB0YWIucGFnZS5uYW1lIHx8IF90YWJLZXkodGFiKSlcIiB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+PC9jb21wb25lbnQ+XG4gICAgICAgIDwvc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwidGFiYmFyXCIgOnN0eWxlPVwidGFiYmFyU3R5bGVcIj5cbiAgICAgIDxzbG90PlxuICAgICAgICA8di1vbnMtdGFiIHYtZm9yPVwidGFiIGluIHRhYnNcIiB2LWJpbmQ9XCJ0YWJcIiA6a2V5PVwiX3RhYktleSh0YWIpXCI+PC92LW9ucy10YWI+XG4gICAgICA8L3Nsb3Q+XG4gICAgICA8ZGl2IGNsYXNzPVwidGFiYmFyX19ib3JkZXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9vbnMtdGFiYmFyPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtdGFiYmFyJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzLCBoYXNPcHRpb25zLCBoaWRhYmxlLCBzZWxmUHJvdmlkZXIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtdGFiYmFyJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIGhhc09wdGlvbnMsIGhpZGFibGUsIHNlbGZQcm92aWRlcl0sXG5cbiAgICBwcm9wczoge1xuICAgICAgaW5kZXg6IHtcbiAgICAgICAgdHlwZTogTnVtYmVyXG4gICAgICB9LFxuICAgICAgdGFiczoge1xuICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgdmFsaWRhdG9yKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLmV2ZXJ5KHRhYiA9PiBbJ2ljb24nLCAnbGFiZWwnLCAncGFnZSddLnNvbWUocHJvcCA9PiAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFiLCBwcm9wKSkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25Td2lwZToge1xuICAgICAgICB0eXBlOiBGdW5jdGlvblxuICAgICAgfSxcbiAgICAgIHRhYmJhclN0eWxlOiB7XG4gICAgICAgIHR5cGU6IG51bGxcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgX3RhYktleSh0YWIpIHtcbiAgICAgICAgcmV0dXJuIHRhYi5rZXkgfHwgdGFiLmxhYmVsIHx8IHRhYi5pY29uO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgaW5kZXgoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ICE9PSB0aGlzLiRlbC5nZXRBY3RpdmVUYWJJbmRleCgpKSB7XG4gICAgICAgICAgdGhpcy4kZWwuc2V0QWN0aXZlVGFiKHRoaXMuaW5kZXgsIHsgcmVqZWN0OiBmYWxzZSwgLi4udGhpcy5vcHRpb25zIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtYmFjay1idXR0b24gOm9uLWNsaWNrLnByb3A9XCJhY3Rpb25cIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLWJhY2stYnV0dG9uPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtYmFjay1idXR0b24nO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtYmFjay1idXR0b24nLFxuICAgIGluamVjdDogWyduYXZpZ2F0b3InXSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGFjdGlvbigpIHtcbiAgICAgICAgbGV0IHJ1bkRlZmF1bHQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRlbWl0KCdjbGljaycsIHsgcHJldmVudERlZmF1bHQ6ICgpID0+IHJ1bkRlZmF1bHQgPSBmYWxzZSB9KTtcblxuICAgICAgICBpZiAocnVuRGVmYXVsdCAmJiB0aGlzLm5hdmlnYXRvci5wYWdlU3RhY2subGVuZ3RoID4gMSkge1xuICAgICAgICAgIHRoaXMubmF2aWdhdG9yLnBvcFBhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLW5hdmlnYXRvciBAcG9zdHBvcC5zZWxmPVwiX2NoZWNrU3dpcGVcIiB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+XG4gICAgICA8Y29tcG9uZW50IHYtZm9yPVwicGFnZSBpbiBwYWdlU3RhY2tcIiA6aXM9XCJwYWdlXCIgOmtleT1cInBhZ2Uua2V5IHx8IHBhZ2UubmFtZVwiIHYtb249XCJ1bnJlY29nbml6ZWRMaXN0ZW5lcnNcIj48L2NvbXBvbmVudD5cbiAgICA8L3Nsb3Q+XG4gIDwvb25zLW5hdmlnYXRvcj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLW5hdmlnYXRvcic7XG4gIGltcG9ydCB7IGhhc09wdGlvbnMsIHNlbGZQcm92aWRlciwgZGVyaXZlRXZlbnRzLCBkZXJpdmVEQkIgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtbmF2aWdhdG9yJyxcbiAgICBtaXhpbnM6IFtoYXNPcHRpb25zLCBzZWxmUHJvdmlkZXIsIGRlcml2ZUV2ZW50cywgZGVyaXZlREJCXSxcblxuICAgIHByb3BzOiB7XG4gICAgICBwYWdlU3RhY2s6IHtcbiAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICB9LFxuICAgICAgcG9wUGFnZToge1xuICAgICAgICB0eXBlOiBGdW5jdGlvbixcbiAgICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgICB0aGlzLnBhZ2VTdGFjay5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICBpc1JlYWR5KCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnX3JlYWR5JykgJiYgdGhpcy5fcmVhZHkgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWR5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0sXG4gICAgICBvbkRldmljZUJhY2tCdXR0b24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucGFnZVN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICB0aGlzLnBvcFBhZ2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBldmVudC5jYWxsUGFyZW50SGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2ZpbmRTY3JvbGxQYWdlKHBhZ2UpIHtcbiAgICAgICAgY29uc3QgbmV4dFBhZ2UgPSBwYWdlLl9jb250ZW50RWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPT09IDFcbiAgICAgICAgICAmJiB0aGlzLiRvbnMuX29ucy5fdXRpbC5nZXRUb3BQYWdlKHBhZ2UuX2NvbnRlbnRFbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgICAgcmV0dXJuIG5leHRQYWdlID8gdGhpcy5fZmluZFNjcm9sbFBhZ2UobmV4dFBhZ2UpIDogcGFnZTtcbiAgICAgIH0sXG4gICAgICBfc2V0UGFnZXNWaXNpYmlsaXR5KHN0YXJ0LCBlbmQsIHZpc2liaWxpdHkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICB0aGlzLiRjaGlsZHJlbltpXS4kZWwuc3R5bGUudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfcmVhdHRhY2hQYWdlKHBhZ2VFbGVtZW50LCBwb3NpdGlvbiA9IG51bGwsIHJlc3RvcmVTY3JvbGwpIHtcbiAgICAgICAgdGhpcy4kZWwuaW5zZXJ0QmVmb3JlKHBhZ2VFbGVtZW50LCBwb3NpdGlvbik7XG4gICAgICAgIHJlc3RvcmVTY3JvbGwgaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiByZXN0b3JlU2Nyb2xsKCk7XG4gICAgICAgIHBhZ2VFbGVtZW50Ll9pc1Nob3duID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBfcmVkZXRhY2hQYWdlKHBhZ2VFbGVtZW50KSB7XG4gICAgICAgIHBhZ2VFbGVtZW50Ll9kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0sXG4gICAgICBfYW5pbWF0ZSh7IGxhc3RMZW5ndGgsIGN1cnJlbnRMZW5ndGgsIGxhc3RUb3BQYWdlLCBjdXJyZW50VG9wUGFnZSwgcmVzdG9yZVNjcm9sbCB9KSB7XG5cbiAgICAgICAgLy8gUHVzaFxuICAgICAgICBpZiAoY3VycmVudExlbmd0aCA+IGxhc3RMZW5ndGgpIHtcbiAgICAgICAgICBsZXQgaXNSZWF0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGxhc3RUb3BQYWdlLnBhcmVudEVsZW1lbnQgIT09IHRoaXMuJGVsKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWF0dGFjaFBhZ2UobGFzdFRvcFBhZ2UsIHRoaXMuJGVsLmNoaWxkcmVuW2xhc3RMZW5ndGggLSAxXSwgcmVzdG9yZVNjcm9sbCk7XG4gICAgICAgICAgICBpc1JlYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgbGFzdExlbmd0aC0tO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9zZXRQYWdlc1Zpc2liaWxpdHkobGFzdExlbmd0aCwgY3VycmVudExlbmd0aCwgJ2hpZGRlbicpO1xuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuJGVsLl9wdXNoUGFnZSh7IC4uLnRoaXMub3B0aW9ucywgbGVhdmVQYWdlOiBsYXN0VG9wUGFnZSB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9zZXRQYWdlc1Zpc2liaWxpdHkobGFzdExlbmd0aCwgY3VycmVudExlbmd0aCwgJycpO1xuICAgICAgICAgICAgICBpZiAoaXNSZWF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVkZXRhY2hQYWdlKGxhc3RUb3BQYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQb3BcbiAgICAgICAgaWYgKGN1cnJlbnRMZW5ndGggPCBsYXN0TGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5fcmVhdHRhY2hQYWdlKGxhc3RUb3BQYWdlLCBudWxsLCByZXN0b3JlU2Nyb2xsKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy4kZWwuX3BvcFBhZ2UoeyAuLi50aGlzLm9wdGlvbnMgfSwgKCkgPT4gdGhpcy5fcmVkZXRhY2hQYWdlKGxhc3RUb3BQYWdlKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXBsYWNlIHBhZ2VcbiAgICAgICAgY3VycmVudFRvcFBhZ2Uuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB0aGlzLl9yZWF0dGFjaFBhZ2UobGFzdFRvcFBhZ2UsIGN1cnJlbnRUb3BQYWdlLCByZXN0b3JlU2Nyb2xsKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsLl9wdXNoUGFnZSh7IC4uLnRoaXMub3B0aW9ucywgX3JlcGxhY2VQYWdlOiB0cnVlIH0pLnRoZW4oKCkgPT4gdGhpcy5fcmVkZXRhY2hQYWdlKGxhc3RUb3BQYWdlKSk7XG4gICAgICB9LFxuICAgICAgX2NoZWNrU3dpcGUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsLmhhc0F0dHJpYnV0ZSgnc3dpcGVhYmxlJykgJiZcbiAgICAgICAgICBldmVudC5sZWF2ZVBhZ2UgIT09IHRoaXMuJGVsLmxhc3RDaGlsZCAmJiBldmVudC5sZWF2ZVBhZ2UgPT09IHRoaXMuJGNoaWxkcmVuW3RoaXMuJGNoaWxkcmVuLmxlbmd0aCAtIDFdLiRlbFxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnBvcFBhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgcGFnZVN0YWNrKGFmdGVyLCBiZWZvcmUpIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsLmhhc0F0dHJpYnV0ZSgnc3dpcGVhYmxlJykgJiYgdGhpcy4kY2hpbGRyZW4ubGVuZ3RoICE9PSB0aGlzLiRlbC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wV2FzTXV0YXRlZCA9IGFmdGVyID09PSBiZWZvcmU7IC8vIENhbiBiZSBtdXRhdGVkIG9yIHJlcGxhY2VkXG4gICAgICAgIGNvbnN0IGxhc3RUb3BQYWdlID0gdGhpcy4kY2hpbGRyZW5bdGhpcy4kY2hpbGRyZW4ubGVuZ3RoIC0gMV0uJGVsO1xuICAgICAgICBjb25zdCBzY3JvbGxFbGVtZW50ID0gdGhpcy5fZmluZFNjcm9sbFBhZ2UobGFzdFRvcFBhZ2UpO1xuICAgICAgICBjb25zdCBzY3JvbGxWYWx1ZSA9IHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wIHx8IDA7XG5cbiAgICAgICAgdGhpcy5fcGFnZVN0YWNrVXBkYXRlID0ge1xuICAgICAgICAgIGxhc3RUb3BQYWdlLFxuICAgICAgICAgIGxhc3RMZW5ndGg6IHByb3BXYXNNdXRhdGVkID8gdGhpcy4kY2hpbGRyZW4ubGVuZ3RoIDogYmVmb3JlLmxlbmd0aCxcbiAgICAgICAgICBjdXJyZW50TGVuZ3RoOiAhcHJvcFdhc011dGF0ZWQgJiYgYWZ0ZXIubGVuZ3RoLFxuICAgICAgICAgIHJlc3RvcmVTY3JvbGw6ICgpID0+IHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wID0gc2Nyb2xsVmFsdWVcbiAgICAgICAgfTtcblxuICAgICAgICAvLyB0aGlzLiRuZXh0VGljaygoKSA9PiB7IH0pOyAvLyBXYWl0cyB0b28gbG9uZywgdXBkYXRlZCgpIGhvb2sgaXMgZmFzdGVyIGFuZCBwcmV2ZW50cyBmbGlja2VyaW5nc1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVkKCkge1xuICAgICAgaWYgKHRoaXMuX3BhZ2VTdGFja1VwZGF0ZSkge1xuICAgICAgICBsZXQgY3VycmVudFRvcFBhZ2UgPSB0aGlzLiRjaGlsZHJlblt0aGlzLiRjaGlsZHJlbi5sZW5ndGggLSAxXS4kZWw7XG4gICAgICAgIGxldCB7IGxhc3RUb3BQYWdlLCBjdXJyZW50TGVuZ3RoIH0gPSB0aGlzLl9wYWdlU3RhY2tVcGRhdGU7XG4gICAgICAgIGNvbnN0IHsgbGFzdExlbmd0aCwgcmVzdG9yZVNjcm9sbCB9ID0gdGhpcy5fcGFnZVN0YWNrVXBkYXRlO1xuICAgICAgICBjdXJyZW50TGVuZ3RoID0gY3VycmVudExlbmd0aCA9PT0gZmFsc2UgPyB0aGlzLiRjaGlsZHJlbi5sZW5ndGggOiBjdXJyZW50TGVuZ3RoO1xuXG4gICAgICAgIGlmIChjdXJyZW50VG9wUGFnZSAhPT0gbGFzdFRvcFBhZ2UpIHtcbiAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRoaXMuX2FuaW1hdGUoeyBsYXN0TGVuZ3RoLCBjdXJyZW50TGVuZ3RoLCBsYXN0VG9wUGFnZSwgY3VycmVudFRvcFBhZ2UsIHJlc3RvcmVTY3JvbGwgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudExlbmd0aCAhPT0gbGFzdExlbmd0aCkge1xuICAgICAgICAgIGN1cnJlbnRUb3BQYWdlLnVwZGF0ZUJhY2tCdXR0b24oY3VycmVudExlbmd0aCA+IDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdFRvcFBhZ2UgPSBjdXJyZW50VG9wUGFnZSA9IHRoaXMuX3BhZ2VTdGFja1VwZGF0ZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtc3BsaXR0ZXItc2lkZSB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCI+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L29ucy1zcGxpdHRlci1zaWRlPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtc3BsaXR0ZXItc2lkZSc7XG4gIGltcG9ydCB7IGhhc09wdGlvbnMsIGRlcml2ZUV2ZW50cyB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1zcGxpdHRlci1zaWRlJyxcbiAgICBtaXhpbnM6IFtoYXNPcHRpb25zLCBkZXJpdmVFdmVudHNdLFxuXG4gICAgcHJvcHM6IHtcbiAgICAgIG9wZW46IHtcbiAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGFjdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc2hvdWxkVXBkYXRlKCkgJiYgdGhpcy4kZWxbdGhpcy5vcGVuID8gJ29wZW4nIDogJ2Nsb3NlJ10uY2FsbCh0aGlzLiRlbCwgdGhpcy5vcHRpb25zKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICB9LFxuICAgICAgX3Nob3VsZFVwZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3BlbiAhPT0gdGhpcy4kZWwuaXNPcGVuO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgb3BlbigpIHtcbiAgICAgICAgdGhpcy5hY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbW91bnRlZCgpIHtcbiAgICAgIHRoaXMuJG9uKFsncG9zdG9wZW4nLCAncG9zdGNsb3NlJywgJ21vZGVjaGFuZ2UnXSwgKCkgPT4gdGhpcy5fc2hvdWxkVXBkYXRlKCkgJiYgdGhpcy4kZW1pdCgndXBkYXRlOm9wZW4nLCB0aGlzLiRlbC5pc09wZW4pKTtcblxuICAgICAgdGhpcy5hY3Rpb24oKTtcbiAgICB9XG4gIH07XG48L3NjcmlwdD5cbiIsIjx0ZW1wbGF0ZT5cbiAgPCEtLSBUaGlzIGVsZW1lbnQgaXMgdXNlbGVzcyBleGNlcHQgZm9yIHRoZSBkZXN0cm95IHBhcnQgLS0+XG4gIDxvbnMtbGF6eS1yZXBlYXQ+PC9vbnMtbGF6eS1yZXBlYXQ+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtbGF6eS1yZXBlYXQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICd2LW9ucy1sYXp5LXJlcGVhdCcsXG5cbiAgcHJvcHM6IHtcbiAgICByZW5kZXJJdGVtOiB7XG4gICAgICB0eXBlOiBGdW5jdGlvbixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgdmFsaWRhdG9yKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHZhbHVlKDApO1xuICAgICAgICBpZiAoY29tcG9uZW50Ll9pc1Z1ZSAmJiAhY29tcG9uZW50Ll9pc01vdW50ZWQpIHtcbiAgICAgICAgICBjb21wb25lbnQuJGRlc3Ryb3koKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgfSxcbiAgICBjYWxjdWxhdGVJdGVtSGVpZ2h0OiB7XG4gICAgICB0eXBlOiBGdW5jdGlvbixcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH1cbiAgfSxcblxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwcm92aWRlcjogbnVsbFxuICAgIH07XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIF9zZXR1cCgpIHtcbiAgICAgIHRoaXMucHJvdmlkZXIgJiYgdGhpcy5wcm92aWRlci5kZXN0cm95KCk7XG5cbiAgICAgIGNvbnN0IGRlbGVnYXRlID0gbmV3IHRoaXMuJG9ucy5fb25zLl9pbnRlcm5hbC5MYXp5UmVwZWF0RGVsZWdhdGUoe1xuICAgICAgICBjYWxjdWxhdGVJdGVtSGVpZ2h0OiB0aGlzLmNhbGN1bGF0ZUl0ZW1IZWlnaHQsXG4gICAgICAgIGNyZWF0ZUl0ZW1Db250ZW50OiBpID0+IHRoaXMucmVuZGVySXRlbShpKS4kbW91bnQoKS4kZWwsXG4gICAgICAgIGRlc3Ryb3lJdGVtOiAoaSwgeyBlbGVtZW50IH0pID0+IGVsZW1lbnQuX192dWVfXy4kZGVzdHJveSgpLFxuICAgICAgICBjb3VudEl0ZW1zOiAoKSA9PiB0aGlzLmxlbmd0aFxuICAgICAgfSwgbnVsbCk7XG5cbiAgICAgIHRoaXMucHJvdmlkZXIgPSBuZXcgdGhpcy4kb25zLl9vbnMuX2ludGVybmFsLkxhenlSZXBlYXRQcm92aWRlcih0aGlzLiRwYXJlbnQuJGVsLCBkZWxlZ2F0ZSk7XG4gICAgfSxcbiAgICByZWZyZXNoKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucmVmcmVzaCgpO1xuICAgIH1cbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHJlbmRlckl0ZW0oKSB7XG4gICAgICB0aGlzLl9zZXR1cCgpO1xuICAgIH0sXG4gICAgbGVuZ3RoKCkge1xuICAgICAgdGhpcy5fc2V0dXAoKTtcbiAgICB9LFxuICAgIGNhbGN1bGF0ZUl0ZW1IZWlnaHQoKSB7XG4gICAgICB0aGlzLl9zZXR1cCgpO1xuICAgIH1cbiAgfSxcblxuICBtb3VudGVkKCkge1xuICAgIHRoaXMuX3NldHVwKCk7XG4gICAgdGhpcy4kdm5vZGUuY29udGV4dC4kb24oJ3JlZnJlc2gnLCB0aGlzLnJlZnJlc2gpO1xuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3koKSB7XG4gICAgdGhpcy4kdm5vZGUuY29udGV4dC4kb2ZmKCdyZWZyZXNoJywgdGhpcy5yZWZyZXNoKTtcblxuICAgIC8vIFRoaXMgd2lsbCBkZXN0cm95IHRoZSBwcm92aWRlciBvbmNlIHRoZSByZW5kZXJlZCBlbGVtZW50XG4gICAgLy8gaXMgZGV0YWNoZWQgKGRldGFjaGVkQ2FsbGJhY2spLiBUaGVyZWZvcmUsIGFuaW1hdGlvbnNcbiAgICAvLyBoYXZlIHRpbWUgdG8gZmluaXNoIGJlZm9yZSBlbGVtZW50cyBzdGFydCB0byBkaXNhcHBlYXIuXG4gICAgLy8gSXQgY2Fubm90IGJlIHNldCBlYXJsaWVyIGluIG9yZGVyIHRvIHByZXZlbnQgYWNjaWRlbnRhbFxuICAgIC8vIGRlc3Ryb3lzIGlmIHRoaXMgZWxlbWVudCBpcyByZXRhY2hlZCBieSBzb21ldGhpbmcgZWxzZS5cbiAgICB0aGlzLiRlbC5fbGF6eVJlcGVhdFByb3ZpZGVyID0gdGhpcy5wcm92aWRlcjtcbiAgICB0aGlzLnByb3ZpZGVyID0gbnVsbDtcbiAgfVxufTtcbjwvc2NyaXB0PlxuIiwiPHRlbXBsYXRlPlxuICA8b25zLXNlbGVjdCB2LW9uPVwiJGxpc3RlbmVyc1wiPlxuICAgIDxzZWxlY3Q+XG4gICAgICA8c2xvdD48L3Nsb3Q+XG4gICAgPC9zZWxlY3Q+XG4gIDwvb25zLXNlbGVjdD5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXNlbGVjdCc7XG4gIGltcG9ydCB7IG1vZGVsSW5wdXQgfSBmcm9tICcuLi9taXhpbnMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBuYW1lOiAndi1vbnMtc2VsZWN0JyxcbiAgICBtaXhpbnM6IFttb2RlbElucHV0XVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtc2VnbWVudCA6YWN0aXZlLWluZGV4PVwiaW5kZXhcIiBAcG9zdGNoYW5nZS5zZWxmPVwiJGVtaXQoJ3VwZGF0ZTppbmRleCcsICRldmVudC5pbmRleClcIj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvb25zLXNlZ21lbnQ+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgJ29uc2VudWkvZXNtL2VsZW1lbnRzL29ucy1zZWdtZW50JztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXNlZ21lbnQnLFxuICAgIG1peGluczogW2Rlcml2ZUV2ZW50c10sXG5cbiAgICBwcm9wczoge1xuICAgICAgaW5kZXg6IHtcbiAgICAgICAgdHlwZTogTnVtYmVyXG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhdGNoOiB7XG4gICAgICBpbmRleCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggIT09IHRoaXMuJGVsLmdldEFjdGl2ZUJ1dHRvbkluZGV4KCkpIHtcbiAgICAgICAgICB0aGlzLiRlbC5zZXRBY3RpdmVCdXR0b24odGhpcy5pbmRleCwgeyByZWplY3Q6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuPC9zY3JpcHQ+XG4iLCI8dGVtcGxhdGU+XG4gIDxvbnMtcHVsbC1ob29rXG4gICAgOm9uLWFjdGlvbi5wcm9wPVwiYWN0aW9uXCJcbiAgICA6b24tcHVsbC5wcm9wPVwib25QdWxsXCJcbiAgICB2LW9uPVwidW5yZWNvZ25pemVkTGlzdGVuZXJzXCJcbiAgPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtcHVsbC1ob29rPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgaW1wb3J0ICdvbnNlbnVpL2VzbS9lbGVtZW50cy9vbnMtcHVsbC1ob29rJztcbiAgaW1wb3J0IHsgZGVyaXZlRXZlbnRzIH0gZnJvbSAnLi4vbWl4aW5zJztcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ3Ytb25zLXB1bGwtaG9vaycsXG4gICAgbWl4aW5zOiBbZGVyaXZlRXZlbnRzXSxcblxuICAgIHByb3BzOiB7XG4gICAgICBhY3Rpb246IHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25cbiAgICAgIH0sXG4gICAgICBvblB1bGw6IHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25cbiAgICAgIH1cbiAgICB9XG4gIH07XG48L3NjcmlwdD5cbiIsIjx0ZW1wbGF0ZT5cbiAgPG9ucy1wYWdlIDpvbi1pbmZpbml0ZS1zY3JvbGwucHJvcD1cImluZmluaXRlU2Nyb2xsXCIgdi1vbj1cInVucmVjb2duaXplZExpc3RlbmVyc1wiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9vbnMtcGFnZT5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCAnb25zZW51aS9lc20vZWxlbWVudHMvb25zLXBhZ2UnO1xuICBpbXBvcnQgeyBkZXJpdmVFdmVudHMsIGRlcml2ZURCQiB9IGZyb20gJy4uL21peGlucyc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIG5hbWU6ICd2LW9ucy1wYWdlJyxcbiAgICBtaXhpbnM6IFtkZXJpdmVFdmVudHMsIGRlcml2ZURCQl0sXG5cbiAgICBwcm9wczoge1xuICAgICAgaW5maW5pdGVTY3JvbGw6IHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25cbiAgICAgIH1cbiAgICB9XG4gIH07XG48L3NjcmlwdD5cbiIsIi8vIEdlbmVyaWMgY29tcG9uZW50czpcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1Rvb2xiYXIgfSBmcm9tICcuL1ZPbnNUb29sYmFyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0JvdHRvbVRvb2xiYXIgfSBmcm9tICcuL1ZPbnNCb3R0b21Ub29sYmFyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1Rvb2xiYXJCdXR0b24gfSBmcm9tICcuL1ZPbnNUb29sYmFyQnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0FsZXJ0RGlhbG9nQnV0dG9uIH0gZnJvbSAnLi9WT25zQWxlcnREaWFsb2dCdXR0b24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQnV0dG9uIH0gZnJvbSAnLi9WT25zQnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0ljb24gfSBmcm9tICcuL1ZPbnNJY29uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0NhcmQgfSBmcm9tICcuL1ZPbnNDYXJkJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0xpc3QgfSBmcm9tICcuL1ZPbnNMaXN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0xpc3RJdGVtIH0gZnJvbSAnLi9WT25zTGlzdEl0ZW0nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zTGlzdFRpdGxlIH0gZnJvbSAnLi9WT25zTGlzdFRpdGxlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0xpc3RIZWFkZXIgfSBmcm9tICcuL1ZPbnNMaXN0SGVhZGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1JpcHBsZSB9IGZyb20gJy4vVk9uc1JpcHBsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNSb3cgfSBmcm9tICcuL1ZPbnNSb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ29sIH0gZnJvbSAnLi9WT25zQ29sJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1Byb2dyZXNzQmFyIH0gZnJvbSAnLi9WT25zUHJvZ3Jlc3NCYXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUHJvZ3Jlc3NDaXJjdWxhciB9IGZyb20gJy4vVk9uc1Byb2dyZXNzQ2lyY3VsYXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ2Fyb3VzZWxJdGVtIH0gZnJvbSAnLi9WT25zQ2Fyb3VzZWxJdGVtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1NwbGl0dGVyTWFzayB9IGZyb20gJy4vVk9uc1NwbGl0dGVyTWFzayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGxpdHRlckNvbnRlbnQgfSBmcm9tICcuL1ZPbnNTcGxpdHRlckNvbnRlbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zU3BsaXR0ZXIgfSBmcm9tICcuL1ZPbnNTcGxpdHRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTd2l0Y2ggfSBmcm9tICcuL1ZPbnNTd2l0Y2gnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ2hlY2tib3ggfSBmcm9tICcuL1ZPbnNDaGVja2JveCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNJbnB1dCB9IGZyb20gJy4vVk9uc0lucHV0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1NlYXJjaElucHV0IH0gZnJvbSAnLi9WT25zU2VhcmNoSW5wdXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUmFuZ2UgfSBmcm9tICcuL1ZPbnNSYW5nZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNSYWRpbyB9IGZyb20gJy4vVk9uc1JhZGlvJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0ZhYiB9IGZyb20gJy4vVk9uc0ZhYic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGVlZERpYWxJdGVtIH0gZnJvbSAnLi9WT25zU3BlZWREaWFsSXRlbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNEaWFsb2cgfSBmcm9tICcuL1ZPbnNEaWFsb2cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQWN0aW9uU2hlZXQgfSBmcm9tICcuL1ZPbnNBY3Rpb25TaGVldCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNBY3Rpb25TaGVldEJ1dHRvbiB9IGZyb20gJy4vVk9uc0FjdGlvblNoZWV0QnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc01vZGFsIH0gZnJvbSAnLi9WT25zTW9kYWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zVG9hc3QgfSBmcm9tICcuL1ZPbnNUb2FzdCc7XG5cbi8vIE1hbnVhbCBjb21wb25lbnRzOlxuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUG9wb3ZlciB9IGZyb20gJy4vVk9uc1BvcG92ZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQWxlcnREaWFsb2cgfSBmcm9tICcuL1ZPbnNBbGVydERpYWxvZyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGVlZERpYWwgfSBmcm9tICcuL1ZPbnNTcGVlZERpYWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zQ2Fyb3VzZWwgfSBmcm9tICcuL1ZPbnNDYXJvdXNlbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNUYWIgfSBmcm9tICcuL1ZPbnNUYWInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zVGFiYmFyIH0gZnJvbSAnLi9WT25zVGFiYmFyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc0JhY2tCdXR0b24gfSBmcm9tICcuL1ZPbnNCYWNrQnV0dG9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc05hdmlnYXRvciB9IGZyb20gJy4vVk9uc05hdmlnYXRvcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFZPbnNTcGxpdHRlclNpZGUgfSBmcm9tICcuL1ZPbnNTcGxpdHRlclNpZGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zTGF6eVJlcGVhdCB9IGZyb20gJy4vVk9uc0xhenlSZXBlYXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zU2VsZWN0IH0gZnJvbSAnLi9WT25zU2VsZWN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1NlZ21lbnQgfSBmcm9tICcuL1ZPbnNTZWdtZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVk9uc1B1bGxIb29rIH0gZnJvbSAnLi9WT25zUHVsbEhvb2snO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBWT25zUGFnZSB9IGZyb20gJy4vVk9uc1BhZ2UnO1xuIiwiaW1wb3J0IG9ucyBmcm9tICdvbnNlbnVpJztcbmltcG9ydCBzZXR1cCBmcm9tICcuL3NldHVwJztcbmltcG9ydCAqIGFzIGNvbXBvbmVudHMgZnJvbSAnLi9jb21wb25lbnRzJztcblxuY29uc3QgJG9ucyA9IHNldHVwKG9ucyk7XG5cbiRvbnMuaW5zdGFsbCA9IChWdWUsIHBhcmFtcyA9IHt9KSA9PiB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciBjb21wb25lbnRzIG9mIHZ1ZS1vbnNlbnVpLlxuICAgKi9cbiAgT2JqZWN0LmtleXMoY29tcG9uZW50cylcbiAgICAuZm9yRWFjaChrZXkgPT4gVnVlLmNvbXBvbmVudChjb21wb25lbnRzW2tleV0ubmFtZSwgY29tcG9uZW50c1trZXldKSk7XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBvbnMgb2JqZWN0LlxuICAgKi9cbiAgVnVlLnByb3RvdHlwZS4kb25zID0gJG9ucztcbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVnVlKSB7XG4gIHdpbmRvdy5WdWUudXNlKHsgaW5zdGFsbDogJG9ucy5pbnN0YWxsIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCAkb25zO1xuIl0sIm5hbWVzIjpbIm9ucyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJzb21lIiwiayIsIm1hdGNoIiwidCIsInJlZHVjZSIsInIiLCJfb25zIiwiY2FwaXRhbGl6ZSIsInN0cmluZyIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJjYW1lbGl6ZSIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsIm0iLCJsIiwiZXZlbnRUb0hhbmRsZXIiLCJuYW1lIiwiaGFuZGxlclRvUHJvcCIsIl9zZXR1cERCQiIsImRiYiIsImhhbmRsZXIiLCJjb21wb25lbnQiLCIkZWwiLCJfY2FsbGJhY2siLCJlIiwiY2FsbFBhcmVudEhhbmRsZXIiLCJydW5EZWZhdWx0IiwiJGVtaXQiLCJldmVudCIsIl9pc0RCQlNldHVwIiwiZGVyaXZlREJCIiwib25EZXZpY2VCYWNrQnV0dG9uIiwiZGVzdHJveSIsImRlcml2ZUV2ZW50cyIsIiRvcHRpb25zIiwiX2NvbXBvbmVudFRhZyIsIiRsaXN0ZW5lcnMiLCIkb25zIiwiZWxlbWVudHMiLCJldmVudHMiLCJpbmRleE9mIiwiX2hhbmRsZXJzIiwiY29uc3RydWN0b3IiLCJmb3JFYWNoIiwia2V5IiwidGFyZ2V0IiwidGVzdCIsInRhZ05hbWUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl90b2dnbGVWaXNpYmlsaXR5IiwidmlzaWJsZSIsImNhbGwiLCJub3JtYWxpemVkT3B0aW9ucyIsIm9wdGlvbnMiLCJfdGVsZXBvcnQiLCJfaXNEZXN0cm95ZWQiLCJwYXJlbnROb2RlIiwiZG9jdW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJfdW5tb3VudCIsImhpZGUiLCJ0aGVuIiwicmVtb3ZlIiwiaGlkYWJsZSIsIkJvb2xlYW4iLCJ1bmRlZmluZWQiLCIkbmV4dFRpY2siLCJoYXNPcHRpb25zIiwic2VsZlByb3ZpZGVyIiwiZGlhbG9nQ2FuY2VsIiwiJG9uIiwicG9ydGFsIiwibW9kZWwiLCJtb2RlbElucHV0IiwicHJvcCIsIk51bWJlciIsIlN0cmluZyIsInZhbHVlIiwiX3VwZGF0ZVZhbHVlIiwiX29uTW9kZWxFdmVudCIsIm1vZGVsQ2hlY2tib3giLCJBcnJheSIsImNoZWNrZWQiLCJuZXdWYWx1ZSIsImluZGV4IiwiaW5jbHVkZWQiLCJsZW5ndGgiLCJtb2RlbFJhZGlvIiwicmVuZGVyIiwiX2lzVnVlIiwiRXZlbnQiLCJIVE1MRWxlbWVudCIsIm5vcm1hbGl6ZWRUYXJnZXQiLCJldmVyeSIsIkZ1bmN0aW9uIiwicHJldmVudERlZmF1bHQiLCJ0b2dnbGVJdGVtcyIsIm9wZW4iLCJpc09wZW4iLCJfc2hvdWxkVXBkYXRlIiwiX3VwZGF0ZVRvZ2dsZSIsImdldEFjdGl2ZUluZGV4Iiwic2V0QWN0aXZlSW5kZXgiLCJ0YWJiYXIiLCJzZXRBY3RpdmVUYWIiLCJyZWplY3QiLCJzZXRBY3RpdmUiLCJhY3RpdmUiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ0YWIiLCJsYWJlbCIsImljb24iLCJnZXRBY3RpdmVUYWJJbmRleCIsIm5hdmlnYXRvciIsInBhZ2VTdGFjayIsInBvcFBhZ2UiLCJwb3AiLCJoYXNPd25Qcm9wZXJ0eSIsIl9yZWFkeSIsIlByb21pc2UiLCJyZXNvbHZlIiwicGFnZSIsIm5leHRQYWdlIiwiX2NvbnRlbnRFbGVtZW50IiwiY2hpbGRyZW4iLCJfdXRpbCIsImdldFRvcFBhZ2UiLCJfZmluZFNjcm9sbFBhZ2UiLCJzdGFydCIsImVuZCIsInZpc2liaWxpdHkiLCJpIiwiJGNoaWxkcmVuIiwic3R5bGUiLCJwYWdlRWxlbWVudCIsInBvc2l0aW9uIiwicmVzdG9yZVNjcm9sbCIsImluc2VydEJlZm9yZSIsIl9pc1Nob3duIiwiX2Rlc3Ryb3kiLCJsYXN0TGVuZ3RoIiwiY3VycmVudExlbmd0aCIsImxhc3RUb3BQYWdlIiwiY3VycmVudFRvcFBhZ2UiLCJpc1JlYXR0YWNoZWQiLCJwYXJlbnRFbGVtZW50IiwiX3JlYXR0YWNoUGFnZSIsIl9zZXRQYWdlc1Zpc2liaWxpdHkiLCJfcHVzaFBhZ2UiLCJsZWF2ZVBhZ2UiLCJfcmVkZXRhY2hQYWdlIiwiX3BvcFBhZ2UiLCJfcmVwbGFjZVBhZ2UiLCJoYXNBdHRyaWJ1dGUiLCJsYXN0Q2hpbGQiLCJhZnRlciIsImJlZm9yZSIsInByb3BXYXNNdXRhdGVkIiwic2Nyb2xsRWxlbWVudCIsInNjcm9sbFZhbHVlIiwic2Nyb2xsVG9wIiwiX3BhZ2VTdGFja1VwZGF0ZSIsIl9hbmltYXRlIiwidXBkYXRlQmFja0J1dHRvbiIsImNhdGNoIiwiYWN0aW9uIiwiX2lzTW91bnRlZCIsIiRkZXN0cm95IiwicHJvdmlkZXIiLCJkZWxlZ2F0ZSIsIl9pbnRlcm5hbCIsIkxhenlSZXBlYXREZWxlZ2F0ZSIsImNhbGN1bGF0ZUl0ZW1IZWlnaHQiLCJyZW5kZXJJdGVtIiwiJG1vdW50IiwiZWxlbWVudCIsIl9fdnVlX18iLCJMYXp5UmVwZWF0UHJvdmlkZXIiLCIkcGFyZW50IiwicmVmcmVzaCIsIl9zZXR1cCIsIiR2bm9kZSIsImNvbnRleHQiLCIkb2ZmIiwiX2xhenlSZXBlYXRQcm92aWRlciIsImdldEFjdGl2ZUJ1dHRvbkluZGV4Iiwic2V0QWN0aXZlQnV0dG9uIiwic2V0dXAiLCJpbnN0YWxsIiwiVnVlIiwiY29tcG9uZW50cyIsInByb3RvdHlwZSIsIndpbmRvdyIsInVzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFlBQWUsVUFBU0EsTUFBVCxFQUFjO1NBQ3BCQyxPQUFPQyxJQUFQLENBQVlGLE1BQVosRUFDSkcsTUFESSxDQUNHO1dBQUssQ0FDWCxLQURXLEVBRVgsVUFGVyxFQUdYLFNBSFcsRUFJWCxPQUpXLEVBS1gsT0FMVyxFQU1YLE1BTlcsRUFPWCxRQVBXLEVBUVgsVUFSVyxFQVNYLFdBVFcsRUFVWCxpQkFWVyxFQVdYLGNBWFcsRUFZWCxhQVpXLEVBYVgsVUFiVyxFQWNYLE9BZFcsRUFlWEMsSUFmVyxDQWVOO2FBQUtDLEVBQUVDLEtBQUYsQ0FBUUMsQ0FBUixDQUFMO0tBZk0sQ0FBTDtHQURILEVBaUJKQyxNQWpCSSxDQWlCRyxVQUFDQyxDQUFELEVBQUlKLENBQUosRUFBVTtNQUNkQSxDQUFGLElBQU9MLE9BQUlLLENBQUosQ0FBUDtXQUNPSSxDQUFQO0dBbkJHLEVBb0JGLEVBQUVDLE1BQU1WLE1BQVIsRUFwQkUsQ0FBUDs7O0FDQ0ssSUFBTVcsYUFBYSxTQUFiQSxVQUFhO1NBQVVDLE9BQU9DLE1BQVAsQ0FBYyxDQUFkLEVBQWlCQyxXQUFqQixLQUFpQ0YsT0FBT0csS0FBUCxDQUFhLENBQWIsQ0FBM0M7Q0FBbkI7O0FBRVAsQUFBTyxJQUFNQyxXQUFXLFNBQVhBLFFBQVc7U0FBVUosT0FBT0ssV0FBUCxHQUFxQkMsT0FBckIsQ0FBNkIsV0FBN0IsRUFBMEMsVUFBQ0MsQ0FBRCxF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