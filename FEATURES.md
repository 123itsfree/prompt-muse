# New Features Added

## 1. Prompt Upload and Management System

### Admin Panel
- Access via the "Admin Panel" button on the grade selection page or navigate to `/admin`
- Full CRUD operations for journal prompts:
  - Create new prompts
  - Edit existing prompts
  - Delete (soft delete) prompts
  - View all prompts in a table

### Features:
- **Database Storage**: All prompts are stored in Supabase PostgreSQL database
- **Fallback System**: If database is unavailable, system falls back to local prompts data
- **Required Fields**:
  - Prompt ID (unique identifier like '6h1', '7ho5')
  - Title
  - Prompt Text
  - Instructions
  - Grade (6, 7, or 8)
  - Section (Humanity or Honors)
- **Optional Fields**:
  - Background Image URL
  - Example Image URL

### Database Tables:
- **prompts**: Stores all journal prompts with metadata
- **user_progress**: Tracks which prompts each user has finished

## 2. Enhanced Text-to-Speech System

### Human-Like Voices
The system now uses intelligent voice selection to provide the most natural-sounding voice:

**Preferred Voices** (in order):
1. Google US English
2. Microsoft Aria Online (Natural)
3. Microsoft Jenny Online (Natural)
4. Samantha (Mac)
5. Alex (Mac)
6. Other natural/enhanced voices

### Features:
- Automatic selection of the best available voice on the user's device
- Optimized speech rate (0.95x) for clarity
- Proper pitch and volume settings
- Fallback to standard voices if premium voices unavailable

### Voice Selection Logic:
1. Searches for premium/natural voices first
2. Prioritizes female voices for better clarity
3. Falls back to any English voice if needed
4. Works across all modern browsers (Chrome, Safari, Firefox, Edge)

## 3. User Progress Tracking

### Features:
- Each user gets a unique ID stored in localStorage
- Progress synced with Supabase database
- Mark prompts as finished/unfinished
- Progress persists across sessions
- Filter out finished prompts from the wheel

### Storage:
- Primary: Supabase database (user_progress table)
- Fallback: localStorage (for offline use)

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
The database is already configured with:
- Two tables: `prompts` and `user_progress`
- Row Level Security (RLS) policies
- Automatic timestamps
- Indexes for performance

### 3. Using the Admin Panel
1. Login with password: `6677`
2. Navigate to "Admin Panel" from grade selection
3. Click "Add Prompt" to create new prompts
4. Fill in all required fields
5. Optionally add image URLs for background and examples
6. Save and the prompt will be immediately available to students

### 4. Voice System
The voice system works automatically:
- No configuration needed
- Uses Web Speech API
- Best voice selected automatically
- Works on all modern browsers

## Technical Details

### Prompt Service (`src/lib/promptService.ts`)
- Handles all database operations
- Provides fallback to local data
- Manages user progress tracking
- Async/await for all operations

### TTS Service (`src/lib/ttsService.ts`)
- Singleton pattern for voice management
- Intelligent voice selection
- Play/pause/stop controls
- Event handling for completion

### Database Schema
```sql
-- Prompts table
prompts (
  id uuid PRIMARY KEY,
  prompt_id text UNIQUE,
  title text,
  text text,
  instructions text,
  grade integer CHECK (6-8),
  section text CHECK ('Humanity' | 'Honors'),
  background_image text,
  example_image text,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz
)

-- User progress table
user_progress (
  id uuid PRIMARY KEY,
  user_id text,
  prompt_id uuid REFERENCES prompts(id),
  finished_at timestamptz,
  created_at timestamptz,
  UNIQUE(user_id, prompt_id)
)
```

## Browser Compatibility

### Text-to-Speech
- Chrome: Excellent (Google voices)
- Safari: Excellent (Samantha, Alex, etc.)
- Firefox: Good (espeak voices)
- Edge: Excellent (Microsoft Natural voices)

### Database Features
- All modern browsers support fetch API
- LocalStorage fallback for older browsers
- Progressive enhancement approach

## Future Enhancements

Potential improvements:
1. Audio file uploads instead of TTS
2. Custom voice recording by teachers
3. Prompt categories and tags
4. Search and filter in admin panel
5. Bulk prompt upload via CSV/JSON
6. Student response submission
7. Teacher feedback system
8. Analytics and usage statistics
