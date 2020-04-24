export interface Card {
    number : number;
    naipe : string;
}

export interface CardRep {
    value : string;
    naipe : string;
}

export const NAIPES : string[] = [
    "diamonds", "spades", "hearts", "cloves"
]

export const SPECIAL_NUMBERS : number[] = [
    1,
    7,
    9,
    11, // jack
    12, // queen
]

export const CARD_POINTS : {[key: number]: number} = {
    1: 15,
    7: 20,
    9: 10,
    11: 20,
    12: 10
}

export const TO_CARD : {[key: number]: string} = {
    1: "A",
    11: "J",
    12: "Q",
    13: "K"
}

export const TO_NAIPE : {[key: string]: string} = {
    "spades": "\u2660",
    "hearts": "\u2665",
    "diamonds": "\u2666",
    "cloves": "\u2663",
}

export const START_CARD_NUMBER : number = 9;
