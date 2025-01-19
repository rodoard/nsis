
# NSIS: No System Is Safe
AI-powered Multi pass through authentication system
that allows multiple ways to authenticate using facial recognition and hand gestures, a primary and secondary way, where the secondary can be configured to trigger some kind of protocol in the background; in the demo we use 911 protocol

## LLMs used

1. Face Recognizer (web)
2. Gesture Recognizer (web)
3. Image Similarity (python backend)

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
cd nsis
npm install
python -m venv 
venv/bin/activate
pip install sklearn.metrics.pairwise tensorflow-cpu pillow
yarn dev #from venv environment 
```

3. Set up environment variables:

Create a .env file in the project root and add the following:

```
OPENAI_API_KEY=xxxxxxx
```

4. Start the development server:


```
npm run dev
```

5. Access the application at http://localhost:5000
r.

## Technologies Used

- SvelteKit
- mediapipe LLMS

## Contributing

We welcome contributions from the community. Please submit a pull request if you'd like to contribute.

## License

This project is licensed under the MIT License.

## Additional Information

Much thanks to Encode Club for inspiring this project.
