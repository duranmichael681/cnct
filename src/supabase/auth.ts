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


//function for email sign up authentication
export async function signUpEmail(name:string,email:string,password:string){
    try{
        const {data, error} = await supabase.auth.signUp({email,password,
            //creates account in supabase
            options:{
                //redirects to redirect url
            //emailRedirectTo:`${import.meta.env.VITE_REDIRECT_URL}`,
            data:{name,},

            }});  
        return data;
    }
    catch(err:unknown){
        //this is for errors
        if(err instanceof Error)
        {
            throw new Error(err.message);
        }   

    }
       
}            



export async function signInEmail(email:string,password:string){
    try{
    //gathering data and any potential errors
    const {data, error} = await supabase.auth.signInWithPassword({email,password, 
        options:{
            //for url direction
           //emailRedirectTo:`${import.meta.env.VITE_REDIRECT_URL}`
        }
        })

        //in case of supabase errors
        if (error) {
        throw new Error(error.message);
        }
    return data.user; 
    
    }
    catch(err:unknown){
    //     //this is for errors
        if (err instanceof Error){
            throw new Error(err.message);
         
    }}            
}




