import { fetchData, getError } from './utils';
import { langCode } from './lang-code';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from './error-codes';
import { detect } from './detect';
import { TranslateParameter } from './types';

export const translate = async ({ text, from = '', to = '', userLang = '', com = true, autoDetect = true }: TranslateParameter) => {
    userLang = userLang || 'en';
    userLang = langCodeSwitch(userLang);
    from = from || (autoDetect && !to ? await detect({ text, com }) : 'auto-detect');
    to = to || (from === userLang ? 'en' : userLang);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3`;

    let searchParams = new URLSearchParams();
    searchParams.append('fromLang', from);
    searchParams.append('text', text);
    searchParams.append('to', to);

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
        const dataResult: [string] = [data[0].translations[0].text];

        const result = {
            text,
            from,
            to,
            result: dataResult
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
        default: return code;
    }
};