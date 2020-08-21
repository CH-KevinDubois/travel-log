import { Component, OnInit, Input } from '@angular/core';
import { latLng, Map, MapOptions, tileLayer, Marker, marker, LeafletMouseEvent, LatLng, Zoom } from 'leaflet';
import { Icon, IconOptions, icon } from 'leaflet';
import { StateManagementService } from '../api/services/state-management.service';
import { GeoJsonLocation } from '../models/geo-json-location';

const defaultIcon: Icon<IconOptions> = icon({
  // This define the displayed icon size, in pixel
  iconSize: [ 25, 41 ],
  // This defines the pixel that should be placed right above the location
  // If not provided, the image center will be used, and that could be awkward
  iconAnchor: [ 13, 41 ],
  // The path to the image to display. In this case, it's a Leaflet asset
  iconUrl: 'leaflet/pin.svg',
  // The path to the image's shadow to display. Also a leaflet asset
  shadowUrl: 'leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() isEditable: boolean = false;
  @Input() center: LatLng = new LatLng(0,0);
  @Input() zoom: number = 2;
  mapOptions: MapOptions;
  @Input() mapMarkers: Marker[];
  map: Map;
  previousSelectedPlace: Marker;
  markers = new Array();

  constructor(
    private stateManagement: StateManagementService
  ) {
    this.mapOptions = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          minZoom: 2,
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
        console.log(`Map moved to ${coord.lat}, ${coord.lng}`);

        if(this.previousSelectedPlace)
          this.previousSelectedPlace.removeFrom(map);

        this.previousSelectedPlace = new Marker([ coord.lat, coord.lng], { icon: defaultIcon }).addTo(map);
        this.stateManagement.getClickedPointOnMapSubject().next(new GeoJsonLocation(coord.lat, coord.lng));
        //console.log(this.map);
        //this.mapMarkers = [marker([ coord.lat, coord.lng ], { icon: defaultIcon })];
        //map.invalidateSize();
      });
    }

    this.stateManagement.coordinates$.subscribe({
      next: coordinates => {
        while(this.markers.length > 0){
          this.removeMarker(this.markers.pop());
        }
        coordinates.forEach( coordinate => {
          this.markers.push(new Marker([ coordinate.coordinates[0], coordinate.coordinates[1]], { icon: defaultIcon }).addTo(map))
        });
        this.markers.forEach( marker => this.renderMarker(marker));
      }
    })

  }

  ngOnInit(): void {}

  renderMarker(marker: Marker){
    marker.addTo(this.map);
  }

  removeMarker(marker: Marker){
    marker.removeFrom(this.map);
  }
}
