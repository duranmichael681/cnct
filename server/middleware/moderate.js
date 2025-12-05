import axios from "axios";

import dotenv from "dotenv";

/*

    To this the image moderation, you'll need a SightEngine user ID and a secret key.
    You can create a SightEngine account for free to obtain these.
    Alternatively, you can contact me (Mattjava), and I'll give you one.
*/

dotenv.config();

const api_endpoint = "https://api.sightengine.com/1.0/check.json";

const threshold = 0.5;

export async function moderateImage(url) {
    const params = {
        'url': url,
        'models': 'nudity-2.1,recreational_drug,gore-2.0,violence,self-harm',
        'api_user': process.env.SIGHTENGINE_USER,
        'api_secret': process.env.SIGHTENGINE_SECRET,
    }

    try {
        const response = await axios.get(api_endpoint, { params });

        const content_data = response['data'];

        const nudity_content = content_data['nudity'];

        const nudity_flag = search(nudity_content);

        if(nudity_flag)
            return false;

        if(content_data['gore']['prob'] > threshold) {
            return false;
        }

        if(content_data['self-harm']['prob'] > threshold)
            return false;

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function search(map) {
    var flag = false;

    Object.keys(map).forEach(key => {
        if(key.endsWith('none') || key.endsWith('context'))
            return;

        var value = map[key];


        if(typeof value != 'number' && !search(value))
            flag = true;

        else if(value > threshold)
            flag = true;
    })

    return flag;
}