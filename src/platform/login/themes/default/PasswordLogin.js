import { Dimensions } from 'react-native';
import { themeStore } from 'saasplat-native';

const { width } = Dimensions.get('window');
const colors = themeStore.currentTheme.common.colors;

export default {
  scrollContainer:{
    flex: 1
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.white
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    backgroundColor: 'transparent'
  },
  headerText: {
    fontSize: 20,
    marginTop: 30,
    color: colors.primary
  },
  loginFormContainer: {
    flex: 5,
    paddingLeft: (width * 0.1),
    paddingRight: (width * 0.1)
  },
  inputUsername: {
    marginLeft: 15,
    width: 20,
    height: 18
  },
  inputPassword: {
    marginLeft: 15,
    width: 20,
    height: 18
  },
  inputSelectUsername: {
    marginRight: 15,
    width: 20,
    height: 18
  },
  inputContainer: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: colors.greyOutline,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15
  },
  input: {
    flex: 1,
    left: 20,
    fontSize: 14,
    padding: 2,
    height: 20,
    color: colors.primary
  },
  userList: {},
  userListItem: {},
  userIcon: {},
  footer: {
    height: 30,
    flexDirection: 'row'
  },
  left: {
    flex: 1,
    paddingLeft: 20
  },
  right: {
    paddingRight: 20
  },
  idle: {
    backgroundColor: 'blue',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  labelStyle: {
    color: 'white',
    alignSelf: 'center',
    marginLeft: 10
  },
  busy: {
    backgroundColor: 'darkblue',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  success: {
    backgroundColor: 'green',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  }
};
