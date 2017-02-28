package com.saasplat;

import java.util.Arrays;
import java.util.List;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.reactlibrary.RNDefaultPreferencePackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

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
import cn.jpush.reactnativejpush.JPushPackage;


public class MainApplication extends Application implements ReactApplication {
  private boolean SHUTDOWN_TOAST = false;
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      String url = "http://api.saas-plat.com/app/splash?p="+android.os.Build.MODEL;
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNDefaultPreferencePackage("saas-plat-settings"),
            new RNZipArchivePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new ReactNativeI18n(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new RCTCameraPackage(),
            new BlurViewPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
            new RCTSplashScreenPackage(MainActivity.activity, url)
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
