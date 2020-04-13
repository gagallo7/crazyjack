import { Component, OnInit, Input } from '@angular/core';
import {  CardRep } from '../card-index';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input()
  card : CardRep;

  constructor() { }

  ngOnInit(): void {
  }

}
