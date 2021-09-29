export const getKey = () => {
    const keys = [
        // https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials?project=
        // https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=

        "AIzaSyCC-FYd9K-VhVZVzGOiJ_ltLPwck_1bkMc",
        // "AIzaSyDynnfe5PbvejqTdMZgvpKQv2iv0sc_DvU",
        // "AIzaSyA05_WDaaFa615Nequ8IA3fcXPPb7L_TH8",
        // "AIzaSyAohHwpRfDK-CuqjZIWZot4av7is0vMT14",
        // "AIzaSyCcrPUTAuzkKnK3w_Vr5AIOeOHKGhqf8aU",
        // "AIzaSyBAHQhkFqTTqWrEw23890VCOGEjQAD7bpc",
        // "AIzaSyBh-776UWCBh9CnqbNUGRDeCYA7skH2M78",

        "AIzaSyAtK1DbsKVmQPl8DDpyVe_7J_CLdEdEzps",
    ];

    return keys[Math.floor(Math.random() * keys.length)];
}