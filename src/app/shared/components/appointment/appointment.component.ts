import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent {
  @Output() removed = new EventEmitter<void>();
  @Output() titleChange = new EventEmitter<string>();

  @Input() title = 'Appointment Title';
  @Input() from = '';
  @Input() to = '';

  @HostListener('click', ['$event'])
  onClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('dblclick', ['$event'])
  onDbClicked(event: MouseEvent) {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      maxWidth: '100%',
      width: '568px',
      autoFocus: false,
      data: {
        title: this.title,
        from: this.from,
        to: this.to,
      }
    });

    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(result => {
      if (result && result.title) {
        this.title = result.title;
        this.titleChange.emit(result.title);
      }
    });
  }

  constructor(
    private dialog: MatDialog,
    public elementRef: ElementRef,
  ) { }

  remove(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.removed.emit();
  }
}
