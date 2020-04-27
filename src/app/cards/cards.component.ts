import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { CardsGeneratorService } from '../cards-generator.service';

import { Card, START_CARD_NUMBER } from '../card-index';

import {
  createDeckMachine,
  PlayerStats,
} from '../cards/+xstate/machines.config';
import { interpret } from 'xstate';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  myCards: Card[] = [];
  aiCards: Card[] = [];
  hands: Card[][] = [this.myCards, this.aiCards];
  discardDeck: Card[] = [];

  static clone<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
  }

  private gameStats: PlayerStats = { current: 0 };
  private mach = createDeckMachine(
    this.buyDeck,
    this.discardDeck,
    [this.myCards, this.aiCards],
    this.gameStats
  );
  private serv = interpret(this.mach)
    .onTransition((state) => {
      console.log(state.value);
      console.log('buy: ' + this.buyDeck);
      console.log('hand1: ' + this.myCards);
      console.warn(CardsComponent.clone(state.context));
    })
    .start();

  constructor(private cgs: CardsGeneratorService) {}

  get buyDeck(): Card[] {
    return this.cgs.buyDeck;
  }

  isSpecialCard(n: number): boolean {
    return this.cgs.isSpecialCard(n);
  }

  shuffleDeck(deck: Card[]) {
    this.cgs.shuffleDeck(deck);
  }

  buy(index: number = 0) {
    this.hands[index].push(this.buyDeck.pop());
  }

  pass() {
    this.serv.send({ type: 'PASS' });
  }

  ngOnInit(): void {
    this.shuffleDeck(this.buyDeck);
    for (let idx in this.hands) {
      for (let i = 0; i < START_CARD_NUMBER; ++i) {
        this.buy(+idx);
      }
    }

    this.discardDeck.push(this.buyDeck.pop());
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private getPlayer(data: unknown): number {
    return this.hands.indexOf(data as Card[]);
  }

  private isFromHand(data: unknown): boolean {
    return this.getPlayer(data) == this.gameStats.current;
  }

  drop2(event: CdkDragDrop<string[]>, topOnly: boolean = false) {
    const from: unknown = event.previousContainer.data;
    const to: unknown = event.container.data;
    const buyAction: boolean = from === this.buyDeck && this.isFromHand(to);
    const discardAction: boolean =
      this.isFromHand(from) && to === this.discardDeck;

    if (buyAction) {
      this.serv.send({
        type: 'BUY',
        player: this.getPlayer(to),
        indexCard: event.currentIndex,
      });
      return;
    }

    if (discardAction) {
      this.serv.send({
        type: 'DISCARD',
        player: this.getPlayer(from),
        indexCard: event.previousIndex,
      });
    }

    return;

    const sameContainer = event.previousContainer === event.container;
    if (sameContainer) {
      if (!topOnly) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
      return;
    }
    // this.serv.send({ type: 'DISCARD', player: 0 });
    const inBuyDeck = event.item.element.nativeElement.classList.contains(
      'buy-deck'
    );

    const _topDiscardCard: any =
      event.container.data[event.container.data.length - 1];
    const _discardedCard: any =
      event.previousContainer.data[event.previousIndex];

    const topDiscardCard: Card = <Card>_topDiscardCard;
    const discardedCard: Card = <Card>_discardedCard;

    if (CardsGeneratorService.isValidCard(topDiscardCard, discardedCard)) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.container.data.length
      );
    } else {
      console.log(
        'Cards' +
          topDiscardCard +
          ' and ' +
          discardedCard +
          ' are incompatible.'
      );
    }
  }

  drop3(event: CdkDragDrop<string[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      0,
      event.currentIndex
    );
  }
}
