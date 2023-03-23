const GET_CHANNELS_BY_SERVER = "channels/allChannelsByServerId";
const ADD_CHANNELS = "channels/addChannel";

const getChannelsByServerId = (channels) => {
  return {
    type: GET_CHANNELS_BY_SERVER,
    channels,
  };
};

const addChannel = (channel) => {
  return {
    type: ADD_CHANNELS,
    channel
  };
};

export const allChannelsByServerIdThunk = (serverId) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/channels`);
  const data = await res.json();
  dispatch(getChannelsByServerId(data.channels));
  return res;
};

export const makeChannelThunk = (serverId, channel) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId.serverId}/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(channel),
  });

  if (res.ok) {
    const newChannel = await res.json();
    dispatch(addChannel(newChannel));
    return newChannel;
  } else if (res.status < 500) {
		const data = await res.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

const initialState = {};

const channelReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_CHANNELS_BY_SERVER:
      action.channels.forEach((channel) => {
        newState[channel.id] = channel;
      });
      return newState;
    case ADD_CHANNELS:
      newState[action.channel.id] = action.channel;
      return newState;
    default:
      return state;
  }
};

export default channelReducer;
