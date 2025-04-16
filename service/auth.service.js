const jwt = require('jsonwebtoken')
const secret = "Yashvi1212"

const sessionIdToUserMap = new Map()
	function setUser(id, user) {
		const payload = {
            id,
            ...user
        }
        return jwt.sign(payload, "secret");
	}

	function getUser(id) {
		return sessionIdToUserMap.get(id);
	}

module.exports = {
    setUser,
    getUser
}