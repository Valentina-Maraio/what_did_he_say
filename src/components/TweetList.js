"use client"

import { useEffect, useState } from 'react';

const TweetList = ({ userId }) => {
    const [tweets, setTweets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response =  await fetch(`/api/tweets?userId=${userId}`);
                const data = await response.json();
                setTweets(data.data || []);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTweets();
    }, [userId]);

    if(error) return <p>Error: {error}</p>;

    return (
        <>
        {tweets.map((tweet) => (
            <div key={tweet.id}>
                <p>{tweet.text}</p>
            </div>
        ))}
        </>
    )
}

export default TweetList;