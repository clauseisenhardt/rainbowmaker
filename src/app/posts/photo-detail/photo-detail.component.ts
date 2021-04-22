import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';

// Using javascript import from src/asset/js/rainbow.js
declare function doRainbow(image): any;
declare function doRealRainbow(image): any;
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
  
  rainbowReady = false;
  curvedRainbowReady = false;
  rainbowImage: any;
  curvedRainbowImage: any;
  
  // Not used now
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
    this.rainbowReady = false;
    this.curvedRainbowReady = false;

    console.log("onLoadPhoto: start");
    console.log("Load Photo: " + this.photo.imagePath);
    //this.getImageFromService(this.photo.imagePath);

    this.getBase64ImageFromURL(this.photo.imagePath).subscribe(base64data => {
      //console.log(base64data);
      this.base64Image = 'data:image/jpg;base64,' + base64data;
      this.base64ImageLoaded = true;
      console.log("Base64 image loaded.");
    });
  
    console.log("onLoadPhoto: end");
  }

  onRainbowIt() {
    console.log("onRainbowIt: doRainbow start");

    this.rainbowImage = doRainbow(this.base64Image);
    //console.log(this.convertedImage);
    this.rainbowReady = true;
    console.log("onRainbowIt: doRainbow end");
  }

  onCurveIt() {
    console.log("onRainbowIt: doRainbow start");

    this.curvedRainbowImage = doRealRainbow(this.base64Image);
    //console.log(this.convertedImage);
    this.curvedRainbowReady = true;
    console.log("onRainbowIt: doRainbow end");
  }
 
  private getImageFromService(imageUrl: string) {
    console.log("getImageFromService: start");
    this.postService.getImageData(imageUrl).subscribe(blob => {
      this.createImageFromBlob(blob);

      console.log("getImageFromService: loading finished");
    }, error => {
      this.rainbowReady = false;
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

// Test get metodes
base64Image: any;
base64ImageLoaded = false;

private getBase64ImageFromURL(url: string) {
  return Observable.create((observer: Observer<string>) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    if (!img.complete) {
      img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
        console.log("getBase64ImageFromURL: Not complete");
      };
      img.onerror = (err) => {
        console.log("getBase64ImageFromURL: Error");
        observer.error(err);
      };
    } else {
      observer.next(this.getBase64Image(img));
      observer.complete();
      console.log("getBase64ImageFromURL: Complete");
    }
  });
}

private getBase64Image(img: HTMLImageElement) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}



}
