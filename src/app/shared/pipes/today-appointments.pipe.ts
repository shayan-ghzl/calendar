import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../../pages/home/home.component';
import { formatDateToYYYYMMDD } from '../helper-functions/helper';

@Pipe({
  name: 'todayAppointments',
  standalone: true,
  pure: false
})
export class TodayAppointmentsPipe implements PipeTransform {

  transform(value: Appointment[], today: Date): Appointment[] {
    return value.filter(x => x.today === formatDateToYYYYMMDD(today));
  }

}
