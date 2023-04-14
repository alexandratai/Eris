const GET_CHANNELS_BY_SERVER = "channels/allChannelsByServerId";

const getChannelsByServerId = (channels) => {
    return {
        type: GET_CHANNELS_BY_SERVER,
        channels
    }
};

export const allChannelsByServerIdThunk = (serverId) => async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}/channels`);
    const data = await res.json();
    dispatch(getChannelsByServerId(data.channels));
    return res;
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
      default:
        return state;
    };
  };

export default channelReducer;