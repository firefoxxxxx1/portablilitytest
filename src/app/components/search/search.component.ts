import { Component, OnInit ,ViewChild} from '@angular/core';
import {StockService} from '../../globalService/stock.service'
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { CdkTableModule} from '@angular/cdk/table';
import {DataSource} from '@angular/cdk/table';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers:[StockService]
})
export class SearchComponent implements OnInit {
  searchKeyword: string = '';
  searchexchange: string = '';
  searchlimit: string = '';
  displayTable:boolean = false
  exchange:Array<any>=[
    {
      name: "NASDAQ"
    },
    {
      name: "AMEX"
    },
    {
      name: "FOREX"
    }
   ]
  limiter: Array<any>=[
  {
   limits : 10
  },
  {
   limits : 50
  },
  {
   limits : 100
  },
  {
   limits : 500
  },

]

// Pagination
displayedColumns: string[] = ['Name', 'Symbol', 'Currency', 'exchangeShortName','Action'];
dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private _StockService: StockService
  ) { }
  sumbitForm(){
    console.log(this.searchKeyword,this.searchlimit,this.searchexchange)
    this._StockService.getStockList(this.searchKeyword,this.searchlimit,this.searchexchange).subscribe(
      data=>{
        console.log(data)
        this.displayTable = true

        this.dataSource.data = data
        this.dataSource.paginator = this.paginator;
      }
    )
  }
  
  downLoadFile(data: any, filename ) {
    // ReadingData
    const replacer = (key, value) => value === null ? '' : value; 
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(',')); 
    const csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' });
    // CraetingData invisible element
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', filename + '.csv');
    downloadLink.style.visibility = 'hidden';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  downloadStatement(symbol: string,companyName: string) {
    this._StockService.downloadStatement(symbol).subscribe(data => {
      console.log(data)
      if(data.symbol){
        this.downLoadFile(data.financials,companyName);
      }else{
        alert("Something went Wrong, Try again later !")

      }
    });
  }
  ngOnInit(): void {

  }

}
