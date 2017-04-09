const server = __DEV__? 'http://localhost:8202/api/v1' : 'http://api.saas-plat.com/v1';

export default {
	version: server+'/app/version',
	dev: server+'/app/dev',
	bundle: server+'/bundle/file'
};
