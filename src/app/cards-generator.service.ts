import { Injectable } from '@angular/core';

import { SPECIAL_NUMBERS, NAIPES, Card } from './card-index'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsGeneratorService {
  buyDeck: Card[] = [];
  discardDeck: Card[] = [];
  obsTest(observer) {
    // synchronously deliver 1, 2, and 3, then complete
    observer.next(3);
    observer.next(4);
    observer.next(2);
    // observer.complete();
  }

  constructor() {
    for (let naipe of NAIPES) {
      for (let i = 1; i <= 13; ++i) {
        this.buyDeck.push({ number: i, naipe: naipe });
      }
    }

  }

  shuffleDeck(deck: Card[]) {
    var newDeck: Card[] = [];
    const numberOfShuffles: number = deck.length;

    for (let i = 0; i < numberOfShuffles; ++i) {
      var index = Math.floor(Math.random() * 100) % deck.length;

      newDeck.push(deck[index]);
      deck.splice(index, 1);
    }

    newDeck.forEach(val => deck.push(Object.assign({}, val)));

    console.log(newDeck);
  }

  randomCard(): number {
    return Math.floor(Math.random() * 100) % 14;
  }

  nCards(n: number): number[] {
    var cards: number[] = [];

    for (let i = 0; i < n; ++i) {
      cards.push(this.randomCard());
    }

    return cards;
  }

  isSpecialCard(n: number): boolean {
    return SPECIAL_NUMBERS.indexOf(n) >= 0;
  }
}
