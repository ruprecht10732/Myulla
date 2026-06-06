import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowService } from './flow.service';
import { TimeGateComponent } from './step0-time-gate';
import { CardFlipComponent } from './step1-card-flip';
import { TypewriterComponent } from './step2-typewriter';
import { StatsComponent } from './step3-stats';
import { SpotlightComponent } from './step4-spotlight';
import { MapFusionComponent } from './step5-map-fusion';
import { SelfieComponent } from './step6-selfie';
import { EmotionalIntroComponent } from './step7-intro';
import { GiftRevealComponent } from './step8-reveal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
      CommonModule,
      TimeGateComponent,
      CardFlipComponent,
      TypewriterComponent,
      StatsComponent,
      SpotlightComponent,
      MapFusionComponent,
      SelfieComponent,
      EmotionalIntroComponent,
      GiftRevealComponent
  ],
  template: `
    @switch(flow.currentStep()) {
      @case(0) { <app-time-gate></app-time-gate> }
      @case(1) { <app-card-flip></app-card-flip> }
      @case(2) { <app-typewriter></app-typewriter> }
      @case(3) { <app-stats></app-stats> }
      @case(4) { <app-spotlight></app-spotlight> }
      @case(5) { <app-map-fusion></app-map-fusion> }
      @case(6) { <app-selfie></app-selfie> }
      @case(7) { <app-emotional-intro></app-emotional-intro> }
      @case(8) { <app-gift-reveal></app-gift-reveal> }
    }
  `
})
export class App {
    flow = inject(FlowService);
}
