import {Platform} from 'react-native';

const backgroundColor = opacity => 'rgba(78, 78, 78, ' + opacity + ')';
const textColor = 'white';
const rowGutter = 1;
const rowHeight = 46;

export default {
  backgroundColor,
  fullScreen : {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  inspector : {
    backgroundColor: backgroundColor(0.95),
    flex: 1
  },
  inspectorContainer : {
    flex: 1
  },
  inspectorButtons : {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  inspectorButton : {
    flex: 1,
    padding: 22
  },
  inspectorButtonText : {
    color: textColor,
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center'
  },
  inspectorContent : {
    flex: 1,
    paddingTop: 5
  },
  inspectorCount : {
    padding: 15,
    paddingBottom: 0
  },
  inspectorCountText : {
    color: textColor,
    fontSize: 14
  },
  inspectorList : {
    padding: 15,
    position: 'absolute',
    top: 39,
    left: 0,
    right: 0,
    bottom: 60
  },
  inspectorListContainer : {},
  inspectorRow : {
    height: 36,
    marginTop: rowGutter
  },
  inspectorRowText : {
    color: textColor,
    fontSize: 16,
    fontWeight: '600'
  },
  inspectorRowContent : {
    flex: 1
  },
  tip : {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: rowHeight
  },
  tipRow : {
    position: 'relative',
    backgroundColor: backgroundColor(0.95),
    flex: 1,
    height: rowHeight,
    marginTop: rowGutter
  },
  tipRowContent : {
    flex: 1
  },
  tipRowCount : {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  tipRowText : {
    color: textColor,
    position: 'absolute',
    left: 0,
    top: Platform.OS === 'android'
      ? 5
      : 7,
    marginLeft: 15,
    marginRight: 15
  }
};
