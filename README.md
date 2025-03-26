# Task Management Application

A modern, full-stack task management application built with React, TypeScript, and Supabase. This application allows users to manage their tasks with features like creation, updating, completion tracking, and deletion.



## Features

- 🔐 User Authentication
- ✨ Create new tasks
- 📝 Edit existing tasks
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete tasks
- 📱 Responsive design
- 🎯 Real-time updates
- 🔒 Secure data handling with Row Level Security

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide React (for icons)
  - React Hot Toast (for notifications)

- **Backend:**
  - Supabase (Backend as a Service)
  - javascript
  - PostgreSQL Database
  - Row Level Security
  - Real-time subscriptions

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v8 or higher)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - The migration file is located in `supabase/migrations`
   - It will create the necessary tables and set up Row Level Security policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);
```

## API Endpoints

The application uses Supabase's auto-generated REST API. Here are the main endpoints:

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /rest/v1/tasks | Fetch all tasks for the authenticated user |
| POST   | /rest/v1/tasks | Create a new task |
| PUT    | /rest/v1/tasks?id=eq.{id} | Update an existing task |
| DELETE | /rest/v1/tasks?id=eq.{id} | Delete a task |

## Security

The application implements Row Level Security (RLS) policies to ensure users can only access their own data:

```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
```

## Testing

To test the API endpoints, you can use tools like Postman or curl. Here are some example requests:

### Fetch Tasks
```bash
curl -X GET 'https://[PROJECT_ID].supabase.co/rest/v1/tasks' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

### Create Task
```bash
curl -X POST 'https://[PROJECT_ID].supabase.co/rest/v1/tasks' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ACCESS_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description"}'
```

### Update Task
```bash
curl -X PATCH 'https://[PROJECT_ID].supabase.co/rest/v1/tasks?id=eq.[TASK_ID]' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ACCESS_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Task
```bash
curl -X DELETE 'https://[PROJECT_ID].supabase.co/rest/v1/tasks?id=eq.[TASK_ID]' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

## Deployment

The application is deployed on Netlify. You can view it at: https://cozy-sawine-483527.netlify.app

To deploy your own instance:

1. Fork this repository
2. Connect your fork to Netlify
3. Set up the environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
