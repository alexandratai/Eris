import "./ChannelGrid.css";
import Channel from "../Channel";

import { useSelector, useDispatch } from "react-redux";
import { allChannelsByServerIdThunk } from "../../store/channels";
import { useParams, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";

const ChannelGrid = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { serverId, channelId } = useParams();

  const channelObj = useSelector((state) => state.channels);
  const channelArr = Object.values(channelObj).filter((channel) => {
    return channel.server_id == serverId;
  });

  // if statement - if no channelId && isLoaded && 
  // channelArr.length > 0, cause a redirect to the 1st
  // channel in channelArr
  // If a user clicks on a server, it takes then to /1 or /4
  
  useEffect(() => {
    if (serverId) {
      dispatch(allChannelsByServerIdThunk(serverId))
      .then(() => setIsLoaded(true));
    }
  }, [dispatch, serverId]);
  
  if (isLoaded && !channelId && channelArr.length > 0) return <Redirect to={`/${serverId}/${channelArr[0].id}`} />
 
  return (
    <>
      <div className="channel-grid">
        {channelArr.length > 0 &&
          channelArr.map((channel) => {
            return <Channel key={channel.id} channel={channel} />;
          })}
      </div>
    </>
  );
};

export default ChannelGrid;
