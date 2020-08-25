import { Component, OnInit, Input } from '@angular/core';
import { latLng, Map, MapOptions, tileLayer, Marker, marker, LeafletMouseEvent, LatLng, Zoom } from 'leaflet';
import { Icon, IconOptions, icon } from 'leaflet';
import { MapManagementService } from '../api/services/map-management.service';
import { GeoJsonLocation } from '../models/geo-json-location';

const defaultIcon: Icon<IconOptions> = icon({
  // This define the displayed icon size, in pixel
  iconSize: [ 25, 41 ],
  // This defines the pixel that should be placed right above the location
  // If not provided, the image center will be used, and that could be awkward
  iconAnchor: [ 13, 41 ],
  // The path to the image to display. In this case, it's a Leaflet asset
  iconUrl: 'leaflet/marker-icon.png',
  // The path to the image's shadow to display. Also a leaflet asset
  shadowUrl: 'leaflet/marker-shadow.png'
});

const defaultRedIcon: Icon<IconOptions> = icon({
  // This define the displayed icon size, in pixel
  iconSize: [ 32, 32 ],
  // This defines the pixel that should be placed right above the location
  // If not provided, the image center will be used, and that could be awkward
  iconAnchor: [ 16, 32 ],
  // The path to the image to display. In this case, it's a Leaflet asset
  iconUrl: 'leaflet/marker-icon-red.png',
  // The path to the image's shadow to display. Also a leaflet asset
  shadowUrl: 'leaflet/smaller-marker-shadow.png'
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() isEditable: boolean = false;
  @Input() center: LatLng = new LatLng(0,0);
  @Input() zoom: number;
  mapOptions: MapOptions;
  @Input() mapMarkers: Marker[];
  map: Map;
  previousSelectedPlace: Marker;
  markers = new Array();

  readonly ZOOM_MIN = 2;
  readonly ZOOM_MAX = 18;
  readonly ZOOM_CLOSER = 9;
  readonly ZOOM_START = 3;
  
  constructor(
    private stateManagement: MapManagementService
    ) {
      if(!this.zoom)
        this.zoom = this.ZOOM_START;
      
      this.mapOptions = {
        layers: [
          tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: this.ZOOM_MAX,
          minZoom: this.ZOOM_MIN,
        }),
      ],
      zoom: this.zoom,
      center: this.center
    };
  }
  
  onMapReady(map: Map) {
    this.map = map;
    if(this.isEditable){
      this.map.on('click', (event : LeafletMouseEvent) => {
        const coord = event.latlng;
        //console.log(`Map moved to ${coord.lat}, ${coord.lng}`);
      
        if(this.previousSelectedPlace)
          this.removeMarker(this.previousSelectedPlace);
        
        this.previousSelectedPlace = this.renderMarker(
          new Marker([ coord.lat, coord.lng], { icon: defaultRedIcon }));
        
        this.stateManagement.emitClickedPointOnMap(new GeoJsonLocation(coord.lng, coord.lat));
      });
    }
    
    this.stateManagement.coordinates$.subscribe({
      next: coordinates => {
        while(this.markers.length > 0){
          this.removeMarker(this.markers.pop());
        }
        coordinates.forEach( coordinate => {
          this.renderMarker(new Marker(
            [coordinate.lat, coordinate.lng], { icon: defaultIcon }));
      });
    }
  });
  
  this.stateManagement.selectedPlace$.subscribe({
    next: coordinate => {
      let searchedMarker = 
        this.findMarkerWithSameCoordinates(
          coordinate.coordinates[0], coordinate.coordinates[1]);
      
      if(searchedMarker)
        this.map.setView([coordinate.coordinates[1], coordinate.coordinates[0]], this.ZOOM_CLOSER)   
    }
  });
  
}

ngOnInit(): void {}

renderMarker(marker: Marker): Marker{
  marker.addTo(this.map);
  this.markers.push(marker);
  return marker;
}

removeMarker(marker: Marker){
  marker.removeFrom(this.map);
  const index = this.markers.indexOf(marker, 0);
  if (index > -1) {
    this.markers.splice(index, 1);
  }
}

findMarkerWithSameCoordinates(lng: number, lat: number): Marker {
  let retrunedMarker = undefined;
  this.markers.forEach(marker => {
    const latLng = marker.getLatLng();
    
    if(latLng.lat == lat && latLng.lng == lng)
      retrunedMarker = marker;
  });
  return retrunedMarker;
}
}
