package org.lovebing.reactnative.baidumap;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;

/**
 * Created by chenwenyu on 17-4-12.
 */

public class MyOrientationListener implements SensorEventListener {
    private Context context;
    private SensorManager sensorManager;
    private Sensor accelerometer; // 加速度传感器
    private Sensor magnetic; // 地磁场传感器
    private float lastDirection;

    private float[] accelerometerValues = new float[3];
    private float[] magneticFieldValues = new float[3];

    private OnOrientationListener onOrientationListener;

    public MyOrientationListener(Context context) {
        this.context = context;
    }

    // 开始
    public void start() {
        // 获得传感器管理器
        sensorManager = (SensorManager) context
                .getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            // 初始化加速度传感器
            accelerometer = sensorManager
                    .getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
            // 初始化地磁场传感器
            magnetic = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        }
        // 注册
        if (accelerometer != null) {
            sensorManager.registerListener(this,
                    accelerometer, Sensor.TYPE_ACCELEROMETER);
        }
        if (magnetic != null) {
            sensorManager.registerListener(this,
                    magnetic, Sensor.TYPE_MAGNETIC_FIELD);
        }
        calculateOrientation();
    }

    // 计算方向
    private void calculateOrientation() {
        float[] values = new float[3];
        float[] R = new float[9];
        SensorManager.getRotationMatrix(R, null, accelerometerValues,
                magneticFieldValues);
        SensorManager.getOrientation(R, values);
        float direction = (float) Math.toDegrees(values[0]);

        Log.i("direction", direction + "");
        if(values[0] < 0) {
            direction = 360  + direction;
        }
        if (Math.abs(direction - lastDirection) >= 30) {
            onOrientationListener.onOrientationChanged(direction);
            onOrientationListener.onOrientationChanged(direction);
        }
        lastDirection = direction;
    }

    // 停止检测
    public void stop() {
        if(sensorManager != null){
            sensorManager.unregisterListener(this);
	}
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        // TODO Auto-generated method stub
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            accelerometerValues = event.values;
        }
        if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            magneticFieldValues = event.values;
        }
        calculateOrientation();
    }

    public void setOnOrientationListener(OnOrientationListener onOrientationListener) {
        this.onOrientationListener = onOrientationListener;
    }


    public interface OnOrientationListener {
        void onOrientationChanged(float direction);
    }
}
