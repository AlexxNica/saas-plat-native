/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <RCTJPushModule/RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <RCTSplashScreen/RCTSplashScreen.h>

#import <sys/sysctl.h>

@implementation AppDelegate

- (NSString *)platform{
    size_t size;
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);
    char *machine = malloc(size);
    sysctlbyname("hw.machine", machine, &size, NULL, 0);
    NSString *platform = [NSString stringWithCString:machine encoding:NSUTF8StringEncoding];
    free(machine);
    return platform;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  [[RCTBundleURLProvider sharedSettings] setDefaults];
  #if DEBUG
  [[RCTBundleURLProvider sharedSettings] setJsLocation:@"test.saas-plat.com"];
  #endif
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];


  // root view
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Saasplat"
                                               initialProperties:nil
                                                  launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  // show SplashScreen
  BOOL debugMode = [[NSUserDefaults standardUserDefaults] boolForKey:@"debugMode"];
  // 调试模式下不显示启动画面
  if (debugMode == NO){
    [RCTSplashScreen show:rootView
                 imageUrl:[@"http://api.saas-plat.com/app/splash?p=" stringByAppendingString:[self platform]]
     ];
  }

  //jpush
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
   JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];

#endif
} else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
   [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                     UIUserNotificationTypeSound |
                                                     UIUserNotificationTypeAlert)
                                         categories:nil];
 } else {
   [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                     UIRemoteNotificationTypeSound |
                                                     UIRemoteNotificationTypeAlert)
                                         categories:nil];
 }

 [JPUSHService setupWithOption:launchOptions appKey:appKey
                       channel:channel apsForProduction:isProduction];

  //
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}
// // iOS 10 Support
// - (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
//    NSDictionary * userInfo = notification.request.content.userInfo;
//    if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//      [JPUSHService handleRemoteNotification:userInfo];
//      [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
//     }
//    completionHandler(UNNotificationPresentationOptionAlert);
// }
// // iOS 10 Support
// - (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
//   NSDictionary * userInfo = response.notification.request.content.userInfo;
//   if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//     [JPUSHService handleRemoteNotification:userInfo];
//     [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
//   }
//   completionHandler();
// }
@end
