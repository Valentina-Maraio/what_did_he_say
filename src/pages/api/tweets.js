"use client"
// Function to handle fetching with retry logic to manage rate limits
async function fetchWithRetry(url, options, retries = 3, backoff = 3000) {
    try {
      // Make the fetch request
      const response = await fetch(url, options);
  
      // If successful, return the JSON data
      if (response.ok) return response.json();
      console.log(response)
  
      // If we hit a rate limit (status 429) and still have retries, wait and retry
      if (response.status === 429 && retries > 0) {
        console.warn("Rate limit hit. Retrying after backoff...");
        await new Promise((resolve) => setTimeout(resolve, backoff)); // Wait before retrying
        return fetchWithRetry(url, options, retries - 1, backoff * 2); // Retry with increased wait time
      }
  
      // If an error response (but not a 429 rate limit error), throw an error
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  // Main API route handler function
  export default async function handler(req, res) {
    const { userId, maxResults = 5 } = req.query;
  
    try {
      // Step 1: Fetch user data to get the user ID based on their username
      const userData = await fetchWithRetry(
        `https://api.twitter.com/2/users/by/username/${userId}`,
        {
          headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
        }
      );
  
      // Extract the user ID from the response data
      const user_id = userData.data.id;
  
      // Step 2: Fetch tweets using the obtained user ID
      const tweetsData = await fetchWithRetry(
        `https://api.twitter.com/2/users/${user_id}/tweets?max_results=${maxResults}`,
        {
          headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
        }
      );
  
      // Send the tweets data as the response
      res.status(200).json(tweetsData);
    } catch (error) {
      console.error("API route error:", error.message); // Log any errors for debugging
      res.status(500).json({ error: error.message }); // Return error message if something goes wrong
    }
  }