import request from 'request';

console.error(`host is ${process.env.REACT_APP_SERVICE_HOST}`);

function fetchGqlData(endpoint, gqlQueryBody, callback) {
    const host = process.env.REACT_APP_SERVICE_HOST;
    const { query, variables } = gqlQueryBody;

    const POST = {
        url: `${host}/api/${endpoint}`,
        method: "POST",
        json: true,
        withCredentials: false,
        body: { query, variables }
    };

    console.error(`host is ${host}`);

    request(POST, callback);
}

module.exports = {
    fetchGqlData
};