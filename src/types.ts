export interface TranslateParameter {
    /**
     * the text you wanna translate
     */
    text: string,

    /**
     * the language code of the text
     * @default ""
     */
    from?: string,

    /**
     * the language code that you wanna translate to
     * @default ""
     */
    to?: string,

    /**
     * the user language environment
     * help decide auto translate to what language code
     * should be 'navigator.language'
     * @default ""
     */
    userLang?: string,

    /**
     * url: `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3`
     * @default true
     */
    com?: boolean,

    /**
     * auto detect can help judge the language code of translate to
     * but it costs about two times of time to request server
     * only work when you didn't set "from"
     * @default true
     */
    autoDetect?: boolean
};

export type DetectParameter = Pick<TranslateParameter, "text" | "com">;

export type AudioParameter = Pick<TranslateParameter, "text" | "from" | "com">;

export type TranslateResult = {
    text: string,
    from: string,
    to: string,
    result: string[],
    dict?: string[]
};

export type DetectResult = string;

export type AudioResult = string;