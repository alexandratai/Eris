import "./HomePage.css";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { allUserServersThunk } from "../../store/servers";
import { useEffect, useState } from "react";

const HomePage = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  // Redirect - if the user is logged in, redirect them to 
  // one of their servers (the first one) arr[0]

  const sessionUser = useSelector((state) => state.session.user);
  const serverObj = useSelector((state) => state.servers);
  const serverArr = Object.values(serverObj);
  const { serverId } = useParams();
  let userServers;
  
  if (sessionUser !== null) {
    userServers = serverArr.filter(server => {
        return server.owner_id == sessionUser.id
    })
  };

  useEffect(() => {
    if (sessionUser) {
      dispatch(allUserServersThunk(serverId)).then(() => setIsLoaded(true));
    }
  }, [dispatch, serverId, sessionUser]);

  if (isLoaded && sessionUser !== null && userServers.length > 0) return <Redirect to={`/${userServers[0].id}`} />

  return (
    <>
    <p>This is the homepage</p>
    </>
  );
};

export default HomePage;
