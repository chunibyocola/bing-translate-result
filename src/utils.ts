import { CONNECTION_TIMED_OUT, BAD_REQUEST } from './error-codes';

export const getError = (code: string) => {
    let error: any = new Error();

    error.code = code;

    return error;
};

export const fetchData = async (url: string, init = {}) => {
    const res = await fetch(url, init).catch(() => { throw getError(CONNECTION_TIMED_OUT) });

    if (!res.ok) throw getError(`${BAD_REQUEST} ${res.status}`);

    return res;
};