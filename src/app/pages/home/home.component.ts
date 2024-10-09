import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { take } from 'rxjs';
import { AppointmentDialogComponent } from '../../shared/components/appointment-dialog/appointment-dialog.component';
import { AppointmentComponent } from '../../shared/components/appointment/appointment.component';
import { convertMinutesToHHMM, formatDateToYYYYMMDD } from '../../shared/helper-functions/helper';
import { TodayAppointmentsPipe } from '../../shared/pipes/today-appointments.pipe';

export interface Appointment {
  title: string;
  from: string;
  to: string;
  top: number;
  today: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    DragDropModule,
    AppointmentComponent,
    TodayAppointmentsPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {

  hours = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM',
    '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  hourLines = Array(24).fill(0);

  appointments: Appointment[] = [];

  today = new Date();
  day!: string;
  week!: string;
  fullDate!: string;

  boardOffsetTop!: number;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.onDateSelect(this.today);
  }

  addCardComponent(event: MouseEvent): void {
    if (!this.boardOffsetTop) {
      this.boardOffsetTop = (event.currentTarget as HTMLElement).getBoundingClientRect().top;
    }
    const top = event.clientY - this.boardOffsetTop;

    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      maxWidth: '100%',
      width: '568px',
      autoFocus: false,
      data: {
        title: 'Hello World',
        from: '',
        to: '',
        top,
        today: formatDateToYYYYMMDD(this.today)
      }
    });


    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(result => {
      if (result && result.title) {
        this.appointments.push(result);
      }
    });
  }

  dragEnded(appointment: Appointment, appointmentElement: HTMLElement): void {
    const top = appointmentElement.getBoundingClientRect().top - this.boardOffsetTop - 25;

    appointment.top = appointmentElement.getBoundingClientRect().top - this.boardOffsetTop;
    appointment.from = convertMinutesToHHMM((top) / 0.8);
    appointment.to = convertMinutesToHHMM(((top) / 0.8) + 60);
  }

  resetCalendar(calendar: MatCalendar<any>): void {
    this.today = new Date();
    calendar.activeDate = this.today;
    this.onDateSelect(this.today);
  }

  onDateSelect(selectedDate: Date): void {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit' };
    const formatted = selectedDate.toLocaleDateString('en-US', options);
    [this.day, this.week] = formatted.split(' ');

    const fullOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    this.fullDate = selectedDate.toLocaleDateString('en-US', fullOptions);
  }
}
