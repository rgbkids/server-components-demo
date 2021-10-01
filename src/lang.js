export const t = (id, lang) => {
    console.log(`lang.js = ${id} @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
    console.log(lang);

    let result = "";

    try {
        result = resources[lang]["translation"][id];
    } catch (e) {
        result = resources["ja"]["translation"][id];
    }

    // let lang = (langObject) ? langObject.lang : "ja";
    // lang = (lang) ? lang : "ja";

    console.log(`lang = ${lang}`);
    console.log(`result = ${result}`);

    // console.log(resources);
    // console.log(resources[lang]);
    // console.log(resources[lang]["translation"]);
    // console.log(resources[lang]["translation"][id]);

    return result;

    // let lang = (langObject) ? langObject.lang : "ja";
    //
    // console.log(`lang.js = ${lang} @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
    // console.log(lang);
    //
    // lang = (lang) ? lang : "ja";
    //
    // console.log(resources);
    // console.log(resources[lang]);
    // console.log(resources[lang]["translation"]);
    // console.log(resources[lang]["translation"][id]);
    //
    // try {
    //     return resources[lang]["translation"][id];
    // } catch (e) {
    //     return resources["ja"]["translation"][id];
    // }
};

const resources = {
    en: {
        translation: {
            HOW_TO_ADD: 'Click ➕, select the users you want to study with from the sidebar.',
            HOW_TO_WATCH: 'Play live streams at the same time!',
            START_TOGETHER: 'STUDY WITH ME!',
            HOW_TO_LIVE: 'You can stream STUDY WITH ME on VTeacher.',
            ABOUT_HASHTAG: '( Live streaming with #STUDYWITHME hashtag )',
            DOWNLOAD_APP: 'Download on App Store',
        },
    },
    ja: {
        translation: {
            HOW_TO_ADD: 'サイドバーから一緒に勉強したいユーザーを➕',
            HOW_TO_WATCH: 'ライブ配信を同時に再生しよう！',
            START_TOGETHER: 'STUDY WITH ME! いっしょに勉強しよう！',
            HOW_TO_LIVE: 'VTeacherでSTUDY WITH MEの配信ができます',
            ABOUT_HASHTAG: '( #STUDYWITHME のハッシュタグをつけて配信 )',
            DOWNLOAD_APP: 'App Storeでダウンロード',
        },
    },
};

