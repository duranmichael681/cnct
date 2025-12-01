import { supabase } from '../lib/supabaseClient';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  pronouns: string;
  classStanding: string;
  major?: string;
  interests: string[];
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 * Stores questionnaire data in the users table
 */
export async function signUp(data: SignUpData) {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName || '',
          pronouns: data.pronouns,
          degree_program: data.major || null,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    console.log('User created, updating profile with:', {
      first_name: data.firstName,
      last_name: data.lastName || '',
      pronouns: data.pronouns,
      degree_program: data.major || null,
      user_id: authData.user?.id
    });

    // Wait a moment for the trigger to create the user record
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. First, verify the user record exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user!.id)
      .single();

    console.log('Existing user record:', existingUser);
    if (fetchError) {
      console.error('Error fetching user record:', fetchError);
    }

    // 3. Try to update using authenticated user context
    // First, ensure we're authenticated
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'Active' : 'None');

    // 4. Update user profile in public.users table with questionnaire data
    // Note: degree_program has a foreign key constraint to programs table
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        first_name: data.firstName,
        last_name: data.lastName || '',
        pronouns: data.pronouns,
        degree_program: data.major || null,
      })
      .eq('id', authData.user!.id)
      .select();

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      console.error('Update error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      });
      
      // If it's a foreign key constraint error, try again without degree_program
      if (updateError.code === '23503') {
        console.warn('Foreign key constraint failed for degree_program, retrying without it');
        const { data: retryData, error: retryError } = await supabase
          .from('users')
          .update({
            first_name: data.firstName,
            last_name: data.lastName || '',
            pronouns: data.pronouns,
            degree_program: null, // Set to null if major doesn't exist in programs table
          })
          .eq('id', authData.user!.id)
          .select();
          
        if (retryError) {
          console.error('Retry also failed:', retryError);
          throw retryError;
        }
        console.log('Profile updated successfully (without degree_program):', retryData);
      } else {
        throw updateError;
      }
    } else {
      console.log('Profile updated successfully:', updateData);
      
      // If update returned empty array, verify the data was actually saved
      if (!updateData || updateData.length === 0) {
        console.warn('Update returned empty array, verifying data was saved...');
        const { data: verifyData, error: verifyError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user!.id)
          .single();
          
        console.log('Verified user data:', verifyData);
        if (verifyError) {
          console.error('Verification failed:', verifyError);
        }
      }
    }

    // 3. Store user interests in user_tag_preferences table
    if (data.interests && data.interests.length > 0) {
      // Map interest strings to tag IDs
      // For now, we'll use a simple mapping based on the predefined tags
      const tagMapping: { [key: string]: number } = {
        'Academic & Career': 1,
        'Arts & Culture': 2,
        'Athletics & Recreation': 3,
        'Campus Life & Community': 4,
        'Information Sessions & Fairs': 5,
      };

      const tagPreferences = data.interests
        .map(interest => {
          const tagId = tagMapping[interest];
          if (tagId) {
            return {
              user_id: authData.user!.id,
              tag_id: tagId,
            };
          }
          return null;
        })
        .filter(Boolean);

      if (tagPreferences.length > 0) {
        const { error: tagsError } = await supabase
          .from('user_tag_preferences')
          .insert(tagPreferences);

        if (tagsError) {
          console.error('Error inserting user tag preferences:', tagsError);
          // Don't throw - let signup succeed even if tag preferences fail
        }
      }
    }

    return {
      user: authData.user,
      session: authData.session,
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      // Check if error is due to invalid credentials
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user returned from sign in');
    }

    return {
      user: authData.user,
      session: authData.session,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Request a password reset email
 */
export async function resetPasswordRequest(email: string) {
  try {
    const redirectUrl = import.meta.env.VITE_REDIRECT_URL || `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
}

/**
 * Update user password (called after reset email link is clicked)
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}
