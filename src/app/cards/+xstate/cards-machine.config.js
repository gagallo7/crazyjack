"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var xstate_1 = require("xstate");
var definePlayerEvent = {
    type: 'start',
    seed: 20
};
var setSeed = assign({
    seed: function (context, event) { return event; }
});
var iStart = function (context, event) {
    return context.seed % 2 === 0;
};
var aiStart = function (context, event) {
    return context.seed % 2 === 1;
};
var CardsMachine = Machine({
    id: 'cards',
    initial: 'prepare',
    context: {
        seed: Math.floor(Math.random() * 1000)
    },
    states: {
        prepare: {
            on: {
                startai: {
                    target: 'aiturn'
                },
                startme: {
                    target: 'myturn'
                },
                random: [
                    { target: 'myturn', cond: iStart },
                    { target: 'aiturn', cond: aiStart },
                ]
            }
        },
        myturn: {
            on: {
                endturn: {
                    target: 'aiturn'
                },
                emptyhand: {
                    target: 'endgame'
                }
            }
        },
        aiturn: {
            on: {
                endturn: {
                    target: 'myturn'
                },
                emptyhand: {
                    target: 'endgame'
                }
            }
        },
        endgame: {}
    }
});
var isValidCard = function (a, b) {
    return a.naipe == b.naipe || a.number == b.number;
};
var discardable = function (context, event) {
    return isValidCard(context.card, context.card);
};
var pedestrianStates = {
    initial: 'walk',
    states: {
        walk: {
            on: {
                PED_COUNTDOWN: 'wait'
            }
        },
        wait: {
            on: {
                PED_COUNTDOWN: 'stop'
            }
        },
        stop: {},
        blinking: {}
    }
};
var DeckMachine = {
    initial: 'notempty',
    states: {
        notempty: {
            on: {
                buy: {
                    target: 'notempty',
                    actions: ['decrement']
                }
            }
        }
    }
};
var CardMachine = Machine({
    id: 'card',
    initial: 'buyDeck',
    context: {
        card: { number: 1, naipe: 'spades' },
        remaning: 3
    },
    states: {
        buyDeck: {
            on: {
                buy: 'hand'
            }
        },
        discardPile: {
            on: {
                reset: 'buyDeck'
            }
        },
        hand: __assign({ on: {
                discard: 'discardPile'
            } }, DeckMachine)
    }
}, {
    actions: {
        // action implementations
        activate: function (context, event) {
            console.log(context.remaning--);
        },
        notifyActive: function (context, event) {
            console.log('active!');
        },
        notifyInactive: function (context, event) {
            console.log('inactive!');
        },
        sendTelemetry: function (context, event) {
            console.log('time:', Date.now());
        }
    }
});
