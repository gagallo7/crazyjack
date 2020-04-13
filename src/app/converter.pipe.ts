import { Pipe, PipeTransform } from '@angular/core';
import { TO_CARD, Card, CardRep, TO_NAIPE } from './card-index'

@Pipe({
  name: 'converter'
})
export class ConverterPipe implements PipeTransform {

  transform(card: Card): CardRep {
    var value: string = "" + card.number;
    if (TO_CARD[card.number] !== undefined) {
      value = TO_CARD[card.number];
    }

    return {
      value: value,
      naipe: TO_NAIPE[card.naipe]
    }
  }
}
