import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// 创建默认实例对象
const mock = new MockAdapter(axios);

// 推荐的meme币列表
mock.onGet("/meme_list").reply(200, [
    {
        "address": "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
        "name": "Tether USD",
        "symbol": "USD₮",
        "decimals": "6",
        "image": "https://cache.tonapi.io/imgproxy/T3PB4s7oprNVaJkwqbGg54nexKE0zzKhcrPv8jcWYzU/rs:fill:200:200:1/g:no/aHR0cHM6Ly90ZXRoZXIudG8vaW1hZ2VzL2xvZ29DaXJjbGUucG5n.webp",
        "description": "Tether Token for Tether USD"
    },
    {
        "address": "EQDo8QC6mVi7Gq6uGWDF4XVp3cZ4wKZ-bqKBkmhVMPm-1ojm",
        "name": "NikolAI",
        "symbol": "NIKO",
        "decimals": "9",
        "image": "https://cache.tonapi.io/imgproxy/PxJ56kKRSzt-yXc-ydp7l4x6tVWepqZdlPRTjsKpNHA/rs:fill:200:200:1/g:no/aHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzE4NTE4NjQ2MTM0MDQ2OTI0ODAvTlVHbVJvQ01fNDAweDQwMC5qcGc.webp",
        "description": "The Meme, The Myth, The AI Machina\n\nIn a realm where algorithms reign supreme, NikolAI arrives — a refined fusion of genius and jest.\n\nInspired by Nikolai Durov, Telegram co-founder and math prodigy, NikolAI is no mere AI."
      },
      {
        "address": "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT",
        "name": "Notcoin",
        "symbol": "NOT",
        "decimals": "9",
        "image": "https://cache.tonapi.io/imgproxy/4KCMNm34jZLXt0rqeFm4rH-BK4FoK76EVX9r0cCIGDg/rs:fill:200:200:1/g:no/aHR0cHM6Ly9jZG4uam9pbmNvbW11bml0eS54eXovY2xpY2tlci9ub3RfbG9nby5wbmc.webp"
      },
      {
        "address": "EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS",
        "name": "Dogs",
        "symbol": "DOGS",
        "decimals": "9",
        "image": "https://cache.tonapi.io/imgproxy/6Pb0sBFy_AzW6l39EIHGs-Iz4eLbbZUh8AYY_Xq-rcg/rs:fill:200:200:1/g:no/aHR0cHM6Ly9jZG4uZG9ncy5kZXYvZG9ncy5wbmc.webp"
      },
      {
        "address": "EQB4zZusHsbU2vVTPqjhlokIOoiZhEdCMT703CWEzhTOo__X",
        "name": "X Empire",
        "symbol": "X",
        "decimals": "9",
        "image": "https://cache.tonapi.io/imgproxy/wXmWH9Kz1v8Qd7YLaHygTkVZvCQXZ0Uvm5twFqlOQVE/rs:fill:200:200:1/g:no/aHR0cHM6Ly94ZW1waXJlLmlvL3Rva2VuL3gucG5n.webp"
      }
]);


mock.onGet("/vip_receiver").reply(200, "UQClW8Jh_VKtWs9QO73enyYzLAHhQ-YTZjny2Kk20XAMf1Vt");

mock.onGet("/identity").reply(200, { "is_vip": true, "upgrading": false });