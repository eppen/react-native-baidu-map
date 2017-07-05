import {
  requireNativeComponent,
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';


const _module = NativeModules.BaiduGeolocationModule;
const geolocationControl = Platform.OS === 'web' ? new BMap.GeolocationControl() : {};

export default {
  geolocationControl,
  geocode(city, addr) {
    if (Platform.OS === 'web') {
      return new Promise((resolve, reject) => {
        try {
          const geo = new BMap.Geocoder();
          geo.getPoint(addr, function(resp) {
            if (resp) {
              resolve({
                longitude: resp.lng,
                latitude: resp.lat
              });
            } else {
              reject(resp);
            }
          }, city);
        } catch (e) {
          reject(e);
          return;
        }
      });
    }
    return new Promise((resolve, reject) => {
      try {
        _module.geocode(city, addr);
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onGetGeoCodeResult', resp => {
        resolve(resp);
      });
    });
  },
  reverseGeoCode(lat, lng) {
    return new Promise((resolve, reject) => {
      try {
        _module.reverseGeoCode(lat, lng);
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onGetReverseGeoCodeResult', resp => {
        resolve(resp);
      });
    });
  },
  reverseGeoCodeGPS(lat, lng) {
    return new Promise((resolve, reject) => {
      try {
        _module.reverseGeoCodeGPS(lat, lng);
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onGetReverseGeoCodeResult', resp => {
        resp.latitude = parseFloat(resp.latitude);
        resp.longitude = parseFloat(resp.longitude);
        resolve(resp);
      });
    });
  },
  getCurrentPosition() {
    if (Platform.OS === 'web') {
      return new Promise((resolve, reject) => {
        try {
          geolocationControl.addEventListener('locationSuccess', resp => {
            resolve({
              longitude: resp.point.lng,
              latitude: resp.point.lat,
              address: resp.addressComponent.province + resp.addressComponent.city + resp.addressComponent.district + resp.addressComponent.street + resp.addressComponent.streetNumber,
              province: resp.addressComponent.province,
              city: resp.addressComponent.city,
              district: resp.addressComponent.district,
              street: resp.addressComponent.street
            });
          });
          geolocationControl.addEventListener('locationError', resp => {
            reject(resp);
          });
          geolocationControl.location();
        } catch (e) {
          reject(e);
          return;
        }
      });
    }
    if (Platform.OS === 'ios') {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          try {
            _module.reverseGeoCodeGPS(position.coords.latitude, position.coords.longitude);
          }
          catch (e) {
            reject(e);
            return;
          }
          DeviceEventEmitter.once('onGetReverseGeoCodeResult', resp => {
            resp.latitude = parseFloat(resp.latitude);
            resp.longitude = parseFloat(resp.longitude);
            resolve(resp);
          });
        }, (error) => {
          reject(error);
        }, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        });
      });
    }
    return new Promise((resolve, reject) => {
      try {
        _module.getCurrentPosition();
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onGetCurrentLocationPosition', resp => {
        resolve(resp);
      });
    });
  },
  addOnGetCurrentLocationPosition(handler) {
    DeviceEventEmitter.addListener('onGetCurrentLocationPosition', resp => {
        handler(resp);
      });
  }
};
