const axios = require('axios');

import dotenv from "dotenv";

/*

    To this the image moderation, you'll need a SightEngine user ID and a secret key.
    You can create a SightEngine account for free to obtain these.
    Alternatively, you can contact me (Mattjava), and I'll give you one.
*/

dotenv.config();

export async function moderateImage(url) {
    axios.get('https://api.sightengine.com/1.0/check.json', {
  params: {
    'url': url,
    'models': 'nudity-2.1,weapon,recreational_drug,medical,gore-2.0,violence',
    'api_user': process.env.api_user,
    'api_secret': process.env.api_secret,
  }
}).then( function (response) {
    return true;
}).catch(error)( function (error) {
    console.log(error);
    return false;
})
}