import { Machine, assign } from 'xstate';
import { CardsGeneratorService } from '../../cards-generator.service';

interface Card {
  number: number;
  naipe: string;
}

interface CardContext {
  card: Card;
}

interface CardSchema {
  states: {
    deck: {};
    pile: {};
    hand: {};
  };
}

type CardEvent = { type: 'BUY' } | { type: 'RESET' } | { type: 'DISCARD' };
// | { type: 'DISCARD'; duration: number };

export const createCardMachine = (card: Card) => {
  return Machine<CardContext, CardSchema, CardEvent>(
    {
      id: 'card',
      initial: 'deck',
      context: {
        card,
      },
      states: {
        deck: {
          on: {
            BUY: {
              target: 'hand',
            },
          },
        },
        pile: {
          on: {
            RESET: 'deck',
          },
        },
        hand: {
          on: {
            DISCARD: 'pile',
          },
        },
      },
    },
    {
      actions: {},
    }
  );
};

type Deck = Card[];

interface DeckContext {
  deck: Card[];
  hand: Deck[];
  pile: Card[];
}

interface DeckSchema {
  states: {
    empty: {};
    full: {};
    used: {};
  };
}

type DeckEvent =
  | { type: 'BUY'; player: number; indexCard: number }
  | { type: 'RESET' }
  | { type: 'DISCARD'; player: number; indexCard: number };
// | { type: 'TRANSFER', player: number, from: CardPos, to: CardPos };

export const createDeckMachine = (buyDeck: Card[], discardDeck: Card[], hands: Deck[]) => {
  return Machine<DeckContext, DeckSchema, DeckEvent>(
    {
      initial: 'used',
      context: {
        hand: hands,
        pile: discardDeck,
        deck: buyDeck,
      },
      states: {
        full: {
          on: {
            BUY: 'used',
          },
        },
        used: {
          on: {
            BUY: [
              {
                target: 'empty',
                cond: 'isEmpty',
              },
              {
                target: 'used',
                actions: (context, event) => {
                  const bought: Card = context.deck.pop();
                  context.hand[event.player].splice(event.indexCard, 0, bought);
                },
              },
            ],
            DISCARD: [
              {
                target: 'used',
                actions: 'discard',
              },
            ],
          },
        },
        empty: {
          on: {
            '': {
              target: 'used',
              cond: 'hasPile',
              actions: (context) => {
                [context.pile, context.deck] = [context.deck, context.pile];
                console.log('Shuffling...');
              },
            },
            DISCARD: [
              {
                target: 'used',
                actions: 'discard'
              },
            ],
          },
        },
      },
    },
    {
      guards: {
        isEmpty: (context) => context.deck.length === 0,
        hasPile: (context) => context.pile.length > 0,
      },
      actions: {
        discard: (context, event) => {
          // TODO: Treat the case when a player choose the next naipe via Jack
          const proposal: Card = context.hand[event.player][event.indexCard];
          const last: number = context.pile.length - 1;
          if (CardsGeneratorService.isValidCard(context.pile[last], proposal)) {
            context.hand[event.player].splice(event.indexCard, 1);
            context.pile.push(proposal);
          }
        }
      }
    }
  );
};
