import { supabase } from './config/supabase';
import { Event } from './fetch-event-by-id-service';

export async function updateEventService(eventId: string, updatedData: Partial<Event>): Promise<Event> {
    try {
        const { data, error } = await supabase
            .from('posts')
            .update({
                title: updatedData.title,
                body: updatedData.body,
                organizer_id: updatedData.organizerId,
                building: updatedData.building,
                start_date: updatedData.startDate,
                end_date: updatedData.endDate,
                post_picture_url: updatedData.postPictureUrl,
                is_private: updatedData.isPrivate,
                rsvp: updatedData.rsvp
            })
            .eq('id', eventId)
            .single();
        
        if (error) {
            throw new Error(`Error updating event: ${error.message}`);
        }
        if (!data) {
            throw new Error('No data returned from update');
        }
        
        const updatedEvent: Event = {
            id: data.id,
            title: data.title,
            body: data.body,
            organizerId: data.organizer_id,
            building: data.building,
            startDate: data.start_date,
            endDate: data.end_date,
            postPictureUrl: data.post_picture_url,
            createdAt: data.created_at,
            isPrivate: data.is_private,
            rsvp: data.rsvp
        };
        
        return updatedEvent;
    } catch (error) {
        console.error('Error in updateEvent:', error);
        throw error;
    }
}