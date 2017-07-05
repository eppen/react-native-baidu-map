package org.lovebing.reactnative.baidumap;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
/**
 * Created by chenwenyu on 17-4-12.
 */

public class OrientationModule extends BaseModule implements MyOrientationListener.OnOrientationListener {

    public static MyOrientationListener myOrientationListener;

    public String getName() {
        return "OrientationModule";
    }

    public OrientationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @ReactMethod
    public void startOrientation() {
        myOrientationListener = new MyOrientationListener(context.getApplicationContext());
        myOrientationListener.setOnOrientationListener(this);
        myOrientationListener.start();
    }

    @ReactMethod
    public void stopOrientation() {
        myOrientationListener.stop();
    }

    @Override
    public void onOrientationChanged(float direction) {
        WritableMap params = Arguments.createMap();
        params.putDouble("direction", (double)direction);
        sendEvent("onOrientationChanged", params);
    }
}

