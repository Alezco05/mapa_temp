import { Component, OnInit } from '@angular/core';

import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapa: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  constructor() { }

  ngOnInit(): void {
    this.createMap();
  }

  createMap() {
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.mapa = new Mapboxgl.Map({
      container: 'mapa', // container id
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [-74.810913, 10.985246], // LNG, LAT
      zoom: 14 // starting zoom
    });
    // Add zoom and rotation controls to the map.
    this.mapa.addControl(new Mapboxgl.NavigationControl());
    this.crearMarcador('Hola', -74.810913, 10.985246);
  }
  crearMarcador(text: string, lng: number, lat: number) {
    const popup = new Mapboxgl.Popup({ offset: 25 }).setText(text);
    this.marker = new Mapboxgl.Marker({
      draggable: true,
      color: 'red'
    })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.mapa);
    // this.currentMarkers.push(this.marker);
  }
}
