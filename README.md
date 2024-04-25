
# NSIS: No System Is Safe
AI-powered Multi pass through authentication system
that allows multiple ways to authenticate using facial recognition and hand gestures, a primary and secondary way, where the secondary can be configured to trigger some kind of protocol in the background; in the demo we use 911 protocol

## Prerequisites

To run this project, make sure you have the following installed:

- [SvelteKit](https://kit.svelte.dev/)
- Python 3.7.9

## Getting Started

1. Clone the repository:


```
git clone https://github.com/rodoard/nsis.git
```

2. Install dependencies:


```
npm install
pip install sklearn.metrics.pairwise, tensorflow
```

3. Set up environment variables:

Create a .env file in the project root and add the following:


```
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:


```
npm run dev
```

5. Access the application at http://localhost:5000

## Painting Description Generator

Users can configure paiting themes in the Painting  Parameters panel. Once the parameters are set, the AI model generates a paiting description based on the provided configuration.

## Painting Creator

After generating a painting description, the AI model generates a painting based on the description
it generated earlier.

## Technologies Used

- SvelteKit
- OpenAI API
- Vercel AI SDK

## Contributing

We welcome contributions from the community. Please submit a pull request if you'd like to contribute.

## License

This project is licensed under the MIT License.

## Additional Information

Much thanks to Encode Club for inspiring this project.
