"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _imagePreview = _interopRequireDefault(require("./image-preview"));

var instance;

var initInstance = function initInstance() {
  instance = new (_vue.default.extend(_imagePreview.default))({
    el: document.createElement('div')
  });
  document.body.appendChild(instance.$el);
};

var ImagePreview = function ImagePreview(images, startPosition) {
  if (!instance) {
    initInstance();
  }

  var config = Array.isArray(images) ? {
    images: images,
    startPosition: startPosition
  } : images;
  instance.images = config.images;
  instance.startPosition = config.startPosition || 0;
  instance.value = true;
  instance.$on('input', function (show) {
    instance.value = show;

    if (!show) {
      instance.$off('input');
      config.onClose && config.onClose();
    }
  });
  return instance;
};

ImagePreview.install = function () {
  _vue.default.use(_imagePreview.default);
};

var _default = ImagePreview;
exports.default = _default;