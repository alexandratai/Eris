const GET_MESSAGES_BY_CHANNEL = "messages/allMessagesByChannelId";
const GET_ONE_MESSAGE = "messages/getOneMessage";

const getOneMessage = (message) => {
  return {
    type: GET_ONE_MESSAGE,
    message,
  };
};

export const oneReviewThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/messages/${id}`);
  const data = await res.json();
  dispatch(getOneMessage(data));
  return res;
};

const initialState = {};

const messageReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_MESSAGES_BY_CHANNEL:
      action.messages.forEach((message) => {
        newState[message.id] = message;
      });
      return newState;
    case GET_ONE_MESSAGE:
      newState[action.message.id] = action.message;
      return newState;
    default:
      return state;
  }
};

export default messageReducer;
