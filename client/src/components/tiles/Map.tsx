import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { Event } from "../../models/event";
import axios from "axios";
// require("dotenv").config();

interface MapProps {
    allEvents:Event[] | undefined; 
}

const containerStyle = {
  width: "80%",
  height: "400px",
};

const center = {
  lat: 32,
  lng: 35,
};

const Map: React.FC<MapProps> = ({allEvents}) => {


  console.log(`${process.env.REACT_APP_GOOGLE_KEY}`);


  return (
    <LoadScript googleMapsApiKey="">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1.5}
      >
        <MarkerClusterer 
            averageCenter
            enableRetinaIcons
            gridSize={80}
        >
          {(clusterer) => allEvents?
            allEvents.map(event => {
              return (
                <Marker
                  position={{
                    lat: event.geolocation.location.lat,
                    lng: event.geolocation.location.lng,
                  }}
                  icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  clusterer={clusterer}
                />
              );
            })
          :
          <h1>Loader</h1>
        }
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
