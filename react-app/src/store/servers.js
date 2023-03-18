const GET_SERVERS = "servers/getServers";

const getServers = (servers) => {
    return {
      type: GET_SERVERS,
      servers,
    };
  };

export const allServersThunk = () => async (dispatch) => {
    const res = await fetch('/api/servers');

    if (res.ok) {
        const data = await res.json();
        dispatch(getServers(data.servers));
        return res;
    };
};

export const allUserServersThunk = () => async (dispatch) => {
    const res = await fetch(`/api/servers/current`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getServers(data.servers));
        return res;
    };
};

const initialState = {};

const serverReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
      case GET_SERVERS:
        action.servers.forEach((server) => {
          newState[server.id] = server;
        });
        return newState;
      default:
        return newState;
    }
  };
  
  export default serverReducer;