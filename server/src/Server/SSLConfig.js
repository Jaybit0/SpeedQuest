var fs = require('fs');

SSLConfig = {
	useSSL: false
};
if(SSLConfig.useSSL){
	SSLConfig.sslOptions = {
		key: fs.readFileSync('./ssl/project-talk_me.key'),
		cert: fs.readFileSync('./ssl/project-talk_me.crt')
	};
}
module.exports.SSLConfig = SSLConfig;