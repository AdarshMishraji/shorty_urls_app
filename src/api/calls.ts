import axios from 'axios';

import { Authorization } from './config';

import { endpoints } from '.';

export const authenticate = async (
  { token }:
  { token: string }
): Promise<any> => await axios.post(
  endpoints.authenticate,
  { token },
  { headers: { Authorization } }
);

export const generateURL = async (
  {
    accessToken,
    url
  }: {
    url: string
    accessToken: string
  }
): Promise<any> => await axios
  .post(
    endpoints.manage.generateURL,
    { url },
    {
      headers: {
        Authorization,
        access_token: accessToken
      }
    }
  );

export const fetchMeta = async (
  {
    accessToken,
    withoutAuth
  }: {
    withoutAuth: boolean
    accessToken: string
  }
): Promise<any> => await axios
  .get(`${endpoints.meta}?withoutAuth=${String(withoutAuth)}`, {
    headers: {
      Authorization,
      access_token: accessToken
    }
  });

export const fetchMyURLs = async (
  {
    accessToken,
    limit,
    query,
    skipCount
  }: {
    limit: number
    skipCount: boolean
    query?: string
    accessToken: string
  }
): Promise<any> => {
  const queryString = query ? `&query=${query}` : '';
  const url = `${endpoints.my.urls}?limit=${limit}&skip=${String(skipCount)}${queryString}`;
  return await axios
    .get(url, {
      headers: {
        Authorization,
        access_token: accessToken
      }
    });
};

export const fetchMyParticularURL = async (
  {
    urlID,
    accessToken
  }: {
    urlID: string
    accessToken: string
  }
): Promise<any> => {
  const url = `${endpoints.my.url}/${urlID}`;
  return await axios
    .get(url, {
      headers: {
        Authorization,
        access_token: accessToken
      }
    });
};

export const changeStatus = async (
  {
    accessToken,
    status,
    urlID
  }:
  { urlID: string
    status: boolean
    accessToken: string
  }
): Promise<any> => await axios
  .patch(
    endpoints.manage.updateURLStatus,
    { urlID, status },
    {
      headers: {
        Authorization,
        access_token: accessToken
      }
    }
  );

export const deleteURL = async (
  {
    urlID,
    accessToken
  }:
  { urlID: string
    accessToken: string
  }
): Promise<any> => await axios
  .delete(endpoints.manage.deleteURL, {
    data: {
      urlID
    },
    headers: {
      Authorization,
      access_token: accessToken
    }
  });

export const updatePassword = async (
  {
    accessToken,
    password,
    urlID
  }:
  {
    urlID: string
    password: string
    accessToken: string
  }
): Promise<any> => await axios
  .patch(
    endpoints.manage.updatePassword,
    { urlID, password },
    {
      headers: {
        Authorization,
        access_token: accessToken
      }
    }
  );

export const removePassword = async (
  {
    accessToken,

    urlID
  }:
  {
    urlID: string
    accessToken: string
  }
): Promise<any> => await axios
  .delete(endpoints.manage.removePassword, {
    headers: {
      Authorization,
      access_token: accessToken
    },
    data: {
      urlID
    }
  });

export const setExpiration = async (
  {
    accessToken,
    expiredAt,
    urlID
  }:
  {
    urlID: string
    expiredAt: Date
    accessToken: string
  }

): Promise<any> => await axios
  .patch(
    endpoints.manage.setExpiration,
    {
      urlID,
      expired_at: expiredAt
    },
    {
      headers: {
        Authorization,
        access_token: accessToken
      }
    }
  );

export const changeAlias = async (
  {
    accessToken,
    alias,
    urlID
  }:
  { urlID: string
    alias: string
    accessToken: string
  }
): Promise<any> => await axios
  .patch(
    endpoints.manage.changeAlias,
    {
      urlID,
      alias
    },
    {
      headers: {
        Authorization,
        access_token: accessToken
      }
    }
  );
