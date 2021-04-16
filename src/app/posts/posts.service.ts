import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Post } from './post.model'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient,
              private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{
      message: string,
       posts: any,
      maxPosts: number }>(
        environment.backendUrl + 'posts' + queryParams
    )
    .pipe(
      map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPost: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      //console.log(transformedPostData);
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPost
      });
      console.log('Posts updated!');
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(environment.backendUrl + 'posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    console.log("PostService:addPost: " + title);
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>(
      environment.backendUrl + 'posts',
       postData
      )
      .subscribe((respData) => {
        console.log(respData.message);

        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string ) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }
    else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    console.log('Update Post: ' + id);
    this.http.put(
      environment.backendUrl + 'posts/' + id, postData)
    .subscribe(
      // response => console.log(response)
      response => {
        this.router.navigate(["/"]);
        console.log('Post Uddated!');
      }
    );
  }

  deletePost(postId: string) {
    console.log('Post Delete: ' + postId);
    return this.http.delete(
      environment.backendUrl + 'posts/'+postId);
  }

  private getFilename(str) {
    return str.substring(str.lastIndexOf('/')+1);
  }

  getImageData(imageUrl: string): Observable<Blob> {
    console.log("getImageService: start");
    console.log("getImageService: imageUrl: " + imageUrl);

    // let downloadUrl = environment.backendUrl + 
    //   'posts/files/' + 
    //   this.getFilename(imageUrl);
    // console.log("getImageService: downloadUrl: " + downloadUrl);

    return this.http.get(imageUrl, { responseType: 'blob' });
  }

}
