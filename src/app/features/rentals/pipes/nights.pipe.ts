import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nights',
  standalone: true,
})
export class NightsPipe implements PipeTransform {
  transform(dates: [string | Date, string | Date] | undefined): number {
    if (!dates || !dates[0] || !dates[1]) {
      return 0;
    }
    const [from, to] = dates;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const differenceInTime = toDate.getTime() - fromDate.getTime();
    return Math.round(differenceInTime / (1000 * 3600 * 24));
  }
}