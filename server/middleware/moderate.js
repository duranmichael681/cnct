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
  try {
    if (!process.env.SIGHTENGINE_USER || !process.env.SIGHTENGINE_SECRET) {
      console.error('❌ SightEngine credentials missing. Check SIGHTENGINE_USER and SIGHTENGINE_SECRET in .env');
      return false;
    }

    console.log('🔍 Calling SightEngine API for moderation...');
    const { data } = await axios.get('https://api.sightengine.com/1.0/check.json', {
      params: {
        url,
        models: 'nudity-2.1,weapon,recreational_drug,medical,gore-2.0,violence,self-harm',
        // Use the env vars defined in .env
        api_user: process.env.SIGHTENGINE_USER,
        api_secret: process.env.SIGHTENGINE_SECRET,
      }
    });
    
    console.log('📊 Moderation response:', data);
    
    // Check if the response indicates the image passed moderation
    if (data.status === 'success') {
      // If any flagged content is detected, reject it
      const hasFlags = data.nudity?.raw || data.weapon?.raw || data.recreational_drug?.raw || 
                       data.medical?.raw || data.gore?.raw || data.violence?.raw || data['self-harm']?.raw;
      
      if (hasFlags) {
        console.log('⚠️ Image flagged for inappropriate content');
        return false;
      }
      
      console.log('✅ Image passed moderation');
      return true;
    } else {
      console.log('⚠️ Moderation check failed (status was not success)');
      return false;
    }
  } catch (error) {
    console.error('❌ Error during moderation:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // If API fails, default to rejecting the image for safety
    // Unless you want to allow it by default (less safe)
    return false;
  }
}