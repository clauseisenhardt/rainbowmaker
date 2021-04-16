import { Component, OnInit, Input } from '@angular/core';
import { PhotoDetailComponent } from '../../photo-detail/photo-detail.component';

import { Post } from '../../post.model';

@Component({
  selector: 'app-photo-item',
  templateUrl: './photo-item.component.html',
  styleUrls: ['./photo-item.component.css']
})
export class PhotoItemComponent implements OnInit {
  @Input() photo: Post;
  @Input() id: number;

  ngOnInit() {
    console.log("PhotoItemComponent:ngOnInit " + this.id);

  }
}
