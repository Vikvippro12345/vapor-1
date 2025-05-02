export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      // Proxy OpenAI-style requests to Groq
      if (url.pathname === "/request-ai") {
        const body = await request.text();
  
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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"
          },
          body,
        });
  
        return new Response(groqResponse.body, {
          status: groqResponse.status,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      // Simple test path
      if (url.pathname === "/test-fetch") {
        return new Response(JSON.stringify({
          message: "Worker is live!",
          time: new Date().toISOString()
        }), {
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
  
      // All other paths: serve static assets
      return env.ASSETS.fetch(request);
    },
  };
  