import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useStadiums } from './useStadiums';

import { useState } from 'react';

const StadiumMap = () => {
    const { stadiums, loading, error } = useStadiums();

    const [addMode, setAddMode] = useState(false);
    const [newStadium, setNewStadium] = useState(null);
    const [customStadiums, setCustomStadiums] = useState([]);

    const saveStadium = () => {
        setCustomStadiums([...customStadiums, newStadium]);
        setNewStadium(null);
        setAddMode(false);
    };

    return (
        <div className="map-wrapper">
            {loading && <p className="status">Cargando estadios...</p>}
            {error && <p className="status error">{error}</p>}

            <button
                onClick={() => setAddMode(!addMode)}
                style={{
                    position: "absolute",
                    zIndex: 1000,
                    top: 10,
                    left: 50,
                    padding: "8px 12px"
                }}>
                {addMode ? "cancelar" : " agregar estadios"}
            </button>
            {newStadium && (
                <div style={{
                    position: "absolute",
                    zIndex: 1000,
                    bottom: 20,
                    left: 20,
                    background: "white",
                    padding: 12,
                    borderRadius: 8,
                    width: 250
                }}>
                    <h4>Nuevo Estadio</h4>

                    <input type="text" placeholder="Nombre del estadio"
                        onChange={(e) =>
                            setNewStadium({ ...newStadium, name: e.target.value })} />
                    <input type="text" placeholder='Equipo'
                        onChange={(e) =>
                            setNewStadium({ ...newStadium, team: e.target.value })
                        } />
                    <button onClick={saveStadium}>Guardar</button>
                </div>
            )}
            <MapContainer
                center={[-32.8895, -68.8458]}
                zoom={9}
                className="leaflet-map"
                whenReady={(map) => {
                    map.target.on("Click", (e) => {
                        if (!addMode) return;

                        setNewStadium({
                            lat: e.latlng.lat,
                            lon: e.latlng.lng
                        });
                    })
                }}
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
                {customStadiums.map((stadium, index) => (
                    <Marker
                        key={`custom-${index}`}
                        position={[stadium.lat, stadium.lon]}
                    >
                        <Popup>
                            <strong>{stadium.name}</strong>
                            <br />
                            {stadium.team}
                            <br />
                            {stadium.crest && (
                                <img src={stadium.crest} width={40} />
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
        </div>
    );
};
export default StadiumMap;