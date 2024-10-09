import { Component, Inject, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { _closeDialogVia, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Appointment } from '../../../pages/home/home.component';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';
import { convertMinutesToHHMM } from '../../helper-functions/helper';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    AutoFocusDirective
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss'
})
export class AppointmentDialogComponent {
  title = '';
  from = '';
  to = '';

  constructor(
    @Optional() public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: Appointment,
  ) { }

  ngOnInit(): void {
    if (this.dialogData) {
      this.title = this.dialogData.title;
      this.from = this.dialogData.from || convertMinutesToHHMM((this.dialogData.top - 25) / 0.8);
      this.to = this.dialogData.to || convertMinutesToHHMM(((this.dialogData.top - 25) / 0.8) + 60);
    }
  }

  submit() {
    if (!this.title.trim() || !this.from.trim() || !this.to.trim()) {
      return;
    }

    _closeDialogVia(this.dialogRef, 'mouse', { title: this.title, from: this.from, to: this.to, today: this.dialogData.today, top: this.dialogData.top });
  }
}
