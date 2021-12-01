import axios from "axios";
import { endpoints } from ".";
import { Authorization } from "./config";

export const authenticate = (token, onSuccess, onError, onEnd) => {
    axios
        .post(endpoints.authenticate, { token }, { headers: { Authorization } })
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const generateURL = (url, access_token, onSuccess, onError, onEnd) => {
    axios
        .post(
            endpoints.manage.generateURL,
            { url },
            {
                headers: {
                    Authorization,
                    access_token,
                },
            }
        )
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const fetchMeta = (withoutAuth, access_token, onSuccess, onError, onEnd) => {
    axios
        .get(`${endpoints.meta}?withoutAuth=${withoutAuth}`, {
            headers: {
                Authorization,
                access_token,
            },
        })
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const fetchMyURLs = (limit, skipCount, query, access_token, onSuccess, onError, onEnd) => {
    const url = `${endpoints.my.urls}?limit=${limit}&skip=${skipCount}${query ? `&query=${query}` : ""}`;
    axios
        .get(url, {
            headers: {
                Authorization,
                access_token,
            },
        })
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const fetchMyParticularURL = (urlID, access_token, onSuccess, onError, onEnd) => {
    const url = `${endpoints.my.url}/${urlID}`;
    axios
        .get(url, {
            headers: {
                Authorization,
                access_token,
            },
        })
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const changeStatus = (urlID, status, access_token, onSuccess, onError, onEnd) => {
    axios
        .patch(
            endpoints.manage.updateURLStatus,
            { urlID, status },
            {
                headers: {
                    Authorization,
                    access_token,
                },
            }
        )
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const deleteURL = (urlID, access_token, onSuccess, onError, onEnd) => {
    axios
        .delete(endpoints.manage.deleteURL, {
            data: {
                urlID,
            },
            headers: {
                Authorization,
                access_token,
            },
        })
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const updatePassword = (urlID, password, access_token, onSuccess, onError, onEnd) => {
    axios
        .patch(
            endpoints.manage.updatePassword,
            { urlID, password },
            {
                headers: {
                    Authorization,
                    access_token,
                },
            }
        )
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const removePassword = (urlID, access_token, onSuccess, onError, onEnd) => {
    axios
        .delete(
            endpoints.manage.removePassword,
            { urlID },
            {
                headers: {
                    Authorization,
                    access_token,
                },
            }
        )
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const setExpiration = (urlID, expired_at, access_token, onSuccess, onError, onEnd) => {
    axios
        .patch(
            endpoints.manage.setExpiration,
            {
                urlID,
                expired_at,
            },
            {
                headers: {
                    Authorization,
                    access_token,
                },
            }
        )
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};

export const changeAlias = (urlID, alias, access_token, onSuccess, onError, onEnd) => {
    axios
        .patch(
            endpoints.manage.changeAlias,
            {
                urlID,
                alias,
            },
            {
                headers: {
                    Authorization,
                    access_token,
                },
            }
        )
        .then((res) => onSuccess(res))
        .catch((e) => onError(e))
        .finally(() => onEnd?.());
};
