import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Custom hook for handling RSVP logic
 * Manages RSVP state and handles create/delete operations
 */
export const useRSVP = (
  eventId: string,
  initialRsvpd: boolean,
  initialCount: number
) => {
  const [isRsvpd, setIsRsvpd] = useState(initialRsvpd);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleRsvp = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to RSVP to events');
        return;
      }

      const userId = session.user.id;

      if (isRsvpd) {
        // Remove RSVP
        const { error } = await supabase
          .from('attendees')
          .delete()
          .eq('posts_id', eventId)
          .eq('user_id', userId);

        if (error) throw error;

        setIsRsvpd(false);
        setCount(prev => Math.max(0, prev - 1));
      } else {
        // Add RSVP
        const { error } = await supabase
          .from('attendees')
          .insert({
            posts_id: eventId,
            user_id: userId,
          });

        if (error) throw error;

        setIsRsvpd(true);
        setCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling RSVP:', error);
      alert('Failed to update RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { isRsvpd, count, loading, handleRsvp };
};
