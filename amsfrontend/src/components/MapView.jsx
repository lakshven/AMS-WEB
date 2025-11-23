import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

function MapView({ assets }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_API_KEY'
  });

  return isLoaded ? (
    <GoogleMap
      center={{ lat: 52.6, lng: -0.9 }}
      zoom={10}
      mapContainerStyle={{ width: '100%', height: '400px' }}
    >
      {assets.map(asset => (
        <Marker key={asset.id} position={{ lat: asset.lat, lng: asset.lng }} />
      ))}
    </GoogleMap>
  ) : <p>Loading map...</p>;
}