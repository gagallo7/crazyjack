import { Machine, assign } from 'xstate';
import { CardsGeneratorService } from '../../cards-generator.service';

interface Card {
  number: number;
  naipe: string;
}

enum PLAYERS {
  human,
  ai,
}

interface PlayerContext {
}

interface PlayerSchema {
  states: {
    [p in keyof typeof PLAYERS];
  };
}

type PlayerEvent = { type: 'NEXT' } | { type: 'RESET' } | { type: 'DISCARD' };
// | { type: 'DISCARD'; duration: number };

export const createPlayerMachine = () => {
  return Machine<PlayerContext, PlayerSchema, PlayerEvent>(
    {
      initial: 'human',
      states: {
        human: {
          on: {
            NEXT: {
              target: 'ai',
            },
          },
        },
        ai: {
          on: {
            NEXT: 'human',
          },
        },
      },
    },
    {
      actions: {},
    }
  );
};

enum NAIPE {
  UNDEFINED,
  DIAMONDS,
  SPADES,
  HEARTS,
  CLOVES
};

type Deck = Card[];

interface DeckContext {
  deck: Card[];
  hand: Deck[];
  pile: Card[];
  maxPlayers: number;
  naipe: NAIPE;
  stats: PlayerStats;
}

export interface PlayerStats {
  current: number;
}

interface DeckSchema {
  states: {
    empty: {};
    full: {};
    used: {};
    nextPlayer: {};
    bought: {};
  };
}

type DeckEvent =
  | { type: 'BUY'; player: number; indexCard: number }
  | { type: 'RESET' }
  | { type: 'PASS' }
  | { type: 'DISCARD'; player: number; indexCard: number };
// | { type: 'TRANSFER', player: number, from: CardPos, to: CardPos };

const isValidCard = (context: DeckContext, event: DeckEvent): (boolean | Card)[] => {
  const proposal: Card = context.hand[event.player][event.indexCard];
  const topCard: Card = context.pile[context.pile.length - 1];
  return [CardsGeneratorService.isValidCard(topCard, proposal), proposal];
}

export const createDeckMachine = (
  buyDeck: Card[],
  discardDeck: Card[],
  hands: Deck[],
  playerStats: PlayerStats
) => {
  return Machine<DeckContext, DeckSchema, DeckEvent>(
    {
      initial: 'used',
      context: {
        naipe: NAIPE.UNDEFINED,
        hand: hands,
        pile: discardDeck,
        deck: buyDeck,
        stats: playerStats,
        maxPlayers: hands.length
      },
      states: {
        full: {
          on: {
            BUY: 'used',
          },
        },
        nextPlayer: {
          on: {
            '': {
              target: 'used',
              actions: (context, _) => {
                context.stats.current = (context.stats.current + 1) % context.maxPlayers
              },
            }
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
                target: 'bought',
                actions: (context, event) => {
                  const bought: Card = context.deck.pop();
                  context.hand[event.player].splice(event.indexCard, 0, bought);
                },
              },
            ],
            DISCARD: [
              {
                target: 'nextPlayer',
                cond: 'isValid',
                actions: 'discard',
              },
            ],
          },
        },
        bought: {
          on: {
            DISCARD: [
              {
                target: 'nextPlayer',
                actions: 'discard',
                cond: 'isValid'
              },
            ],
            PASS: [
              {
                target: 'nextPlayer',
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
                target: 'nextPlayer',
                actions: 'discard',
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
        isValid: (context, event) => {
          return isValidCard(context, event)[0];
        }
      },
      actions: {
        discard: (context, event) => {
          // TODO: Treat the case when a player choose the next naipe via Jack
          const [valid, proposal] = isValidCard(context, event)
          if (valid) {
            context.hand[event.player].splice(event.indexCard, 1);
            context.pile.push(proposal);
          }
        },
      },
    }
  );
};
