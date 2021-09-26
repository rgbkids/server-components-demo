export const getKey = () => {
  const keys = [
    "AIzaSyCC-FYd9K-VhVZVzGOiJ_ltLPwck_1bkMc",
    "AIzaSyDynnfe5PbvejqTdMZgvpKQv2iv0sc_DvU",
    "AIzaSyA05_WDaaFa615Nequ8IA3fcXPPb7L_TH8",
    "AIzaSyAohHwpRfDK-CuqjZIWZot4av7is0vMT14",
    "AIzaSyCcrPUTAuzkKnK3w_Vr5AIOeOHKGhqf8aU",
    "AIzaSyBAHQhkFqTTqWrEw23890VCOGEjQAD7bpc",
  ];

  return keys[Math.floor(Math.random() * keys.length)];
}