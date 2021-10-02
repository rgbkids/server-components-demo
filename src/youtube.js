/*
https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials?project=
https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=
*/

// TODO: 外部に出す
const keys = [
    "AIzaSyAEIhRMTe_KrD2jHYcZDOKoDHPKPN_nZVs",

    // "AIzaSyDUEylkdRNCQxAPgi-Qkqdqsa7X3sR-nkk",
    // "AIzaSyAkhRemmID_N_CSd2zW9GqDrPJQssTOEiY",
    // "AIzaSyAIRDMnwqNf6zTSVhR5wQul1XBnDyH-PqI",
    // "AIzaSyCV2LPN6RFtGFfWLtrx8OiIkhj8qD7v9Zo",
    // "AIzaSyCC-FYd9K-VhVZVzGOiJ_ltLPwck_1bkMc",
    // "AIzaSyAtK1DbsKVmQPl8DDpyVe_7J_CLdEdEzps",
    // "AIzaSyCPTFcXn0V-0fEefMIAGrwUBg2o0urdU3E",
];

export default function getYouTubeAPIKey() {
    return keys[Math.floor(Math.random() * keys.length)];
}