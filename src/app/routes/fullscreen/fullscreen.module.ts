import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullScreenComponent } from './fullscreen.component';
@NgModule({
  declarations: [FullScreenComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: FullScreenComponent }]),
  ],
})
export class FullScreenModule {}
