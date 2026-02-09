import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useStadiums } from './useStadiums';
import { useState } from 'react';

const StadiumMap = () => {
    const { stadiums, loading, error } = useStadiums();

    const [addMode, setAddMode] = useState(false);
    const [newStadium, setNewStadium] = useState(null);
    const [customStadiums, setCustomStadiums] = useState([]);

    return (
        <div className="map-wrapper">
            {loading && <p className="status">Cargando estadios...</p>}
            {error && <p className="status error">{error}</p>}

            <button 
            onClick={() => setAddMode(!addMode)}>
                { addMode ? "cancelar" : " agregar estadios"}
            </button>
            <MapContainer
                center={[-32.8895, -68.8458]}
                zoom={9}
                className="leaflet-map"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {!loading &&
                    stadiums.map(stadium => {
                        const lat = stadium.lat || stadium.center?.lat;
                        const lon = stadium.lon || stadium.center?.lon;
                        if (!lat || !lon) return null;

                        return (
                            <Marker key={stadium.id} position={[lat, lon]}>
                                <Popup>
                                    <strong>{stadium.tags?.name || 'Estadio sin nombre'}</strong>
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>
        </div>
    );
};
export default StadiumMap;