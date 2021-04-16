import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';

// Using javascript import from src/asset/js/rainbow.js
declare function doRainbow(image): any;

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  @Input() photo: Post;
  @Input() index: number;
  postId;

  isPhotoLoading = true;
  photoConverterActive = false;
  localImage: any;
  convertedImage: string;

  constructor(
    public postService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("PhotoDetailComponent:ngOnInit");
    this.isPhotoLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId'))
      {
        this.postId = paramMap.get('postId');
        console.log("Has postId: " + this.postId);

        this.postService.getPost(this.postId).subscribe(postData => {
          this.photo = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.isPhotoLoading = false;
          this.onLoadPhoto();
          console.log("Photo loaded: " + postData._id);
        });
      }
    });
    console.log("PhotoDetailComponent:ngOnInit - end.")    
   }

  onEditPhoto() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeletePhoto() {
    // this.photoService.deletePhoto(this.id);
    this.router.navigate(['/posts']);
  }

  private onLoadPhoto() {
    this.photoConverterActive = true;
    console.log("onLoadPhoto: start");
    console.log("Load Photo: " + this.photo.imagePath);

    this.getImageFromService(this.photo.imagePath);
    console.log("onLoadPhoto: end");
  }

  onRainbowIt() {
    console.log("onRainbowIt: doRainbow start");
    console.log(this.localImage);
    let image = new Image(this.localImage);
    this.convertedImage = doRainbow(image);//this.localImage);
    console.log(this.convertedImage);
    this.photoConverterActive = false;
    console.log("onRainbowIt: doRainbow end");
  }

  private getImageFromService(imageUrl: string) {
    console.log("getImageFromService: start");
    this.postService.getImageData(imageUrl).subscribe(blob => {
      this.createImageFromBlob(blob);

      console.log("getImageFromService: loading finished");
    }, error => {
      this.photoConverterActive = false;
      console.log(error);
    });
  }

  private createImageFromBlob(image: Blob) {
    console.log("createImageFromBlob: start");
     let reader = new FileReader();
     reader.addEventListener("load", () => {
        this.localImage = reader.result;
     }, false);

     if (image) {
        console.log("createImageFromBlob: read image");
        reader.readAsArrayBuffer(image);
     }
     console.log("createImageFromBlob: end");
  }
}
