const GET_MESSAGES_BY_CHANNEL = "messages/allMessagesByChannelId";
const GET_ONE_MESSAGE = "messages/getOneMessage";
const ADD_MESSAGES = "messages/addMessage";
const EDIT_MESSAGES = "messages/editMessage";
const DELETE_MESSAGES = "messages/deleteMessage";
const RESET_MESSAGES = "messages/resetMessage";

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

export const addMessage = (message) => {
  return {
    type: ADD_MESSAGES,
    message
  };
};

export const editMessage = (message) => {
  return {
    type: EDIT_MESSAGES,
    message
  }
};

export const deleteMessage = (id) => {
  return {
    type: DELETE_MESSAGES,
    id,
  }
};

export const resetMessage = () => {
  return {
    type: RESET_MESSAGES
  }
};

export const allMessagesByChannelIdThunk = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/channels/${channelId}/messages`);
  const data = await res.json();
  dispatch(getMessagesByChannelId(data.messages));
  return data.messages;
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

export const editMessageThunk = (serverId, channelId, message) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/channels/${channelId}/messages/${message.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (res.ok) {
    const messageEdited = await res.json();
    dispatch(editMessage(messageEdited));
    return messageEdited;
  }
};

export const deleteMessageThunk = (id) => async () => {
  const res = await fetch(`/api/messages/${id}`, {
    method: "DELETE",
    body: JSON.stringify(id),
  });

  if (res.ok) {
    const messageDeleted = await res.json();
    return messageDeleted;
  }
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
    case EDIT_MESSAGES:
      newState[action.message.id] = action.message;
      return newState;
    case DELETE_MESSAGES:
      delete newState[action.id]
      return newState;
    case RESET_MESSAGES:
      return initialState;
    default:
      return state;
  };
};

export default messageReducer;
