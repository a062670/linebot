import gpt from "../libs/gpt.js";
import bing from "../libs/bing.js";

const getReply = async (message, key) => {
  if (message.toLowerCase().startsWith("gpt ")) {
    const resp = await gpt.getGptResponse(message.substring(4), key);
    return resp.trim();
  }
  if (message.toLowerCase().startsWith("bing ")) {
    const resp = await bing.getResponse(message.substring(5), key);
    return resp.trim();
  }

  return null;
};

export default {
  getReply,
};
