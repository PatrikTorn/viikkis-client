import axios from "axios"

export const Method = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
	PATCH: "PATCH",
	HEAD: "HEAD",
    MULTIPARTPOST: "MULTIPARTPOST",
    ALL: "ALL"
};

export const request = (method, url, data, config) => {
	let payload;

	switch(method) {
		case Method.GET:
			payload = axios.get(url, config);
			break;
		case Method.POST:
			payload = axios.post(url, data, config);
			break;
		case Method.PUT:
			payload = axios.put(url, data, config);
			break;
		case Method.DELETE:
			payload = axios.delete(url, config);
			break;
		case Method.PATCH:
			payload = axios.patch(url, data, config);
			break;
		case Method.HEAD:
			payload = axios.head(url, config);
            break;
		case Method.MULTIPARTPOST:
			config.headers = {'content-type': 'multipart/form-data'};
			payload = axios.post(url, data, config);
			break;
		default:
			payload = data;
			break;
	}
	return payload;
};
