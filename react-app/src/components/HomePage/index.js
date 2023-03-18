import "./HomePage.css";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const HomePage = () => {
  // Redirect - if the user is logged in, redirect them to 
  // one of their servers (the first one) arr[0]

  const sessionUser = useSelector((state) => state.session.user);
  const serverObj = useSelector((state) => state.servers);
  const serverArr = Object.values(serverObj);

  const handleGetUserServers = () => {
    if (sessionUser) return <Redirect to={`/${serverArr[0].id}`} />
  };

  return (
    <>
      <div>This is the homepage.</div>
      {handleGetUserServers()}
    </>
  );
};

export default HomePage;
