import { Machine, assign } from 'xstate';

import { CardsGeneratorService } from '../../cards-generator.service';
import { Card } from '../../card-index';

const definePlayerEvent = {
  type: 'start',
  seed: 20,
};

const setSeed = assign({
  seed: (context, event) => event,
});

const iStart = (context, event) => {
  return context.seed % 2 === 0;
};

const aiStart = (context, event) => {
  return context.seed % 2 === 1;
};

const CardsMachine = Machine({
  id: 'cards',
  initial: 'prepare',
  context: {
    seed: Math.floor(Math.random() * 1000),
  },
  states: {
    prepare: {
      on: {
        startai: {
          target: 'aiturn',
        },
        startme: {
          target: 'myturn',
        },
        random: [
          { target: 'myturn', cond: iStart },
          { target: 'aiturn', cond: aiStart },
        ],
      },
    },
    myturn: {
      on: {
        endturn: {
          target: 'aiturn',
        },
        emptyhand: {
          target: 'endgame',
        },
      },
    },
    aiturn: {
      on: {
        endturn: {
          target: 'myturn',
        },
        emptyhand: {
          target: 'endgame',
        },
      },
    },
    endgame: {},
  },
});

interface Card {
  number: number;
  naipe: string;
}

let isValidCard = (a: Card, b: Card) => {
  return a.naipe == b.naipe || a.number == b.number;
};

const discardable = (context, event) => {
  return isValidCard(context.card, context.card);
};

const pedestrianStates = {
  initial: 'walk',
  states: {
    walk: {
      on: {
        PED_COUNTDOWN: 'wait',
      },
    },
    wait: {
      on: {
        PED_COUNTDOWN: 'stop',
      },
    },
    stop: {},
    blinking: {},
  },
};

const DeckMachine = {
  initial: 'notempty',
  states: {
    notempty: {
      on: {
        buy: {
          target: 'notempty',
          actions: ['decrement'],
        },
      },
    },
  },
};

const CardMachine = Machine(
  {
    id: 'card',
    initial: 'buyDeck',
    context: {
      card: { number: 1, naipe: 'spades' },
      remaning: 3,
    },
    states: {
      buyDeck: {
        on: {
          buy: 'hand',
        },
      },
      discardPile: {
        on: {
          reset: 'buyDeck',
        },
      },
      hand: {
        on: {
          discard: 'discardPile',
        },

        ...DeckMachine,
      },
    },
  },
  {
    actions: {
      // action implementations
      activate: (context, event) => {
        console.log('activating...');
      },
      notifyActive: (context, event) => {
        console.log('active!');
      },
      notifyInactive: (context, event) => {
        console.log('inactive!');
      },
      sendTelemetry: (context, event) => {
        console.log('time:', Date.now());
      },
    },
  }
);
