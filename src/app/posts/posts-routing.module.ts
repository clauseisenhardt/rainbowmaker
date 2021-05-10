import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostsComponent } from './posts.component';
import { AuthGuard } from "../auth/auth.guard";
import { PhotoStartComponent } from './photo-start/photo-start.component';
import { PostCreateComponent } from "./post-create/post-create.component";
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
    
    children: [
      { path: '', component: PhotoStartComponent },
      { path: 'create', canActivate: [AuthGuard], component: PostCreateComponent },
      {
        path: ':postId',
        component: PhotoDetailComponent,
        //resolve: [PhotosResolverService]
      },
      {
        path: ':postId/:edit',
        canActivate: [AuthGuard],
        component: PostCreateComponent,
        //resolve: [PhotosResolverService]
      }
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule {

}
