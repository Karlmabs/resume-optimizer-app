# Resume Optimizer Backend

Python FastAPI backend for AI-powered resume optimization with real-time WebSocket updates.

## Features

- **WebSocket Real-Time Updates**: Live progress streaming during optimization
- **OpenAI Integration**: GPT-4 powered resume optimization and cover letter generation
- **AI-Powered Parsing**: Intelligent resume parsing using GPT-4 that works with ANY format
- **File Parsing**: Support for PDF, DOCX, and Markdown files
- **Fallback Regex Parser**: Basic regex-based parsing if OpenAI API is unavailable
- **REST API**: Fallback HTTP endpoints
- **CORS Enabled**: Ready for frontend integration

## Tech Stack

- **FastAPI**: Modern async Python web framework
- **OpenAI API**: GPT-4 for AI optimization
- **WebSockets**: Real-time communication
- **PyPDF2**: PDF parsing
- **python-docx**: DOCX parsing
- **Pydantic**: Data validation

## Prerequisites

- Python 3.9 or higher
- OpenAI API key
- pip (Python package manager)

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=8000
```

**Get an OpenAI API Key:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up / Log in
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file

### 3. Run the Backend

```bash
python main.py
```

The server will start on `http://localhost:8000`

**Alternative (with auto-reload):**
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

### WebSocket

**`WS /ws/optimize`** - Real-time resume optimization

Send:
```json
{
  "type": "optimize",
  "resume": {... Resume JSON ...},
  "jobDescription": "Job description text...",
  "jobTitle": "Senior Engineer",
  "company": "Company Name"
}
```

Receive (Progress Updates):
```json
{
  "type": "progress",
  "stage": "analyzing",
  "progress": 25,
  "message": "Analyzing resume..."
}
```

Receive (Final Result):
```json
{
  "type": "result",
  "data": {
    "optimizedResume": {... OptimizedResume JSON ...},
    "coverLetter": {... CoverLetter JSON ...},
    "jobKeywords": ["keyword1", "keyword2", ...]
  }
}
```

### REST API

**`POST /api/parse-resume`** - Parse uploaded resume

- Upload: multipart/form-data with `file` field
- Returns: Resume JSON

**`POST /api/optimize`** - Optimize resume (non-WebSocket)

- Body: OptimizeRequest JSON
- Returns: OptimizeResponse JSON

**`GET /api/health`** - Health check

**`GET /`** - API information

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
├── .env.example           # Environment template
│
├── api/
│   ├── routes.py          # REST API routes
│   └── websocket.py       # WebSocket handlers
│
├── services/
│   ├── ai_service.py      # OpenAI integration
│   └── parser_service.py  # File parsing (PDF/DOCX/MD)
│
└── models/
    └── schemas.py         # Pydantic models (data validation)
```

## Development

### Running with Debug Mode

```bash
uvicorn main:app --reload --log-level debug --port 8000
```

### Testing the API

**Health Check:**
```bash
curl http://localhost:8000/api/health
```

**WebSocket Test (using wscat):**
```bash
npm install -g wscat
wscat -c ws://localhost:8000/ws/optimize
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `PORT` | No | 8000 | Server port |
| `HOST` | No | 0.0.0.0 | Server host |
| `ENV` | No | development | Environment (development/production) |

## Troubleshooting

### "ModuleNotFoundError: No module named 'models'"

Make sure you're running from the `backend/` directory:
```bash
cd backend
python main.py
```

### "OpenAI API key not set"

Make sure your `.env` file exists and contains:
```env
OPENAI_API_KEY=sk-your-key-here
```

### "WebSocket connection failed"

1. Check that the backend is running: `curl http://localhost:8000/api/health`
2. Verify CORS settings in `main.py` include your frontend URL
3. Check browser console for error messages

### "Rate limit exceeded"

OpenAI has rate limits. If you hit them:
1. Wait a few moments
2. Check your OpenAI usage: https://platform.openai.com/account/usage
3. Upgrade your OpenAI plan if needed

## Cost Considerations

**OpenAI API Costs:**
- GPT-4: ~$0.03 per 1K tokens (input), ~$0.06 per 1K tokens (output)
- Average resume optimization: ~$0.10 - $0.30 per request
- Cover letter generation: ~$0.05 - $0.15 per request

**To reduce costs:**
- Use `gpt-3.5-turbo` instead (change in `services/ai_service.py`)
- Implement caching for similar requests
- Add rate limiting

## Production Deployment

### Option 1: Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`
4. Add environment variables in Railway dashboard

### Option 2: Render

1. Create account at render.com
2. New > Web Service
3. Connect GitHub repo
4. Set:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && python main.py`
5. Add environment variables

### Option 3: Docker

```dockerfile
# Dockerfile (create in backend/)
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

Build and run:
```bash
docker build -t resume-optimizer-backend .
docker run -p 8000:8000 --env-file .env resume-optimizer-backend
```

## License

MIT

## Support

For issues, please check:
1. Backend is running: `http://localhost:8000`
2. Environment variables are set correctly
3. OpenAI API key is valid
4. Python version is 3.9+
