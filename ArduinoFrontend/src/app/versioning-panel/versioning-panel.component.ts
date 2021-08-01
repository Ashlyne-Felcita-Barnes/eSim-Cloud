import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Login } from '../Libs/Login';
import { CreateVariationDialogComponent } from './create-variation-dialog/create-variation-dialog.component';

@Component({
  selector: 'app-versioning-panel',
  templateUrl: './versioning-panel.component.html',
  styleUrls: ['./versioning-panel.component.css']
})
export class VersioningPanelComponent implements OnInit {

  branches = [
  ]

  constructor(
    private _dialog: MatDialog,
    private api: ApiService,
    private aroute: ActivatedRoute
  ) {
    this.aroute.queryParams.subscribe(params => {
      const token = Login.getToken();
      const id = params.id;
      this.api.listAllVersions(id, token).subscribe((v) => {

        console.log('--->', v);
        for (const e in v) {
          let found = false;
          // check if already avail
          for (const i in this.branches) {
            if (this.branches[i].name === v[e].branch) {
              this.branches[i].versions.push(v[e])
              found = true;
            }
          }
          if (found) {
            continue;
          } else {
            let obj = { name: v[e].branch, versions: [v[e]] }
            this.branches.push(obj);
          }
        }

      })
    })
  }

  ngOnInit() {
  }

  createBranch() {
    this._dialog.open(CreateVariationDialogComponent)
  }

}
