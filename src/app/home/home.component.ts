import { Component, OnInit } from '@angular/core';
import * as Web3 from 'web3';
import * as shajs from 'sha.js';

declare let window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private filesToUpload: File = null;
  private web3js: any;
  private myContract: any;

  private myContractAddress = '0x7a9e8e89f681bca9145098116ccb261acb4d1eb7';
  private myContractABI: any = JSON.parse('[{"constant":true,"inputs":[{"name":"_docHash","type":"string"}],"name":"getStamp","outputs":[{"name":"signer","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_docHash","type":"string"}],"name":"newStamp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":true,"name":"docHash","type":"string"},{"indexed":true,"name":"signer","type":"address"}],"name":"StampDocument","type":"event"}]');
  resultHash: any;
  checkHash: any;
  constructor() {
  }

  ngOnInit() {
    // Utilitza Mist/MetaMask com a proveïdor
    this.web3js = new Web3(window.web3.currentProvider);
    // Comproba la connexió amb el Mist/Metamask
    if (this.web3js.version.network !== '4') {
      alert('Si us plau, connecteu-vos a la xarxa Rinkeby');
    } else {
      this.myContract = this.web3js.eth.contract(this.myContractABI).at(this.myContractAddress);
    }
  }

  stampNewDoc() {
    console.log(this.resultHash, this.web3js.eth.accounts[0]);
    if (this.resultHash === undefined || this.resultHash === '') {
      alert('You must choose a document to stamp it!');
    } else {
      this.myContract.newStamp.sendTransaction(this.resultHash, { from: this.web3js.eth.accounts[0] },
        function(err, txHash) {
          if (err) {
            alert(err.message);
          } else {
            alert('El document ha estat estampat! ' +
              'TxHash:' + txHash);
          }
        }
      );
    }
  }

  getStamp(checkHash) {
    console.log(checkHash);
    if (checkHash === undefined || checkHash === '') {
      alert('Necessites carregar el document o introduir el hash per verificar!');
    } else {
      this.myContract.getStamp(checkHash,
        function (err, result) {
          if (err) {
            console.log(err.message);
          }
          alert('El document ha estat signat per: ' + result);
        });
    }
  }

  handleFileInput(file: File, index) {
    this.filesToUpload = file[0];
    const reader = new FileReader();
    const fileData = new Blob([this.filesToUpload]);

    reader.readAsArrayBuffer(fileData);

    reader.onload = () => {
      const arrayBuffer = reader.result;
      const bytes = new Uint8Array(arrayBuffer);

      const res = Object.keys(bytes).map(function(key) {
        return bytes[key];
      });
      if (index === 0) {
        this.resultHash = shajs('sha256').update(JSON.stringify(res)).digest('hex');
      } else {
        this.checkHash = shajs('sha256').update(JSON.stringify(res)).digest('hex');
      }
    };
  }
}
