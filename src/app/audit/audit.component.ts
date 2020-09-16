import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';


declare var $: any;
@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit
{
    audits = [];
    currentUser: any;
    sortDir: number;
    searchText: string= '';
    dateFormatCntrl = new FormControl(0);

    formatArray = [
      {id: 1, dateValue: '12Hr'},
      {id: 2, dateValue: '24Hr'}
    ]
  today: string;
  dateConverted: string;
  hour24Date: string;
  hour12Date: string;
  show24Date: boolean;
  show12Date: boolean;
    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService, private datePipe: DatePipe
    )
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(this.currentUser)
    }

    ngOnInit()
    {
      this.today = new Date().toISOString();
        this.loadAllAudits();
        
    }

    private loadAllAudits()
    {
        this.auditService.getAll()
            .pipe(first())
            .subscribe(audits => {
                this.audits = audits;
            });
    }

    onSortAudits(event, name,tableData) {
        let target = event.currentTarget,
          classList = target.classList;
        if (classList.contains('fa-chevron-up')) {
          classList.remove('fa-chevron-up');
          classList.add('fa-chevron-down');
          this.sortDir=-1;
        } else {
          classList.add('fa-chevron-up');
          classList.remove('fa-chevron-down');
          this.sortDir=1;
        }
        this.sortAudits(name,tableData);
      }
      sortAudits(colName:any,tableData){
        tableData.sort((a,b)=>{
          if(typeof a[colName] == 'string' && typeof b[colName] == 'string'){
          a= a[colName].toLowerCase();
          b= b[colName].toLowerCase();
          return a.localeCompare(b) * this.sortDir;
          }else {
            return(a[colName]-b[colName]) *this.sortDir;
          }
        });
      } 

      onSelectDate(val){
        if(val == 2 ){
          this.show24Date = true;  this.show12Date = false;
         this.hour24Date =  this.datePipe.transform(this.today, 'dd/MM/yyyy HH:mm:ss');
        }else if(val == 1) {
          this.show12Date = true;    this.show24Date = false;
        const dateFormat   =  this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm:ss'); 
          var result = dateFormat.split(' ')[1] ;
           let hour : any= (result.split(':'))[0];
           let min = (result.split(':'))[1];
           let seconds = (result.split(':'))[2];
           min = (min+'').length == 1 ? `0${min}` : min;
           hour = hour > 12 ? hour - 12 : hour;
           hour = (hour+'').length == 1 ? `0${hour}` : hour;
            seconds = (seconds+'').length == 1 ? `0${seconds}` : seconds;
           var hour12Date = dateFormat.split(' ')[0] + ' '+ `${hour}:${min}:${seconds}`;
           this.hour12Date = hour12Date;
           return hour12Date;
        }
      }
}