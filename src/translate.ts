import { fetchData, getError } from './utils';
import { langCode } from './lang-code';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from './error-codes';
import { detect } from './detect';
import { TranslateParameter, TranslateResult } from './types';
import { getTokenAndKey } from './getTokenAndKey';

export const translate = async ({ text, from = '', to = '', userLang = '', com = true, autoDetect = true }: TranslateParameter): Promise<TranslateResult> => {
    userLang = userLang || 'en';
    userLang = langCodeSwitch(userLang);
    from = from || (autoDetect && !to ? await detect({ text, com }) : 'auto-detect');
    to = to || (from === userLang ? 'en' : userLang);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const { token, key, IG, IID } = await getTokenAndKey(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3?isVertical=1&IG=${IG}&IID=${IID}`;

    let searchParams = new URLSearchParams();
    searchParams.append('fromLang', from);
    searchParams.append('text', text);
    searchParams.append('to', to);
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

        from = data[0].detectedLanguage.language;
        const dataResult: string[] = [data[0].translations[0].text];

        // get dictionary
        let dict: undefined | string[] = undefined;
        try {
            if (!text.includes(' ') && (from === 'en' || to === 'en')) {
                const dictUrl = `https://${com ? 'www' : 'cn'}.bing.com/tlookupv3`;
                searchParams = new URLSearchParams();
                searchParams.append('from', from);
                searchParams.append('text', text);
                searchParams.append('to', to);
                searchParams.append('token', token);
                searchParams.append('key', key.toString());
                const dictRes = await fetchData(dictUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: searchParams.toString()
                });
                const dictData = await dictRes.json();

                const dictObject = dictData[0]?.translations.reduce((t: any, c: any) => (
                    { ...t, [c.posTag]: t[c.posTag] ? t[c.posTag].concat(c.normalizedTarget) : [c.normalizedTarget] }
                ), {});
                dict = dictObject && Object.keys(dictObject).map(v => `${v}: ${dictObject[v].join(', ')}`);
            }
        }
        catch {
            dict = undefined;
        }

        const result = {
            text,
            from,
            to,
            result: dataResult,
            dict
        };

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};

const langCodeSwitch = (code: string) => {
    switch (code) {
        case 'zh-CN': return 'zh-Hans';
        case 'zh-TW': return 'zh-Hant';
        case 'tl': return 'fil';
		case 'iw': return 'he';
		case 'hmn': return 'mww';
		case 'sr': return 'sr-Cyrl';
        default: return code;
    }
};