import { BASE_URL } from "./config";

export const endpoints = {
    authenticate: `${BASE_URL}authenticate`,
    manage: {
        generateURL: `${BASE_URL}manage/generate_short_url`,
        changeAlias: `${BASE_URL}manage/change_alias`,
        updateURLStatus: `${BASE_URL}manage/update_url_status`,
        setExpiration: `${BASE_URL}manage/set_expiration_time`,
        updatePassword: `${BASE_URL}manage/update_password`,
        removePassword: `${BASE_URL}manage/remove_password`,
        deleteURL: `${BASE_URL}manage/delete_url`,
    },
    meta: `${BASE_URL}meta`,
    my: {
        urls: `${BASE_URL}my/urls`,
        url: `${BASE_URL}my/url`,
    },
};
