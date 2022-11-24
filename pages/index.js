import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../components/Account";
import NavBarEg from "../components/NavBarEg";
const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  
  return (
    <div>
      <NavBarEg />
	  
      <div className="container mx-auto py-10">
        <div >
          {!session ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
            />
          ) : (
            <Account session={session} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
