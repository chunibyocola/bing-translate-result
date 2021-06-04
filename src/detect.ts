import { fetchData, getError } from './utils';
import { RESULT_ERROR } from './error-codes';
import { DetectParameter, DetectResult } from './types';
import { getTokenAndKey } from './getTokenAndKey';

 export const detect = async ({ text, com = true }: DetectParameter): Promise<DetectResult> => {
    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3`;

    const { token, key } = await getTokenAndKey(com);

    let searchParams = new URLSearchParams();
    searchParams.append('fromLang', 'auto-detect');
    searchParams.append('text', text);
    searchParams.append('to', 'en');
    searchParams.append('token', token);
    searchParams.append('key', key.toString());

    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data = await res.json();

        const langCode = data[0].detectedLanguage.language;

        return langCode;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};