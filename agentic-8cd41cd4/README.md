## News-to-Video Agent

This application orchestrates an automated agent that converts the latest Google News headlines into an AI-generated video and optionally pushes the finished clip to your social queue. It runs entirely on the web using Next.js 16 with the App Router and can be deployed directly to Vercel.

### Features

- Pulls fresh stories from Google News based on a topic or set of keywords.
- Drafts a narration script, b-roll shot list, and social caption with OpenAI.
- Generates a short video using Replicate (falls back to a safe placeholder if no token is provided).
- Publishes, schedules, or skips social distribution using Buffer or the X (Twitter) API.
- Surfaces a detailed execution timeline for each autonomous run.

### Prerequisites

- Node.js 18 or later.
- API keys for the services you want to enable (see `.env.example`).

### Configure Environment Variables

Copy the example file and populate the values you have credentials for:

```bash
cp .env.example .env.local
```

Required for full autonomy:

- `OPENAI_API_KEY` – narration and storyboard generation.
- `REPLICATE_API_TOKEN` – AI video synthesis (optional placeholder used if omitted).
- `BUFFER_ACCESS_TOKEN` + `BUFFER_PROFILE_ID` – auto-post via Buffer (optional).
- `X_BEARER_TOKEN` (+ `X_HANDLE`) – direct posting to X (optional).

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the control surface. Submit a topic and the agent will execute the full workflow, displaying the generated video, narration script, and run logs.

### Production Build

```bash
npm run build
npm run start
```

### Deployment

Deploy to Vercel using the CLI (the project name is already configured in the project brief):

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-8cd41cd4
```

After deployment propagates, verify the production domain:

```bash
curl https://agentic-8cd41cd4.vercel.app
```

### Limitations

- Google News responses depend on public RSS feeds; regional headlines may vary.
- Video generation quality is subject to the chosen Replicate model and quota.
- Posting to X requires a user-context bearer token with the `tweet.write` scope.
