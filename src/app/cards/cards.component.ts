import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { CardsGeneratorService } from '../cards-generator.service'

import { Card } from '../card-index';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  cards: Number[];
  myCards: Card[] = [];
  discardDeck: Card[] = [];

  constructor(private cgs: CardsGeneratorService) {
  }

  get buyDeck(): Card[] { return this.cgs.buyDeck; }

  isSpecialCard(n: number): boolean {
    return this.cgs.isSpecialCard(n);
  }

  shuffleDeck(deck: Card[]) {
    this.cgs.shuffleDeck(deck);
  }

  buy() {
    this.myCards.push(this.buyDeck.pop());
  }

  ngOnInit(): void {
    this.cards = this.cgs.nCards(this.cgs.randomCard());
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

  drop2(event: CdkDragDrop<string[]>, topOnly: boolean = false) {
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.container.data.length);
  }

  drop3(event: CdkDragDrop<string[]>) {
    console.log("jmmm");
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);
  }
}
