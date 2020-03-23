import { Component, OnInit } from '@angular/core';

import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.prod';
import { PqrService } from '../../services/pqr.service';
import { Pqr } from '../../interfaces/pqr';
import { Neighbors } from '../../interfaces/neighbors';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  pqrs: Pqr[] = [];
  mapa: Mapboxgl.Map;
  options: any[] = [];
  // tslint:disable-next-line: no-inferrable-types
  barrio: number = 0;
  // tslint:disable-next-line: no-inferrable-types
  infraestructura: number = 0;
  // tslint:disable-next-line: no-inferrable-types
  problema: number = 0;
  marker: Mapboxgl.Marker;
  currentMarkers = [];
  constructor(private pqrService: PqrService) {
  }

  ngOnInit(): void {
    this.pqrService.getPqrs().subscribe(resp => {
      this.pqrs = resp;
      this.createMap(this.pqrs);
    });
  }
 // Funciones del MAPA
 createMap(pqrs: Pqr[]) {
  (Mapboxgl as any).accessToken = environment.mapboxKey;
  this.mapa = new Mapboxgl.Map({
    container: 'mapa', // container id
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [-74.810913, 10.985246], // LNG, LAT
    zoom: 14 // starting zoom
  });
  // Add zoom and rotation controls to the map.
  this.mapa.addControl(new Mapboxgl.NavigationControl());
  if (pqrs.length > 0) {
    pqrs.forEach(pqr => this.crearMarcador(pqr.issue, pqr.long, pqr.lat));
  }
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
  this.currentMarkers.push(this.marker);
}
// Filtrar Barrios
ordenarBarrios(e) {
  if (this.currentMarkers !== null) {
    for (let i = this.currentMarkers.length - 1; i >= 0; i--) {
      this.currentMarkers[i].remove();
    }
  }
  if (this.pqrs.length > 0) {
    this.pqrs.forEach(pqr => {
      // tslint:disable-next-line: triple-equals
      if (pqr.neighbor_id == e) {
        this.crearMarcador(pqr.issue, pqr.long, pqr.lat);
      }
    });
  }
}
}
