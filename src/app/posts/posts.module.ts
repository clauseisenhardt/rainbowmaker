import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PostsComponent } from './posts.component';
import { PostListComponent } from './post-list/post-list.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoItemComponent } from './post-list/photo-item/photo-item.component';
import { PhotoStartComponent } from './photo-start/photo-start.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostsRoutingModule } from './posts-routing.module';
import { AngularMaterialModule } from '../shared/angular-meterial.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PostsComponent,
    PostListComponent,
    PhotoDetailComponent,
    PhotoItemComponent,
    PhotoStartComponent,
    PostCreateComponent
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    PostsRoutingModule,
    AngularMaterialModule,
    SharedModule
  ]
})
export class PostsModule {}
