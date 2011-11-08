module.exports = {
	name: 'Home',
	description: 'Home',
	controllerFactories: [require('./controller').createRoutes],
	publicFolder: 'public'
};