import * as themes from '@shoutem/theme';
import React from 'react';
import ThemeStore from '../stores/Theme';

// function findParentInstanceBundleName(ele) {
//   const parent = ele && ele._reactInternalInstance && ele._reactInternalInstance._currentElement && ele._reactInternalInstance._currentElement._owner && ele._reactInternalInstance._currentElement._owner._instance;
//   if (!parent) {
//     return null;
//   }
//   if (parent.props && parent.props.bundleName) {
//     return parent.props.bundleName;
//   } else {
//     findParentInstanceBundleName(parent);
//   }
// }

function connectTheme(themeName, styles, WrappedComponent) {
  if (!styles) {
    const ThemeComponent = class extends React.Component {
      render() {
        const props = this.props;
        // 需要动态绑定主题
        const currentTheme = ThemeStore.getStore().currentTheme;
        let themeStyle;
        if (themeName) {
          const bundleName = WrappedComponent.$packageName;
          if (!currentTheme[themeName]) {
            // 自动补全命名空间
            if (bundleName) {
              const bundleTheme = `${bundleName}.${themeName}`;
              if (currentTheme[bundleTheme]) {
                themeName = bundleTheme;
              }
            }
          }
          // 当前的主题
          const theStyles = currentTheme[themeName] || {};
          // 系统的common
          const extStyles = currentTheme.common || {};
          // 支持包内的common
          const bcStyles = (bundleName && currentTheme[
            `${bundleName}.common`]) || {};
          themeStyle = {
            ...extStyles,
            ...bcStyles,
            ...theStyles
          };
        } else {
          themeStyle = currentTheme.common || {};
        }
        const {
          style,
          ...otherProps
        } = props;
        return <WrappedComponent
          {...otherProps}
          style={{
          ...themeStyle,
          ...style
        }}>{props.children}</WrappedComponent>;
      };
    }
    ThemeComponent.$packageName = WrappedComponent.$packageName;
    return ThemeComponent;
  }
  const ThemeComponent = themes.connectStyle(themeName, styles)(WrappedComponent);
  ThemeComponent.$packageName = WrappedComponent.$packageName;
  ThemeComponent.$packageVersion = WrappedComponent.$packageVersion;
  return ThemeComponent;
}

export function connectStyle(themeName, styles = null) {
  if (typeof themeName === 'string') {
    return (WrappedComponent) => connectTheme(themeName, styles,
      WrappedComponent);
  } else {
    return connectTheme('common', styles, themeName);
  }
}
