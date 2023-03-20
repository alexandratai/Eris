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

  useEffect(() => {
    dispatch(allUserServersThunk(serverId)).then(() => setIsLoaded(true));
  }, [dispatch, serverId]);

  // const handleGetUserServers = () => {
    if (isLoaded && sessionUser && serverArr.length > 0) return <Redirect to={`/${serverArr[0].id}`} />
    // if (sessionUser) return <Redirect to={`/${serverArr[0].id}`} />
  // };

  return (
    <>
      <div>This is the homepage.</div>
    </>
  );
};

export default HomePage;
