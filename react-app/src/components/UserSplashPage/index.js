import "./UserSplashPage.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUserServersThunk } from "../../store/servers";
import { Redirect } from "react-router-dom";

const UserSplashPage = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const sessionUser = useSelector((state) => state.session.user)
    const serverObj = useSelector((state) => state.servers);
    const serverArr = Object.values(serverObj);
    let userServers;

    if (sessionUser !== null) {
      userServers = serverArr.filter(server => {
          return server.owner_id == sessionUser.id
      })
    };

    useEffect(() => {
        dispatch(allUserServersThunk()).then(() => setIsLoaded(true))
      }, [dispatch]);

    if (isLoaded && sessionUser !== null && userServers.length > 0) return <Redirect to={`/${userServers[0].id}`} />

    return (
      <>
        <div>
        Welcome! You can begin by creating a server.
        </div>
      </>
    );
  };

// brings user to @me page where it will fetch their servers
// ^ another component. @me will be where DMs will live 
  
export default UserSplashPage;