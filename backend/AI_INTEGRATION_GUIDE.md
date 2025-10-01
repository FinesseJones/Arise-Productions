# 🤖 AI Integration Guide - Claude API

## Overview

The Unified 3D Production Studio now includes **real Claude AI integration** for intelligent casting analysis, budget forecasting, and production scheduling.

## 🔑 Setup Instructions

### 1. Get Your Claude API Key

1. Visit: https://console.anthropic.com/
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Configure Encore Secret

Encore.dev uses secure secrets management. Set your API key:

```bash
cd backend
encore secret set --type local AnthropicAPIKey
# Paste your API key when prompted
```

For production deployment:
```bash
encore secret set --type prod AnthropicAPIKey
```

### 3. Verify Installation

Check that the Anthropic SDK is installed:

```bash
cd backend
npm list @anthropic-ai/sdk
```

Should show: `@anthropic-ai/sdk@0.x.x`

## 📡 API Endpoints

### Two Integration Options

#### Option 1: Mock Data (Default - No API Key Required)
```
POST http://localhost:4000/casting/analyze
```
- Uses pre-programmed responses
- Instant results
- No AI costs
- Great for development and testing

#### Option 2: Real AI (Requires API Key)
```
POST http://localhost:4000/casting/analyze-ai
```
- Uses Claude Sonnet 4
- Intelligent, context-aware responses
- Industry-specific recommendations
- Real production insights

## 🎯 Using AI-Powered Analysis

### Request Format

```json
{
  "character_name": "Detective Sarah Chen",
  "project_type": "series",
  "budget_range": "high",
  "analysis_type": "casting",
  "additional_context": "8-episode crime thriller set in NYC"
}
```

### Analysis Types

1. **casting** - Character profiles and actor suggestions
2. **budget** - Cost breakdowns and financial analysis
3. **schedule** - Production timelines and milestones

### Response Format

```json
{
  "success": true,
  "ai_powered": true,
  "data": {
    // AI-generated casting/budget/schedule data
  }
}
```

## 🔧 Frontend Integration

### Update the CastingRoom Component

Replace the API call in `frontend/src/components/modules/CastingRoom.tsx`:

```typescript
// Change from:
const response = await fetch(`${API_URL}/casting/analyze`, ...)

// To:
const response = await fetch(`${API_URL}/casting/analyze-ai`, ...)
```

Or create a toggle to switch between mock and AI:

```typescript
const [useAI, setUseAI] = useState(true);

const handleAnalyze = async () => {
  const endpoint = useAI ? '/casting/analyze-ai' : '/casting/analyze';
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      character_name: characterName,
      project_type: projectType,
      budget_range: budgetRange,
      analysis_type: activeTab,
      additional_context: additionalNotes, // New field
    })
  });
};
```

## 💰 Cost Management

### Claude API Pricing (as of 2025)

**Claude Sonnet 4:**
- Input: $3 per million tokens
- Output: $15 per million tokens

### Estimated Costs Per Analysis

Each casting analysis uses approximately:
- **Input tokens**: ~500 tokens (prompt) = $0.0015
- **Output tokens**: ~800 tokens (response) = $0.012
- **Total per request**: ~$0.014 (1.4 cents)

### Monthly Cost Estimates

- **100 analyses/month**: ~$1.40
- **500 analyses/month**: ~$7.00
- **1,000 analyses/month**: ~$14.00

💡 **Tip**: Start with mock data for development, enable AI for production use.

## 🛡️ Error Handling

The system includes automatic fallback:

1. **AI Available**: Returns AI-generated response
2. **AI Fails**: Automatically falls back to mock data
3. **No API Key**: Uses mock endpoint instead

Check the `ai_powered` field in the response:
```json
{
  "ai_powered": true  // Real AI was used
}
```

## 🚀 Testing AI Integration

### 1. Test with cURL

