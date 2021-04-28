import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First post', content: 'This is post number 1 '},
  //   {title: 'Second post', content: 'This is post number 2 '},
  //   {title: 'Third post', content: 'This is post number 3 '},

  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [1, 2, 5, 10, 20, 100];
  userIsAuthenticated = false;
  userId: string;
  private postSub: Subscription;
  private authStatusSub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute,
    public postService: PostsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, (this.pageIndex + 1));
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number }) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
      console.log("ngOnInit: Posts Loaded: " + this.totalPosts);
      console.log("ngOnInit: Page data: " 
      + " currentPage=" + this.pageIndex
      + " postsPerPage=" + this.pageSize);

    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.pageIndex);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangePage(pageData: PageEvent) {
    console.log("onChangePage: totalPosts=" + this.totalPosts 
      + " pageIndex=" + pageData.pageIndex
      + " pageSize=" + pageData.pageSize);
    console.log(pageData);

    this.isLoading = true;
    this.pageIndex = pageData.pageIndex;
    this.pageSize = pageData.pageSize;

    this.postService.getPosts(this.pageSize, (this.pageIndex + 1));
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
