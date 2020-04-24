import { Injectable } from '@angular/core';

import { SPECIAL_NUMBERS, NAIPES, Card } from './card-index';
import { AssertionError } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class CardsGeneratorService {
  buyDeck: Card[] = [];
  discardDeck: Card[] = [];

  static newDeck = (total = 13) => {
    var deck: Card[] = [];
    for (let naipe of NAIPES) {
      for (let i = 1; i <= total; ++i) {
        deck.push({ number: i, naipe: naipe });
      }
    }

    return deck;
  };

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

    newDeck.forEach((val) => deck.push(Object.assign({}, val)));

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

  validCards(topCard: Card, hand: Card[]): Card[] {
    var valid: Card[] = [];

    hand.forEach((card) => {
      // Jack is always valid
      if (CardsGeneratorService.isValidCard(topCard, card)) {
        valid.push(card);
      }
    });

    return valid;
  }

  static assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new AssertionError(msg)
    }
  }

  static isValidCard(topCard: Card, card: Card, chosenNaipe?: string): boolean {
    if (chosenNaipe) {
      CardsGeneratorService.assert(topCard.number === 11);
      return chosenNaipe === card.naipe || card.number === 11;
    }
    return (
      card.number == 11 ||
      card.naipe == topCard.naipe ||
      card.number == topCard.number
    );
  }
}
