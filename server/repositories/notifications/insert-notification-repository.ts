import { supabaseAdmin } from '../../config/supabase.js';
import { pushNotification } from "../../server.js"

interface NotificationData {
    id? : string;
    user_id : string;
    actor_user_id? : string | null;
    post_id? : string | null;
    type : string;
    title? : string;
    body? : string;
    payload? : JSON;
    scheduled_at? : string;
    delivered_at? : string;
    status? : string;
    read_at? : string;
    created_at? : string;
}

export default async function putNotificationData(notificationData : NotificationData) {
    const { error } = await supabaseAdmin
    .from('notifications')
    .insert(notificationData)

    if(error) {
        console.log("Supabase error inserting user notification. Error: ");
        console.log(error);
        throw new Error("Error inserting user notification");
    }
    //May not be proper to be within repositories, but will be here for now.
    pushNotification(notificationData.user_id,notificationData);
}