import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissions } from '@core/configurations/role-permissions.const';
import { MissionDocument } from '@core/models';
import { DeviceInfoService } from '@core/services/device-info.service';
import { DownloaderService } from '@core/services/downloader.service';
import { ModelState } from '@core/state/model-state.interface';
import { _appFileUrl } from '@shared-app/helpers/app-file-url.helper';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { SelectableContainerWrapperComponent } from '@shared/components/abstracts/selectable-container-wrapper.component';
import { MainTopNavConfig } from '@shared/components/main-top-nav-bar/main-top-nav.config';
import { EmailForm } from '@shared/constants/forms/email-form.const';
import { CreateMissionDocumentForm, MissionDocumentForm } from '@shared/constants/model-forms/create-mission-document-form.const';
import { FileFolder } from '@shared/enums/file-folder.enum';
import { ConfirmDialogService } from 'confirm-dialog';
import { FormService } from 'form-sheet';
import { ImmutableArray, Maybe } from 'global-types';
import { ModelFormService } from 'model-form';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectedMissionIdParam } from '../../mission-list/mission-list-route-params.const';
import { MissionDocumentListFacade } from '../mission-document-list.facade';

interface ViewModel { documents: Maybe<ImmutableArray<MissionDocument>>, isXs: boolean,  fabs: AppButton[], navConfig: MainTopNavConfig}

@Component({
  selector: 'app-mission-document-list',
  templateUrl: './mission-document-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDocumentListComponent extends SelectableContainerWrapperComponent {

  vm$: Observable<ViewModel> = combineLatest([
    this.facade.getMissionDocuments$(this.missionId),
    this.deviceInfoService.isXs$,
    this.currentFabs$
  ]).pipe(
    map(([documents, isXs, fabs]) => { return <ViewModel>{ 
      documents, isXs, fabs, navConfig: this.navConfig
    }})
  )

  private get missionId(): Maybe<string> { 
    return this.route.parent?.parent?.snapshot.paramMap.get(SelectedMissionIdParam) 
  }

  private navConfig: MainTopNavConfig;
  
  constructor( 
    private deviceInfoService: DeviceInfoService,     
    private formService: FormService, 
    private downloaderService: DownloaderService,
    private facade: MissionDocumentListFacade,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: ConfirmDialogService,
    private modelFormService: ModelFormService) {
      super();
      
      this.navConfig = {title:  "Dokumenter", backFn: this.onBack, }

      const can = RolePermissions.MissionDocumentList;

      this.staticFabs = [
        {icon: "note_add", aria: 'Legg til', color: 'accent', callback: this.openDocumentForm, allowedRoles: can.create}
      ];

      this.selectedItemsFabs = [
        {icon: "send", aria: 'Send', color: 'accent', callback: this.openMailDocumentSheet, allowedRoles: can.sendEmail}, 
        {icon: "delete_forever", aria: 'Slett', color: 'warn', callback: this.openConfirmDeleteDialog, allowedRoles: can.delete}
      ]
    }

  downloadDocument = (document: MissionDocument) => 
    document.fileName ? 
    this.downloaderService.downloadUrl(_appFileUrl(document.fileName, FileFolder.Documents)) : null;

  trackByFn = (index: number, entity: MissionDocument) => entity.id

  private deleteSelectedDocuments = () => {
    this.facade.delete({ids: this.currentSelections});    
    this.selectableContainer.resetSelections();
  }

  private openConfirmDeleteDialog = () => {   
    this.confirmService.open({
      title: 'Slett utvalgte dokumenter?', 
      confirmText: 'Slett',
      confirmCallback: this.deleteSelectedDocuments
    })
  }
  
  private openMailDocumentSheet = () => {
    this.formService.open({
      formConfig: {...EmailForm, 
        initialValue: {email: this.facade.getMissionEmployerEmail(this.missionId) }}, 
      navConfig: {title: "Send Dokumenter"},
      submitCallback: (val: EmailForm) => { 
        this.facade.mailDocuments(val.email, this.currentSelections);
        this.selectableContainer.resetSelections();
      },
    })
  }

  private openDocumentForm = (): void => {
    this.modelFormService.open<ModelState, MissionDocumentForm>({
      formConfig: {
        dynamicForm: {...CreateMissionDocumentForm, initialValue: {missionId: this.missionId || undefined}},
        stateProp: "missionDocuments",
      }
    });
  }

  private onBack = () => this.router.navigate(['../'], {relativeTo: this.route.parent});

}
