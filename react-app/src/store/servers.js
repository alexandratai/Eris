const GET_SERVERS = "servers/getServers";
const ADD_SERVERS = "servers/addServer";

const getServers = (servers) => {
    return {
      type: GET_SERVERS,
      servers,
    };
  };

const addServer = (server) => {
  return {
    type: ADD_SERVERS,
    server
  }
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

export const makeServerThunk = (server) => async (dispatch) => {
  const res = await fetch("/api/servers/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server),
  });

  if (res.ok) {
    const newServer = await res.json();
    dispatch(addServer(newServer));
    return newServer;
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

const serverReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
      case GET_SERVERS:
        action.servers.forEach((server) => {
          newState[server.id] = server;
        });
        return newState;
      case ADD_SERVERS:
        newState[action.server.id] = action.server;
        return newState;
      default:
        return newState;
    }
  };
  
  export default serverReducer;