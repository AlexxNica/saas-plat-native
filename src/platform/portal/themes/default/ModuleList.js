import {Platform} from 'react-native';

export default {
  container : {
    flex: 1,
    backgroundColor: '#fff'
  },
  grid : {
    // 导航条高度
    ...Platform.select({
      ios: {
        marginTop: 64
      },
      android: {
        marginTop: 54
      }
    })
  },  
  cell : {
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon : {
    height: 40,
    width: 40
  },
  text : {
    fontSize: 16,
    textAlign: 'center',
    color: '#111'
  }
};
