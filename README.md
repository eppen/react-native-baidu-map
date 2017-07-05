# react-native-baidu-map [![npm version](https://img.shields.io/npm/v/react-native-baidu-map.svg?style=flat)](https://www.npmjs.com/package/react-native-baidu-map)

Baidu Map SDK modules and view for React Native(Android & IOS), support react native 0.40+

百度地图 React Native 模块，支持 react native 0.40+

![Android](https://raw.githubusercontent.com/lovebing/react-native-baidu-map/master/images/android.jpg)
![IOS](https://raw.githubusercontent.com/lovebing/react-native-baidu-map/master/images/ios.jpg)

### Install 安装
    npm install react-native-baidu-map --save
### Import 导入

#### Android Studio
- settings.gradle `
include ':react-native-baidu-map'
project(':react-native-baidu-map').projectDir = new File(settingsDir, '../node_modules/react-native-baidu-map/android')`

- build.gradle `compile project(':react-native-baidu-map')`

- MainApplication`new BaiduMapPackage(getApplicationContext())`
- AndroidMainifest.xml `<meta-data
            android:name="com.baidu.lbsapi.API_KEY" android:value="xx"/>`

#### Xcode
- Project navigator->Libraries->Add Files to 选择 react-native-baidu-map/ios/RCTBaiduMap.xcodeproj
- Project navigator->Build Phases->Link Binary With Libraries 加入 libRCTBaiduMap.a
- Project navigator->Build Settings->Search Paths， Framework search paths 添加 react-native-baidu-map/ios/lib，Header search paths 添加 react-native-baidu-map/ios/RCTBaiduMap
- 添加依赖, react-native-baidu-map/ios/lib 下的全部 framwordk， CoreLocation.framework和QuartzCore.framework、OpenGLES.framework、SystemConfiguration.framework、CoreGraphics.framework、Security.framework、libsqlite3.0.tbd（xcode7以前为 libsqlite3.0.dylib）、CoreTelephony.framework 、libstdc++.6.0.9.tbd（xcode7以前为libstdc++.6.0.9.dylib）
- 添加 BaiduMapAPI_Map.framework/Resources/mapapi.bundle

- 其它一些注意事项可参考百度地图LBS文档

##### AppDelegate.m init 初始化
    #import "RCTBaiduMapViewManager.h"
    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {
        ...
        [RCTBaiduMapViewManager initSDK:@"api key"];
        ...
    }

#### Web
需要在 github.com/taobaofed/react-web 所形成的 web/webpack.config.js 中修改成如下内容：
```
    new HtmlPlugin({
      template: path.join(__dirname, 'index.html')
    }),
```
同时也在 react-web 自动生成的原始 index.html 中添加一个 `<script src="https://api.map.baidu.com/api?v=1.4&ak="></script>` 成为类似如下的 web/index.html 文件：
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <title>Webpack App</title>


  </head>
  <body>

    <script src="https://api.map.baidu.com/api?v=1.4&ak="></script>
    <script src="bundle.js"></script>

  </body>
</html>
```

最后使用下面的 callback 属性为例如 callback={map => {map.centerAndZoom('杭州', 15)}} 即可。

### Usage 使用方法

    import { MapView, MapTypes, MapModule, Geolocation } from 'react-native-baidu-map

#### MapView Props 属性
| Name                    | Type  | Default  | Extra
| ----------------------- |:-----:| :-------:| -------
| callback                | func  | `map => {map.centerAndZoom('杭州', 15)}` | Web only
| zoomControlsVisible     | bool  | true     | Android only
| trafficEnabled          | bool  | false    |
| baiduHeatMapEnabled     | bool  | false    |
| mapType                 | number| 1        |
| zoom                    | number| 10       |
| center                  | object| null     | {latitude: 0, longitude: 0}
| marker                  | object| null     | {latitude: 0, longitude: 0, title: ''}
| markers                 | array | []       | [marker, maker]
| onMapStatusChangeStart  | func  | undefined| Android only
| onMapStatusChange       | func  | undefined|
| onMapStatusChangeFinish | func  | undefined| Android only
| onMapLoaded             | func  | undefined|
| onMapClick              | func  | undefined|
| onMapDoubleClick        | func  | undefined|
| onMarkerClick           | func  | undefined|
| onMapPoiClick           | func  | undefined|

#### MapModule Methods (Deprecated)
    setMarker(double lat, double lng)
    setMapType(int mapType)
    moveToCenter(double lat, double lng, float zoom)
    Promise reverseGeoCode(double lat, double lng)
    Promise reverseGeoCodeGPS(double lat, double lng)
    Promise geocode(String city, String addr),
    Promise getCurrentPosition()

#### Geolocation Methods

| Method                    | Result
| ------------------------- | -------
| Promise reverseGeoCode(double lat, double lng) | `{"address": "", "province": "", "cityCode": "", "city": "", "district": "", "streetName": "", "streetNumber": ""}`
| Promise reverseGeoCodeGPS(double lat, double lng) |  `{"address": "", "province": "", "cityCode": "", "city": "", "district": "", "streetName": "", "streetNumber": ""}`
| Promise geocode(String city, String addr) | {"latitude": 0.0, "longitude": 0.0}
| Promise getCurrentPosition() | IOS: `{"latitude": 0.0, "longitude": 0.0, "address": "", "province": "", "cityCode": "", "city": "", "district": "", "streetName": "", "streetNumber": ""}` Android: `{"latitude": 0.0, "longitude": 0.0, "direction": -1, "altitude": 0.0, "radius": 0.0, "address": "", "countryCode": "", "country": "", "province": "", "cityCode": "", "city": "", "district": "", "street": "", "streetNumber": "", "buildingId": "", "buildingName": ""}`
