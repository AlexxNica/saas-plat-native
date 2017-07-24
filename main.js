export class AppRegistry {
  static appLoader;
  static registerComponent(appLoader) {
    this.appLoader = appLoader;
  }
}
