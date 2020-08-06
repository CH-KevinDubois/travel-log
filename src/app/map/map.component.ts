import { Component, OnInit } from '@angular/core';
import { latLng, Map, MapOptions, tileLayer, Marker, marker, LeafletMouseEvent } from 'leaflet';
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
  mapOptions: MapOptions;
  mapMarkers: Marker[];
  map: Map;

  constructor(
    private stateManagement: StateManagementService
  ) {
    this.mapOptions = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
        }),
      ],
      zoom: 13,
      center: latLng(46.778186, 6.641524),
    };
    this.mapMarkers = [
      marker([ 46.778186, 6.641524 ], { icon: defaultIcon }),
      marker([ 46.780796, 6.647395 ], { icon: defaultIcon }),
      marker([ 46.784992, 6.652267 ], { icon: defaultIcon })
    ];
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (event : LeafletMouseEvent) => {
      const coord = event.latlng;
      console.log(`Map moved to ${coord.lat}, ${coord.lng}`);
      new Marker([ coord.lat, coord.lng], { icon: defaultIcon }).addTo(map);
      this.stateManagement.getClickedPintOnMapSubject().next(new GeoJsonLocation(coord.lat, coord.lng));
      //console.log(this.map);
      //this.mapMarkers = [marker([ coord.lat, coord.lng ], { icon: defaultIcon })];
      //map.invalidateSize();
    });
  }

  ngOnInit(): void {}

}
