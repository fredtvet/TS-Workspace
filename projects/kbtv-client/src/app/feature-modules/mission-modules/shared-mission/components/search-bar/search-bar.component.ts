import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonTypes } from '@shared-app/enums/button-types.enum';
import { AppButton } from '@shared/components/app-button/app-button.interface';
import { SearchBarConfig } from './search-bar-config.interface';

@Component({
  selector: 'app-search-bar',
  template: `
    <mat-toolbar class="search-bar" *ngIf="config">
      <div>
      
        <mat-icon>search</mat-icon>

        <input #searchInput appInputListener fxFlex  
            [placeholder]="config.placeholder" 
            [value]="config.initialValue || ''"
            (inputChanged)="handleSearchFn($event);">

        <ng-container *ngFor="let button of extraButtons || []">
          <mat-divider vertical=true></mat-divider>
          <app-button [config]="button | transformButton : baseSearchBtn">
          </app-button>
        </ng-container>
        
      </div>
    </mat-toolbar>
  `,
  styleUrls: ["./search-bar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent{

  @Input() config: SearchBarConfig;
  @Input() extraButtons: AppButton[];

  baseSearchBtn: Partial<AppButton> = {type: ButtonTypes.Icon}

  handleSearchFn = (criteria: string): void => 
    this.config?.searchCallback(criteria);
}
