package org.lovebing.reactnative.baidumap;

import android.os.Bundle;
import android.util.Log;
import android.widget.Button;

import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.MarkerOptions.MarkerAnimateType;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by lovebing on Sept 28, 2016.
 */
public class MarkerUtil {

    public static void updateMaker(Marker maker, ReadableMap option) {
        LatLng position = getLatLngFromOption(option);
        maker.setPosition(position);
        maker.setTitle(option.getString("title"));
        Bundle bundle = new Bundle();
        bundle.putString("bizId",option.getString("bizId"));//业务Id
	    int icon = selectedImage(option);
        BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(icon);
        maker.setExtraInfo(bundle);
	    maker.setIcon(bitmap);
	    maker.setDraggable(false);
    }

    public static Marker addMarker(MapView mapView, ReadableMap option) {
	    int icon = selectedImage(option);
        BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(icon);
        Bundle bundle = new Bundle();
        bundle.putString("bizId",option.getString("bizId"));//业务ID
        LatLng position = getLatLngFromOption(option);
        OverlayOptions overlayOptions = new MarkerOptions()
		.animateType(MarkerAnimateType.grow)
                .icon(bitmap)
                .position(position)
                .extraInfo(bundle)
                .title(option.getString("title"));
        Marker marker = (Marker)mapView.getMap().addOverlay(overlayOptions);
        marker.setExtraInfo(bundle);
        marker.setDraggable(false);
        return marker;
    }
    
    private static int selectedImage(ReadableMap option) {
        int icon;
        int status = 2;
        if(!option.hasKey("status")) {
            status = 2;
        } else {
            status = option.getInt("status");
        }
        if(status == 0) {
            icon = R.mipmap.map_green;
        } else if(status == 1){
            icon = R.mipmap.map_or;
        } else if(status == 2){
            icon = R.mipmap.icon_gcoding;
         } else if(status == 3){
            icon = R.mipmap.map_water;
        } else {
            icon = R.mipmap.icon_gcoding;
        }
        return icon;
    }

    private static LatLng getLatLngFromOption(ReadableMap option) {
        double latitude = option.getDouble("latitude");
        double longitude = option.getDouble("longitude");
        return new LatLng(latitude, longitude);

    }
}
