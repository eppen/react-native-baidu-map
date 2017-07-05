import {
  NativeModules,
  DeviceEventEmitter
} from 'react-native';

const NativeOrientation = NativeModules.OrientationModule;

export default {

    startOrientation() {
        return new Promise((resolve, reject) => {
            try {
                NativeOrientation.startOrientation();
            }
            catch (e) {
                reject(e);
                return;
            }
        });
    },
    addOrientationListener(handler) {
        DeviceEventEmitter.addListener('onOrientationChanged', resp => {
            handler(resp);
        });
    },
    stopOrientation() {
        try {
            NativeOrientation.stopOrientation();
        } catch (e) {
        }
    }
};
