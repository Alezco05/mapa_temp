import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import * as Mapboxgl from 'mapbox-gl';
import {
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { PqrService } from 'src/app/services/pqr.service';
import { ProblemList } from '../../interfaces/problem-list';
import { Neighbors } from '../../interfaces/neighbors';
import { Infrastructures } from '../../interfaces/infrastructures';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  mapa: Mapboxgl.Map;
  problems: ProblemList[] = [];
  neighbors: Neighbors[] = [];
  infraestuctures: Infrastructures[] = [];
  lat =  10.985246;
  long = -74.810913;
  marker;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private pqrService: PqrService
  ) { }

  ngOnInit(): void {
    this.makeForm();
    this.createMap();
    this.crearMarcador(this.long, this.lat);
    this.pqrService.getProblem_list().subscribe(
      resp => this.problems = resp,
      err => console.log(err)
    );
    this.pqrService.getInfraestucture().subscribe(
      resp => this.infraestuctures = resp,
      err => console.log(err)
    );
    this.pqrService.getNeighbor_list().subscribe(
      resp => this.neighbors = resp,
      err => console.log(err)
    );
  }
  makeForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      infrastructure_id: ['', Validators.required],
      in_code: ['', Validators.required],
      problem_id: ['', Validators.required],
      neighbor_id: ['', Validators.required],
      address: ['', Validators.required],
      issue: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('[0-9]+')
        ]
      ]
    });
  } // Creado Del Mapa
  createMap() {
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.mapa = new Mapboxgl.Map({
      container: 'mapa2', // container id
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [-74.810913, 10.985246], // LNG, LAT
      zoom: 14 // starting zoom
    });
    // Add zoom and rotation controls to the map.
    this.mapa.addControl(new Mapboxgl.NavigationControl());
    const geolocate = new Mapboxgl.GeolocateControl();
    this.mapa.addControl(geolocate);
    geolocate.on(
      'geolocate',
      (e: { coords: { longitude: number; latitude: number } }) => {
        this.long = e.coords.longitude;
        this.lat = e.coords.latitude;
        if (typeof this.marker === 'object') {
          this.marker.remove();
        }
        this.crearMarcador(this.long, this.lat);
      }
    );
  }
  crearMarcador(lng: number, lat: number) {
    this.marker = new Mapboxgl.Marker({
      draggable: true,
      color: 'red'
    })
      .setLngLat([lng, lat])
      .addTo(this.mapa);
    this.marker.on('dragend', () => {
      this.long = this.marker.getLngLat().lng;
      this.lat = this.marker.getLngLat().lat;
    });
  }
}
