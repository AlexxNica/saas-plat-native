import {Platform} from 'react-native';

export default {
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  body : {
    flex: 1,
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

  text : {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 120,
    color: '#111'
  }
};