```bash
curl -X POST http://localhost:4000/casting/analyze-ai \
  -H "Content-Type: application/json" \
  -d '{
    "character_name": "Jack Reacher",
    "project_type": "feature",
    "budget_range": "high",
    "analysis_type": "casting"
  }'
```

### 2. Check Encore Dashboard

```bash
cd backend
encore run
```

Open: http://localhost:9400 (Encore Local Dashboard)

### 3. Monitor API Usage

View your Claude API usage at:
https://console.anthropic.com/settings/usage

## 📊 AI Response Quality

### What Claude Provides

**Casting Analysis:**
- Age-appropriate character descriptions
- Industry-standard physical requirements
- Psychologically-informed personality traits
- Specific actor type recommendations
- Professional casting notes

**Budget Analysis:**
- Industry-accurate cost estimates
- Project-type-specific breakdowns
- Budget range appropriate suggestions
- Risk assessment based on production type

**Schedule Analysis:**
- Production-type-specific timelines
- Industry-standard milestone planning
- Critical path identification
- Realistic day counts

## 🔄 Switching Between Mock and AI

### Environment-Based Toggle

```typescript
// backend/ai/casting_room_ai.ts
const USE_AI = process.env.ENABLE_AI === 'true';

export const analyzeCasting = api(
  { method: "POST", path: "/casting/analyze" },
  async (req: CastingRequest) => {
    if (USE_AI && anthropicKey()) {
      return analyzeWithClaude.handler(req);
    }
    return getFallbackResponse(req);
  }
);
```

Then set in `.env`:
```bash
ENABLE_AI=true  # Use AI
ENABLE_AI=false # Use mock data
```

## 📝 Best Practices

### 1. Provide Context
Include `additional_context` for better AI responses:
```typescript
{
  additional_context: "Period piece set in 1920s Chicago, requires strong accent work"
}
```

### 2. Cache Common Queries
Store frequently requested character types to reduce API calls.

### 3. User Feedback Loop
Let users rate AI suggestions to improve prompts over time.

### 4. Rate Limiting
Implement request throttling to control costs:
```typescript
const MAX_REQUESTS_PER_MINUTE = 10;
```

## 🐛 Troubleshooting

### Error: "API key not found"
```bash
encore secret set --type local AnthropicAPIKey
```

### Error: "Rate limit exceeded"
Claude has rate limits:
- **Tier 1**: 50 requests/minute
- **Tier 2**: 1,000 requests/minute

Solution: Implement request queuing or upgrade tier.

### Error: "Could not parse JSON"
AI response format changed. Update the JSON extraction logic in `casting_room_ai.ts`.

## 🎓 Advanced Features

### Custom Prompts
Edit prompts in `generateCastingPrompt()`, `generateBudgetPrompt()`, or `generateSchedulePrompt()` for domain-specific needs.

### Multi-Model Support
Add OpenAI as backup:
```typescript
try {
  return await analyzeWithClaude(req);
} catch (error) {
  return await analyzeWithOpenAI(req);
}
```

### Streaming Responses
For real-time UI updates, use Claude's streaming API:
```typescript
const stream = await anthropic.messages.stream({
  model: "claude-sonnet-4-20250514",
  max_tokens: 2048,
  messages: [{ role: "user", content: prompt }],
});
```

## 📚 Resources

- **Claude API Docs**: https://docs.anthropic.com/
- **Encore Secrets**: https://encore.dev/docs/develop/secrets
- **Model Comparison**: https://www.anthropic.com/claude/models

## ✅ Checklist

- [ ] Obtained Claude API key
- [ ] Set Encore secret
- [ ] Tested AI endpoint
- [ ] Updated frontend to use AI
- [ ] Configured error handling
- [ ] Set up usage monitoring
- [ ] Implemented rate limiting
- [ ] Added user feedback system

---

**🎉 You're ready to use AI-powered casting analysis!**

Start the backend with `encore run` and visit `/casting` to experience intelligent production planning.
