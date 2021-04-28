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
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PhotoStartComponent },
      { path: 'create', component: PostCreateComponent },
      {
        path: ':postId',
        component: PhotoDetailComponent,
        //resolve: [PhotosResolverService]
      },
      {
        path: ':postId/:edit',
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
