import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';

// Using javascript import from src/asset/js/rainbow.js
declare function doRainbow(image): any;
declare function doRealRainbow(image): any;
declare function doRealRainbow(image,radius:number,horisontalShift:number,verticalShift:number,thickness:number): any;
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
  altRainbowReady = false;
  rainbowImage: any;
  curvedRainbowImage: any;
  altCurvedRainbowImage: any

  // Rainbow parameters  
  radius = 1.0;
  horisontalShift = 0.0;
  verticalShift = 0.0;
  thicknessScale = 1.0;
  
  // Not used now
  localImage: any;
  convertedImage: string;

  curveParametersForm: FormGroup;

  // Authentication
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userId: string = null;

  constructor(
    public postService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log("PhotoDetailComponent:ngOnInit");
    this.userId = this.authService.getUserId();
    console.log("Authenticated user: " +this.userId);

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
      console.log("Authenticated user: " +this.userId);
    });

    this.isPhotoLoading = true;
    this.initForm();

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
    this.postService.deletePost(this.postId).subscribe(() => {
      this.isPhotoLoading = false;
      this.router.navigate(['/posts']);
      this.postService.getPosts();
    });
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

  onSpecialCurves() {
    console.log("onSpecialCurves: doRainbow start");
    this.radius = this.curveParametersForm.value.radius;
    this.horisontalShift = this.curveParametersForm.value.horisontalShift;
    this.verticalShift = this.curveParametersForm.value.verticalShift;
    this.thicknessScale = this.curveParametersForm.value.thicknessScale;

    console.log("Parameters: ");
    console.log("   Radius =     " + this.radius);
    console.log("   Horisontal = " + this.horisontalShift);
    console.log("   Vertical =   " + this.verticalShift);
    console.log("   thickness =  " + this.thicknessScale);

    this.altCurvedRainbowImage = doRealRainbow(this.base64Image,
      this.radius,this.horisontalShift,this.verticalShift,this.thicknessScale);
    //console.log(this.convertedImage);
    this.altRainbowReady = true;
    console.log("onSpecialCurves: doRainbow end");
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
        };    console.log("Parameters: ");
        console.log("   Radius =     " + this.radius);
        console.log("   Horisontal = " + this.horisontalShift);
        console.log("   Vertical =   " + this.verticalShift);
        console.log("   thickness =  " + this.thicknessScale);
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

  private initForm() {
    this.radius = 1.0;
    this.horisontalShift = 0.0;
    this.verticalShift = 0.0;
    this.thicknessScale = 1.0;

    this.curveParametersForm = new FormGroup({
      radius: new FormControl(this.radius, [Validators.required]),
      horisontalShift: new FormControl(this.horisontalShift, Validators.required),
      verticalShift: new FormControl(this.verticalShift, Validators.required),
      thicknessScale: new FormControl(this.thicknessScale, Validators.required)
    });
  }

  onParamChange(){
    console.log("Parametes changed!")
    
    console.log("Parameters: ");
    console.log("   Radius =     " + this.curveParametersForm.value.radius);
    console.log("   Horisontal = " + this.curveParametersForm.value.horisontalShift);
    console.log("   Vertical =   " + this.curveParametersForm.value.verticalShift);
    console.log("   thickness =  " + this.curveParametersForm.value.thicknessScale);
  }
}
