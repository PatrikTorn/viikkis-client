export const createActionPointers = (types = []) => {
	let list = {};
	types.map(type => {
		return list[type] = {
			NAME: type,
			PENDING: `${type}_PENDING`,
			FULFILLED: `${type}_FULFILLED`,
			REJECTED: `${type}_REJECTED`,
		}
	});
	return list;
};

export const API_ENDPOINT = 'https://indecs.fi/viikkis/api.php';
export const SOCKET_ENDPOINT = 'http://viikkis.herokuapp.com';
