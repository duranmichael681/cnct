import axios from "axios";

import dotenv from "dotenv";

/*

    To this the image moderation, you'll need a SightEngine user ID and a secret key.
    You can create a SightEngine account for free to obtain these.
    Alternatively, you can contact me (Mattjava), and I'll give you one.
*/

dotenv.config();

const api_endpoint = "https://api.sightengine.com/1.0/check.json";

export async function moderateImage(url) {
    const params = {
        'url': url,
        'models': 'nudity-2.1,recreational_drug,gore-2.0,violence',
        'api_user': process.env.SIGHTENGINE_USER,
        'api_secret': process.env.SIGHTENGINE_SECRET,
    }

    try {
        const response = await axios.get(api_endpoint, { params });

        const content_data = response['data'];

        const nudity_content = content_data['nudity'];

        Object.keys(nudity_content).forEach(key => {
            if(!key.endsWith("none") && nudity_content[key] > 0.8) {
                console.log(key);
                return false;
            }
        })

        if(content_data['gore'] > 0.8) {
            console.log(content_data['gore']);
            return false;
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}