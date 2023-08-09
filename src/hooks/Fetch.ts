import { useEffect, useState } from "react";

export const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            Accept: "application/json",
          },
        });

        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
