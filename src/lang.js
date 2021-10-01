export const t = (id, lang) => {
    let _lang = (lang) ? lang : "ja";
    return resources[_lang]["translation"][id];
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