import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import { RouterModule } from '@angular/router';
import { LetModule} from '@rx-angular/template'
@NgModule({
  declarations: [OverlayComponent],
  imports: [
    CommonModule,
    LetModule,
    RouterModule.forChild([
      { path: '', component: OverlayComponent, },
    ]),
  ],
})
export class OverlayModule {}
