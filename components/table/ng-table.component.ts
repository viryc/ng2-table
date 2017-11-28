import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ng-table',
  template: `
    <table class="table dataTable" ngClass="{{config.className || ''}}"
           role="grid" style="width: 100%;">
      <thead>
        <tr role="row">
          <th *ngIf="editConfig.show">
            {{ editConfig.title }}
          </th>
          <th *ngFor="let column of columns" [ngTableSorting]="config" [column]="column" 
              (sortChanged)="onSortChanged($event)" ngClass="{{column.className || ''}}">
            {{column.title}}
            <i *ngIf="config && column.sort" class="pull-right fa"
              [ngClass]="{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}"></i>
          </th>
        </tr>
      </thead>
      <tbody>
      <tr *ngIf="showFilterRow">
        <td *ngIf="editConfig.show"></td>
        <td *ngFor="let column of columns">
          <input *ngIf="column.filtering" placeholder="{{column.filtering.placeholder}}"
                 [ngTableFiltering]="column.filtering"
                 class="form-control"
                 style="width: auto;"
                 (keyup)="onColumnFilterChanged(column)"/>
        </td>
      </tr>
        <tr *ngFor="let row of rows; trackBy: trackByRow">
          <td *ngIf="editConfig.show" ngClass="{{editConfig.className || ''}}">
            <input *ngIf="editConfig.select" type="checkbox" [name]="editConfig.select.name" [id]="row[editConfig.select.keyProperty]" ngClass="{{editConfig.select.className || ''}}" (change)="onSelectChange($event.target.checked, row[editConfig.select.keyProperty])" />
            <button *ngIf="editConfig.edit" type="button" ngClass="{{editConfig.edit.className || ''}}" (click)="onEdit(row)"><span *ngIf="editConfig.edit.icon" [class]="editConfig.edit.icon"></span>{{ editConfig.edit.title }}</button>
            <button *ngIf="editConfig.delete" type="button" ngClass="{{editConfig.delete.className || ''}}" (click)="onDelete(row)"><span *ngIf="editConfig.delete.icon" [class]="editConfig.delete.icon"></span>{{ editConfig.delete.title }}</button>
          </td>
          <td (click)="cellClick(row, column.name)" *ngFor="let column of columns" [innerHtml]="sanitize(getData(row, column.name))"></td>
        </tr>
      </tbody>
    </table>
  `
})
export class NgTableComponent {
  // Table values
  @Input() public rows:Array<any> = [];

  @Input()
  public set config(conf:any) {
    if (!conf.className) {
      conf.className = 'table-striped table-bordered';
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }
    this._config = conf;
  }

  // Outputs (Events)
  @Output() public tableChanged:EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked:EventEmitter<any> = new EventEmitter();
  @Output() public editClicked: EventEmitter<any> = new EventEmitter();
  @Output() public deleteClicked: EventEmitter<any> = new EventEmitter();
  @Output() public selectChange: EventEmitter<any> = new EventEmitter();
  @Output() public sortChanged: EventEmitter<any> = new EventEmitter();
  @Output() public filterChanged: EventEmitter<any> = new EventEmitter();

  public showFilterRow:Boolean = false;

  @Input()
  public set columns(values:Array<any>) {
    values.forEach((value:any) => {
      if (value.filtering) {
        this.showFilterRow = true;
      }
      if (value.className && value.className instanceof Array) {
        value.className = value.className.join(' ');
      }
      let column = this._columns.find((col:any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });
  }

  @Input()
  public set editConfig(editConf: any) {
    if (editConf.className instanceof Array) {
      editConf.className = editConf.className.join(' ');
    }
    editConf.show = editConf.select || editConf.edit || editConf.delete;
    if (editConf.edit) {
      if (!editConf.edit.className) {
        editConf.edit.className = 'btn';
      }
      if (editConf.edit.className instanceof Array) {
        editConf.edit.className = editConf.edit.className.join(' ');
      }
    }
    if (editConf.delete) {
      if (!editConf.delete.className) {
        editConf.delete.className = 'btn';
      }
      if (editConf.delete.className instanceof Array) {
        editConf.delete.className = editConf.delete.className.join(' ');
      }
    }
    if (editConf.select) {
      if (editConf.select.className instanceof Array) {
        editConf.select.className = editConf.select.className.join(' ');
      }
    }
    this._editConfig = editConf;
  }

  private _columns:Array<any> = [];
  private _config:any = {};
  private _editConfig: any = {};

  public constructor(private sanitizer:DomSanitizer) {
  }

  public sanitize(html:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public get columns():Array<any> {
    return this._columns;
  }

  public get config():any {
    return this._config;
  }

  public get editConfig(): any {
    return this._editConfig;
  }

  public get configColumns():any {
    let sortColumns:Array<any> = [];

    this.columns.forEach((column:any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  public get filteringColumns():any {
    let filterColumns: Array<any> = [];

    this.columns.forEach((column:any) => {
      if (column.filtering && column.filtering.filterString) {
        filterColumns.push(column);
      }
    });
    return {columns: filterColumns};
  }

  public onChangeTable(column:any):void {
    this._columns.forEach((col:any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });
    this.tableChanged.emit({sorting: this.configColumns, filtering: this.filteringColumns});
  }

  public onSortChanged(column: any):void {
    this.sortChanged.emit(column);
    this.onChangeTable(column);
  }

  public onColumnFilterChanged(column: any):void {
    this.filterChanged.emit(column);
    this.onChangeTable(column);
  }

  public getData(row:any, propertyName:string):string {
    return propertyName.split('.').reduce((prev:any, curr:string) => prev[curr], row);
  }

  public cellClick(row:any, column:any):void {
    this.cellClicked.emit({row, column});
  }

  public onSelectChange(checked: boolean, key: any): void {
    this.selectChange.emit({selected: checked, key: key});
  }

  public onEdit(row: any):void {
    this.editClicked.emit(row);
  }

  public onDelete(row: any): void {
    this.deleteClicked.emit(row);
  }

  public trackByRow(index: number, row: any): any {
    if (this.config && this.config.idRow) {
      return row[this.config.idRow];
    }
    return index;
  }
}
