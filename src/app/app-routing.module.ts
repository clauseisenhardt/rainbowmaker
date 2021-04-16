import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

const appRoutes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
//  { path: 'posts', loadChildren: './posts/posts.module#PostsModule' },
  { path: 'posts', loadChildren: () => import("./posts/posts.module").then(m => m.PostsModule) },
  { path: 'auth', loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)}

  //  , { path: '', component: PostListComponent },
  // { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: 'auth', loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
