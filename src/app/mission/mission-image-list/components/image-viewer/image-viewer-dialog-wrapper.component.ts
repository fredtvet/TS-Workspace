import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { MissionImageService, DownloaderService } from 'src/app/core/services';
import { AppFile, AppButton } from 'src/app/shared-app/interfaces';
import { Roles } from 'src/app/shared-app/enums';
import { ConfirmDialogComponent, ConfirmDialogConfig } from 'src/app/shared/components';

@Component({
  selector: 'app-timesheet-card-dialog-wrapper',
  template: `
  <app-image-viewer
    [images]="data.images" 
    [currentImage]="data.currentImage"
    [actions]="actions"
    (imageDeleted)="deleteImage($event)"
    (currentImageChanged)="data.currentImage = $event"
    (close)="close()">
  </app-image-viewer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ImageViewerDialogWrapperComponent {
  actions: AppButton[];
  
  constructor( 
    private dialog: MatDialog,
    private downloaderService: DownloaderService,
    private missionImageService: MissionImageService,
    private dialogRef: MatDialogRef<ImageViewerDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {images: AppFile[], currentImage: AppFile}
    ) {}
  
    ngOnInit(): void {
      this.actions = [
        {text: "Last ned bilde", icon: "cloud_download", callback: this.downloadImage},
        {text: "Slett bilde", icon: "delete", callback: this.openConfirmDeleteDialog, allowedRoles: [Roles.Leder]}
      ];
    }

    deleteImage = (id: number) =>
      this.missionImageService.delete$(id)
        .subscribe(x => this.dialogRef.close());

    close = () => this.dialogRef.close();
    
    private deleteCurrentImage = () => 
      this.missionImageService.delete$(this.data.currentImage.id)
        .subscribe(x => this.dialogRef.close());
    
    private downloadImage = () => 
      this.downloaderService.downloadUrl(this.data.currentImage.fileURL)
    
    private openConfirmDeleteDialog = () => {  
      let config: ConfirmDialogConfig = {message: 'Slett bilde?', confirmText: 'Slett'};
      const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {data: config});
      deleteDialogRef.afterClosed().pipe(filter(res => res)).subscribe(res => this.deleteCurrentImage());
    }
  
}