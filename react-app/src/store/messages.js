const GET_MESSAGES_BY_CHANNEL = "messages/allMessagesByChannelId";
const GET_ONE_MESSAGE = "messages/getOneMessage";
const ADD_MESSAGES = "messages/addMessage";

const getMessagesByChannelId = (messages) => {
  return {
    type: GET_MESSAGES_BY_CHANNEL,
    messages,
  };
};

const getOneMessage = (message) => {
  return {
    type: GET_ONE_MESSAGE,
    message,
  };
};

const addMessage = (message) => {
  return {
    type: ADD_MESSAGES,
    message
  };
};

export const allMessagesByChannelIdThunk = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/channels/${channelId}/messages`);
  const data = await res.json();
  dispatch(getMessagesByChannelId(data.messages));
  return res;
};

export const oneMessageThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/messages/${id}`);
  const data = await res.json();
  dispatch(getOneMessage(data));
  return res;
};

export const makeMessageThunk = (serverId, channelId, message) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/channels/${channelId}/messages/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (res.ok) {
    const newMessage = await res.json();
    dispatch(addMessage(newMessage));
    return newMessage;
  } else if (res.status < 500) {
		const data = await res.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	};
};

const initialState = {};

const messageReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_MESSAGES_BY_CHANNEL:
      // For efficiency later:
      // If statement, checks the current length of newState
      // if Object.values(newState).length > 500 newState = {} then run the loop.
      action.messages.forEach((message) => {
        newState[message.id] = message;
      });
      return newState;
    case GET_ONE_MESSAGE:
      newState[action.message.id] = action.message;
      return newState;
    case ADD_MESSAGES:
      newState[action.message.id] = action.message;
      return newState;
    default:
      return state;
  };
};

export default messageReducer;
