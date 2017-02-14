import {Dimensions} from 'react-native';
import {themeStore} from 'saasplat-native';

const {width} = Dimensions.get('window');
const colors = themeStore.currentTheme.common.colors;

export default {
  container : {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.LIGHT_GREY
  },
  header : {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    backgroundColor: 'transparent'
  },
  headerText : {
    fontSize: 20,
    marginTop: 30,
    color: colors.GREY
  },
  loginFormContainer : {
    flex: 5,
    paddingLeft: (width * 0.1),
    paddingRight: (width * 0.1)
  },

  inputUsername : {
    marginLeft: 15,
    width: 20,
    height: 18
  },
  inputPassword : {
    marginLeft: 15,
    width: 20,
    height: 18
  },
  inputSelectUsername : {
    marginRight: 15,
    width: 20,
    height: 18
  },
  inputContainer : {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15
  },
  input : {
    flex: 1,
    left: 20,
    fontSize: 14,
    color: colors.GREY
  },
  userList : {},
  userListItem : {},
  userIcon : {},
  footer : {
    height: 30,
    flexDirection: 'row'
  },
  left : {
    flex: 1,
    paddingLeft: 20
  },
  right : {
    paddingRight: 20
  }
};
