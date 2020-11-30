let jwt = require('jsonwebtoken');

module.exports = class TokenManager{
	constructor() {
		this.private = Math.random().toString(36).substring(2, 15);
		this.tokens = new Map();
	}

	createToken(userId, gamekey){
		var info = new Object({userId: userId, key: gamekey});
		var token = jwt.sign(info, this.private, { expiresIn: 60 });
		this.tokens.set(token, info);
		return token;
	}

	verifyToken(token){
		if(token == null)
			return null;
		var obj = this.tokens.get(token);
		if(obj == null)
			return null;
		this.tokens.delete(token);
		return obj;
	}
}
