import gpt from "../libs/gpt.js";

const getReply = async (message, key) => {
  if (message.toLowerCase().startsWith("gpt ")) {
    const resp = await gpt.getGptResponse(message.substring(4), key);
    return resp.trim();
  }

  return null;
};

export default {
  getReply,
};
