const server = __DEV__? 'http://localhost:8202/api/v1' : 'http://api.saas-plat.com/v1';
const file = __DEV__? 'http://localhost:8202/api/v1' : 'http://file.saas-plat.com';

export default {
	version: server+'/app/version',
	dev: server+'/app/dev',
	bundle: file+'/bundle/file'
};
