const gptFormat = (userId, prompt, reply) => {
  return {
    type: 'flex',
    altText: 'this is a flex message',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `GPT(${userId})`,
            color: '#FFFFFF',
            align: 'center',
          },
        ],
        backgroundColor: '#006600',
        paddingAll: 'xs',
      },
      hero: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: prompt,
            color: '#990000',
          },
        ],
        paddingAll: 'sm',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: reply,
          },
        ],
        paddingAll: 'sm',
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: process.env.GIT_COMMIT || '000',
            align: 'center',
            color: '#999999',
          },
        ],
        paddingAll: 'xs',
        backgroundColor: '#BBFFBB',
      },
    },
  };
};

export default gptFormat;
