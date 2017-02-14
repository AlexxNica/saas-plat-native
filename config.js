const server = __DEV__? 'http://test.saas-plat.com:8202' : 'http://api.saas-plat.com'; 

export default {
	version: server+'/app/version',
	bundle: server+'/bundle/file'
};
