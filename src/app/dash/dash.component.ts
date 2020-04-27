import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { createDeckMachine } from '../cards/+xstate/machines.config'
import { interpret } from 'xstate';
import { CardsGeneratorService } from '../cards-generator.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  static clone<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
  }


  constructor(private breakpointObserver: BreakpointObserver) {
    console.log(CardsGeneratorService.newDeck(1));
    // const mach = createCardMachine({number: 7, naipe: "diamonds"});
    // const serv = interpret(DeckMachine)
    // const serv = interpret(mach)
    // const mach = createDeckMachine([], []);
    // const serv = interpret(mach)
    // .onTransition(state => {
    //   console.log(state.value);
    //   console.warn(DashComponent.clone(state.context));
    // })
    // .start()

    // serv.send({type: 'BUY', player: 0});
    // serv.send({type: 'BUY', player: 0});
    // serv.send({type: 'BUY', player: 1});
    // serv.send({type: 'BUY', player: 1});
    // serv.send({type: 'BUY', player: 1});
    // serv.send({type: 'BUY', player: 1});
    // serv.send({type: 'BUY', player: 1});
    // serv.send({type: 'BUY', player: 1});
    // serv.send({type: 'BUY', player: 1});
    // console.log("Discard");
    // serv.send({type: 'DISCARD', player: 1});
    // console.log("BUy");
    // serv.send({type: 'BUY', player: 0});
    // serv.send({type: 'BUY', player: 0});
    // serv.send({type: 'RESET'});
  }
}
