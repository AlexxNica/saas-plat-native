import {
  Platform,
  PixelRatio
} from 'react-native';

export function registerAssets(assets) {
  if (assets.length <= 0) {
    return null;
  }
  var platform = Platform.OS;
  var scale = PixelRatio.get();
  var alterasset = null;
  var theasset;
  for (const asset of assets) {
    if (!asset.platform || asset.platform === platform) {
      if (scale === asset.scale) {
        theasset = asset;
        break;
      }
      if (alterasset === null) {
        alterasset = asset;
      } else {
        const diff = Math.abs(asset.scale - scale) - Math.abs(alterasset.scale - scale);
        if (diff < 0 || (diff === 0 && asset.scale > alterasset.scale)) { // 精度差小的或相等取分辨率大的
          alterasset = asset;
        }
      }
    }
  }
  return (theasset || alterasset).source;
}
