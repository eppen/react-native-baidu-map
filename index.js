import {
  requireNativeComponent,
  View,
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';

import _MapTypes from './js/MapTypes';
import _MapView from './js/MapView';
import _MapModule from './js/MapModule';
import _Geolocation from './js/Geolocation';
import _Orientation from './js/Orientation';

export const MapTypes = _MapTypes;
export const MapView = _MapView;
export const MapModule = _MapModule;
export const Geolocation = _Geolocation;
export const Orientation = _Orientation;
