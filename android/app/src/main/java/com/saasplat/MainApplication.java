package com.saasplat;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.rnziparchive.RNZipArchivePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.remobile.splashscreen.RCTSplashScreenPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.remobile.splashscreen.RCTSplashScreenPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.remobile.splashscreen.*;
import com.oblador.vectoricons.VectorIconsPackage;
import cn.reactnative.modules.jpush.JPushPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rnfs.RNFSPackage;
//import com.rnziparchive.RNZipArchivePackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNZipArchivePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new ReactNativeI18n(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new RCTCameraPackage(),
            new BlurViewPackage(),
            new RCTSplashScreenPackage(),
            new BlurViewPackage(),
            new RNZipArchivePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new ReactNativeI18n(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new RCTCameraPackage(),
            new RCTSplashScreenPackage(),
            new JPushPackage(),
            new JPushPackage(),
            new RNDeviceInfo(),
            new RNFSPackage(),
            new RNZipArchivePackage(),
            new RCTCameraPackage(),
            new ReactVideoPackage(),
            new RCTSplashScreenPackage(this),
            new VectorIconsPackage(),
            new ReactNativeI18n()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
