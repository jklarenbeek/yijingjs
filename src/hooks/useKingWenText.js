import { yijing_toWen } from '@yijingjs/core';
import { useState, useEffect } from 'react';

// Module-level cache to store data after the first load.
// This prevents re-importing the JSON when switching hexagrams or unmounting components.
let cachedData = null;

export const useKingWenText = (hexagram) => {
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. If data is already cached, we are done.
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    // 2. Otherwise, fetch the JSON dynamically.
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const jsonUrl = `${import.meta.env.BASE_URL}kingwen-en.json`;
        const response = await fetch(jsonUrl);

        cachedData = await response.json();
        setData(cachedData);  // Store in cache
      }
      catch (err) {
        console.error("Failed to load I Ching texts:", err);
        setError(err);
      }
      finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array ensures this only runs on mount

  // 3. derive the specific hexagram text safely
  const obj = (data && Number.isInteger(hexagram))
    ? data[yijing_toWen(hexagram)]
    : null;

  return { data: obj, loading, error };
};
