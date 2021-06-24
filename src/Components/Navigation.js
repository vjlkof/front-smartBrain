import React from 'react';


const Navigation =({onRouteChange, isSignedIn}) => {
    if (isSignedIn){
      return(
        <nav className="flex justify-end">
            <p onClick={()=>onRouteChange('signout')} className="f3 link dim black underline pa3 pointer">Sing out</p>
        </nav>
      );
    } else {
      return(
        <nav className="flex justify-end">
            <p onClick={()=>onRouteChange('signin')} className="f3 link dim black underline pa3 pointer">Sing in</p>
            <p onClick={()=>onRouteChange('register')} className="f3 link dim black underline pa3 pointer">Register</p>
        </nav>
      );
    }
}

export default Navigation;