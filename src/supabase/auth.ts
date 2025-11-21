import {supabase} from './client'


//function that will actually handle google sign up/sign in on the button 
export async function googleAuth(){
    return  await supabase.auth.signInWithOAuth ({//request to supabase passing in google as provider 
                provider:'google',
                options : {
                    redirectTo: `${import.meta.env.VITE_REDIRECT_URL}` //will change to {window.location.origin later in production 
                }
                })
}