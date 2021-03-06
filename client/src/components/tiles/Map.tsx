import React from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { Event } from "../../models/event";
import {MapContainer} from "./style";
import {REACT_APP_GOOGLE_KEY} from '../secret'

interface MapProps {
  allEvents: Event[] | undefined;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  gestureHandling: "cooperative"
};

const center = {
  lat: 32,
  lng: 35,
};

const Map: React.FC<MapProps> = ({ allEvents }) => {

  return (
    <MapContainer>
      <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={1.5}>
          <MarkerClusterer averageCenter enableRetinaIcons gridSize={80}>
            {(clusterer) =>
              allEvents ? (
                allEvents.map((event) => {
                  return (
                    <Marker
                      key={event._id}
                      position={{
                        lat: event.geolocation.location.lat,
                        lng: event.geolocation.location.lng,
                      }}
                      icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                      clusterer={clusterer}
                    />
                  );
                })
              ) : (
                <h1>Loader</h1>
              )
            }
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    </MapContainer>
  );
};

export default Map;
