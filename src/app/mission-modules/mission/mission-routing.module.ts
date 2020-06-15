import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MissionDetailsComponent } from './mission-details/mission-details.component';
import { AuthGuard } from 'src/app/core/services';
import { Roles, AppPages } from 'src/app/shared-app/enums';


const routes: Routes = [
{
  path: '',
  component: MissionListComponent,
  canActivate: [AuthGuard], data: {page: AppPages.MissionList},
  children: [
    {path: 'ny', canActivate: [AuthGuard], data: {preload: true, allowedRoles: [Roles.Leder], page: AppPages.MissionForm}, 
    loadChildren: () => import('src/app/mission-modules/mission-form/mission-form.module').then(m => m.MissionFormModule)},
  ],
},
{
  path: ':id/detaljer',
  component: MissionDetailsComponent,
  canActivate: [AuthGuard], data: {page: AppPages.MissionDetails},
  children: [
    {path: 'rediger', canActivate: [AuthGuard], data: {allowedRoles: [Roles.Leder]},
    loadChildren: () => import('src/app/mission-modules/mission-form/mission-form.module').then(m => m.MissionFormModule)},
  ],
},
{
  path: ':id/bilder',
  loadChildren: () => import('src/app/mission-modules/mission-image-list/mission-image-list.module').then(m => m.MissionImageListModule),
  canActivate: [AuthGuard],data: {preload: true, page: AppPages.MissionImages}
},
{
  path: ':id/dokumenter',
  loadChildren: () => import('src/app/mission-modules/mission-document-list/mission-document-list.module').then(m => m.MissionDocumentListModule),
  canActivate: [AuthGuard],data: {preload: true, page: AppPages.MissionDocuments},
},
{
  path: ':id/notater',
  loadChildren: () => import('src/app/mission-modules/mission-note-list/mission-note-list.module').then(m => m.MissionNoteListModule),
  canActivate: [AuthGuard],data: {preload: true, page: AppPages.MissionNotes},
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionRoutingModule { }