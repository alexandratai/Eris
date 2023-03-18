import "./Server.css";

const Server = ({ server }) => {
  return (
    <>
      <div>{server.name}</div>
      <img src={server.image} width="200px" alt="" />
    </>
  );
};

export default Server;
