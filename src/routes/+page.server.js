export function load({ params }) {
  return {
    openAIKey: process.env.OPENAI_API_KEY
  };
}

export const actions = {
  embed: async (event) => {
    const data = await request.formData();
    const image = data.get('image');
  }
};