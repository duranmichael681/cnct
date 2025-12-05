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
    
    console.log('📊 Moderation response:', JSON.stringify(data, null, 2));
    
    // Check if the response indicates the image passed moderation
    if (data.status === 'success') {
      // Check nudity subcategories (direct properties on nudity object)
      if (data.nudity) {
        const nudityCategories = ['sexual_activity', 'sexual_display', 'erotica', 'assault'];
        for (const category of nudityCategories) {
          const score = data.nudity[category];
          if (typeof score === 'number' && score > threshold) {
            console.log(`⚠️ Image flagged for nudity - ${category}: ${score}`);
            return false;
          }
        }
      }

      // Check other flagged content (these use .prob property)
      if (data.recreational_drug?.prob > threshold) {
        console.log(`⚠️ Image flagged for recreational_drug: ${data.recreational_drug.prob}`);
        return false;
      }
      if (data.medical?.prob > threshold) {
        console.log(`⚠️ Image flagged for medical: ${data.medical.prob}`);
        return false;
      }
      if (data.gore?.prob > threshold) {
        console.log(`⚠️ Image flagged for gore: ${data.gore.prob}`);
        return false;
      }
      if (data.violence?.prob > threshold) {
        console.log(`⚠️ Image flagged for violence: ${data.violence.prob}`);
        return false;
      }
      if (data['self-harm']?.prob > threshold) {
        console.log(`⚠️ Image flagged for self-harm: ${data['self-harm'].prob}`);
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