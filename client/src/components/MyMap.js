import React, {useState} from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

const MyMap = (props) => {
    const getMapOptions = (maps) => {
        return {
            disableDefaultUI: true,
            mapTypeControl: true,
            streetViewControl: true,
            styles: [{featureType: 'poi', elementType: 'labels', stylers: [{visibility: 'on'}]}],
        };
    };

    const [center, setCenter] = useState({lat: 50.45466, lng: 30.5238});
    const [zoom, setZoom] = useState(11);
    return (
        <div style={{height: '100%', width: '100%'}}>
            <GoogleMapReact
                bootstrapURLKeys={{key: 'AIzaSyA81reuSrqMQKghDk6ytLHY8F1FTHDLKIg'}}
                defaultCenter={center}
                defaultZoom={zoom}
                options={getMapOptions}
            >
                <Marker
                    lat={50.45466}
                    lng={30.5238}
                    name="My Marker"
                    color="red"
                />
            </GoogleMapReact>
        </div>
    );
};

export default MyMap;
