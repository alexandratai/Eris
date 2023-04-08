import REMOVE_USER from "./session";

const GET_SERVERS = "servers/getServers";
const ADD_SERVERS = "servers/addServer";
const EDIT_SERVERS = "servers/editServer";
const DELETE_SERVERS = "servers/deleteServer";

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

const editServer = (server) => {
  return {
    type: EDIT_SERVERS,
    server
  }
};

const deleteServer = (id) => {
  return {
    type: DELETE_SERVERS,
    id,
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

    return res;
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

export const editServerThunk = (server) => async (dispatch) => {
  const res = await fetch(`/api/servers/${server.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server),
  });

  if (res.ok) {
    const serverEdited = await res.json();
    dispatch(editServer(serverEdited));
    return serverEdited;
  }
};

export const deleteServerThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/servers/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteServer(id));
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
      case EDIT_SERVERS:
        newState[action.server.id] = action.server;
        return newState;
      case DELETE_SERVERS:
        delete newState[action.id]
        return newState;
      case REMOVE_USER:
        return initialState;
      default:
        return newState;
    }
  };
  
  export default serverReducer;