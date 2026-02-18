# How to Activate AI Chat

To make the AI Chat work, you must deploy the backend function to Supabase.

1.  **Get your Gemini API Key**
    *   Go to [Google AI Studio](https://makersuite.google.com/app/apikey) and get a key.

2.  **Login to Supabase CLI**
    ```bash
    npx supabase login
    ```

3.  **Link your Project** (if not linked)
    *   Get your Reference ID from Supabase Dashboard URL (e.g., `knmjmflhmywzjyszgtpb`)
    ```bash
    npx supabase link --project-ref your-project-id
    ```

4.  **Set the API Key**
    ```bash
    npx supabase secrets set GEMINI_API_KEY=your_actual_api_key_here
    ```

5.  **Deploy the Function**
    ```bash
    npx supabase functions deploy ai-chat --no-verify-jwt
    ```

**Note**: The `--no-verify-jwt` flag is important if you want to allow anonymous users to use it (though our code expects a user, Supabase handles auth context automatically. Using standard deploy is fine too, but ensure RLS/Policies allow it if needed. For now, standard deploy is best).

```bash
npx supabase functions deploy ai-chat
```
