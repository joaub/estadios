import { useState, useEffect } from "react";

export const useStadiums = () => {
    const [stadiums, setStadiums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const query = `
                    [out:json][timeout:25];
                    area["ISO3166-1"="AR"]->.searchArea;
                    (
                    node["leisure"="stadium"]["sport"="soccer"](area.searchArea);
                    way["leisure"="stadium"]["sport"="soccer"](area.searchArea);
                    relation["leisure"="stadium"]["sport"="soccer"](area.searchArea);
                    );
                    out center tags;`;
                const res = await fetch(
                    'https://overpass.kumi.systems/api/interpreter',
                    {
                        method: 'POST',
                        body: query,
                    }
                );
                const data = await res.json();
                setStadiums(data.elements);
            } catch (error) {

                setError(error.message || "ha ocurrido un error al cargar los estadios");
            } finally {
                setLoading(false);
            }
        }
        fetchStadiums();
    }, [])
    return { stadiums, loading, error };
}
