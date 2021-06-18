# bing-translate-result
A simple translate API for Bing Translator. Exports translate, audio and detect.
## Install
```
npm i bing-translate-result
```
## Usage
Translate:
```javascript
import bing from 'bing-translate-result';

bing.translate({ text: 'hello', to: 'ja', userLang: 'ja' }).then(result => console.log(result));

/*
    => {
        dict: ["NOUN: こんにちは, こんにち, ハロー, もしもし"],
        from: "en",
        result: ["こんにちは"],
        text: "hello",
        to: "ja"
    }
*/
```
Translate params:
```javascript
{
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
}
```
Audio:
```javascript
import bing from 'bing-translate-result';

bing.audio({ text: 'Hello world!' }).then(result => console.log(result));

/*
    => "data:audio/mp3;base64,//NIxAAAAANIAAAAAExB..."

    "audio" function returns dataURL.
*/
```
Audio params:
```javascript
{
    /*
    * the meaning is the same as translate's params
    * Notice: it must auto detect if you don't set "from"
    */
    text: string,
    from?: string,
    com?: boolean
}
```
You can play audio like it:
```javascript
import bing from 'bing-translate-result';

const audioPlayer = new Audio();

const playAudio = (src) => {
    audioPlayer.src = src;
    audioPlayer.play();
};

bing.audio({ text: 'Hello world!' }).then(result => playAudio(result));
```
Detect:
```javascript
import bing from 'bing-translate-result';

bing.detect({ text: '你好' }).then(result => console.log(result));

/*
    => 'zh-Hans'
*/
```
Detect params:
```javascript
{
    /*
    * the meaning is the same as translate's params
    */
    text: string,
    com?: boolean
}
```
You can catch the error of every function, catch like it:
```javascript
bing.translate({text: 'hello', to: 'abc'})
    .then(result => console.log(result))
    .catch(err => console.log(err.code)); // => 'LANGUAGE_NOT_SOPPORTED'
```
The error code is as follows:
```javascript
'CONNECTION_TIMED_OUT'     // Connection timed out.
'BAD_REQUEST'              // Response status not 200.
'RESULT_ERROR'             // Server returns an unexpected result.
'LANGUAGE_NOT_SOPPORTED'   // The translate source doesn't support this language code.
```
## License
MIT