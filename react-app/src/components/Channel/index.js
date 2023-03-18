import "./Channel.css";

const Channel = ({ channel }) => {
    return (
      <>
        <div>{channel.name}</div>
        <img src={channel.image} width="200px" alt="" />
      </>
    );
  };
  
  export default Channel;