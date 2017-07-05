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

import MapTypes from './MapTypes';

if (Platform.OS !== 'web') {
  var react_native = require('react-native');
  var RCTBaiduMapView = react_native.UIManager.RCTBaiduMapView;
  var Commands = RCTBaiduMapView.Commands;
  var COMMAND_UPDATE_MARKER = Commands.updateMaker;
  var COMMAND_UPDATE_CENTER = Commands.updateCenter;
}

export default class MapView extends Component {
  static propTypes = {
    ...View.propTypes,
    id: PropTypes.string,
    callback: PropTypes.func,
    zoomControlsVisible: PropTypes.bool,
    trafficEnabled: PropTypes.bool,
    baiduHeatMapEnabled: PropTypes.bool,
    mapType: PropTypes.number,
    zoom: PropTypes.number,
    center: PropTypes.object,
    local: PropTypes.object,
    marker: PropTypes.object,
    markers: PropTypes.array,
    childrenPoints: PropTypes.array,
    onMapStatusChangeStart: PropTypes.func,
    onMapStatusChange: PropTypes.func,
    onMapStatusChangeFinish: PropTypes.func,
    onMapLoaded: PropTypes.func,
    onMapClick: PropTypes.func,
    onMapDoubleClick: PropTypes.func,
    onMarkerClick: PropTypes.func,
    onMapPoiClick: PropTypes.func
  };

  static defaultProps = {
    callback: map => map.centerAndZoom('杭州', 15), // 当检测到 Web 的 BMap 加载完毕后执行
    zoomControlsVisible: true,
    trafficEnabled: false,
    baiduHeatMapEnabled: false,
    mapType: MapTypes.NORMAL,
    childrenPoints: [],
    marker: null,
    markers: [],
    center: null,
    local: null,
    zoom: 10
  };

  constructor() {
    super();
  }

  _onChange(event) {
    if (typeof this.props[event.nativeEvent.type] === 'function') {
      this.props[event.nativeEvent.type](event.nativeEvent.params);
    }
  }

  updateMarker(marker) {
    if (Platform.OS !== 'web') {
      react_native.UIManager.dispatchViewManagerCommand(react_native.findNodeHandle(this), COMMAND_UPDATE_MARKER, [marker]);
    }
  }

  updateCenter(center) {
    if (Platform.OS !== 'web') {
      react_native.UIManager.dispatchViewManagerCommand(react_native.findNodeHandle(this), COMMAND_UPDATE_CENTER, [center]);
    }
  }

  componentWillMount() {
    this.id = `itminus_bmap${parseInt('' + Math.random() * 10000000, 10)}`;
  }

  componentDidMount() {
    if (Platform.OS === 'web') {
      // 因 BMap.Map() 自带的 click 事件会连续触发两次，所以还是用 element 的 onclick 了
      document.getElementById(this.id).onclick = e => this.props.onMapClick && this.props.onMapClick();

      const map = new BMap.Map(this.id);
      map.enableScrollWheelZoom(true);
      this.props.callback(map);
    }
  }

  render() {
    if (Platform.OS === 'web') {
      return React.createElement('div', {
        style: this.props.style,
        id: this.id
      });
    } else {
      return <BaiduMapView {...this.props} onChange={this._onChange.bind(this)}/>;
    }
  }
}

if (Platform.OS !== 'web') {
  var BaiduMapView = requireNativeComponent('RCTBaiduMapView', MapView, {
    nativeOnly: {
      onChange: true
    }
  });
}
