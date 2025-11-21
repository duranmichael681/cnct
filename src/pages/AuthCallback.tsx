import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
//call back page to get user session verifited and send them back to homepage 
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finish = async () => {
      const { data } = await supabase.auth.getSession();

      // if the session is found , will send them back to the home page 
      if (data?.session) {
        navigate("/Home"); 
      } else {
        navigate("/login");
      }
    };

    finish();
  }, []);

  return <p>Signing you in…</p>;
}
