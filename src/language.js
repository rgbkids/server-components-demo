export const t = (id, lang) => {
    let result = "";

    try {
        result = resources[lang]["translation"][id];
    } catch (e) {
        result = resources["ja"]["translation"][id];
    }

    return result;
};

const resources = {
    en: {
        translation: {
            SIGN_IN_TEXT: 'Sign in - Google Accounts',
            SIGN_OUT_TEXT: '✋Sign out',
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
            SIGN_IN_TEXT: 'まずは Sign in - Google Accounts',
            SIGN_OUT_TEXT: '✋Sign out',
            HOW_TO_ADD: 'サイドバーから一緒に勉強したいユーザーを➕',
            HOW_TO_WATCH: 'ライブ配信を同時に再生しよう！',
            START_TOGETHER: 'STUDY WITH ME! いっしょに勉強しよう！',
            HOW_TO_LIVE: 'VTeacherでSTUDY WITH MEの配信ができます',
            ABOUT_HASHTAG: '( #STUDYWITHME のハッシュタグをつけて配信 )',
            DOWNLOAD_APP: 'App Storeでダウンロード',
        },
    },
    zh_cmn_Hant: {
        translation: {
            SIGN_IN_TEXT: 'Sign in - Google Accounts',
            SIGN_OUT_TEXT: '✋Sign out',
            HOW_TO_ADD: '單擊 ➕，從側邊欄中選擇要與之一起學習的用戶。',
            HOW_TO_WATCH: '同時播放直播！',
            START_TOGETHER: '跟我一起學習！',
            HOW_TO_LIVE: '您可以在 VTeacher 上直播 STUDY WITH ME。',
            ABOUT_HASHTAG: '（使用#STUDYWITHME 標籤進行直播）',
            DOWNLOAD_APP: '在 App Store 下載',
        },
    },
    ko: {
        translation: {
            SIGN_IN_TEXT: 'Sign in - Google Accounts',
            SIGN_OUT_TEXT: '✋Sign out',
            HOW_TO_ADD: '➕을 클릭하고 사이드바에서 함께 공부할 사용자를 선택합니다.',
            HOW_TO_WATCH: '동시에 라이브 스트림을 재생합니다!',
            START_TOGETHER: '저와 함께 공부하세요!',
            HOW_TO_LIVE: 'VTeacher에서 STUDY WITH ME를 스트리밍할 수 있습니다.',
            ABOUT_HASHTAG: '( #STUDYWITHME 해시태그와 함께 라이브 스트리밍 )',
            DOWNLOAD_APP: '앱 스토어에서 다운로드',
        },
    },
};








