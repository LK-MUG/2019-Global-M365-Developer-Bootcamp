import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import * as strings from 'CasinoShopWebPartStrings';

export interface ICasinoShopWebPartProps {
  description: string;
}

export default class CasinoShopWebPart extends BaseClientSideWebPart<ICasinoShopWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div>
        <img src="https://blog.velingeorgiev.com/media/bigimages/chips-shop.jpg" style="width:100%;max-width:500px;" />
        <h1>Buy chips</h1>
        <div  style="width:100%;padding:5px">
          <label for="name" >Name</label>
          <input type="text" id="name" style="width:50%"/>
        </div>
        <div  style="width:100%;padding:5px">
          <label for="redchips" >Red Chips</label>
          <input type="number" id="redchips" />
        </div>
        <div  style="width:100%;padding:5px">
          <label for="bluechips" >Blue Chips</label>
          <input type="number" id="bluechips" />
        </div>
        <div style="width:100%;padding:5px">
          <label for="greenchips" >Green Chips</label>
          <input type="number" id="greenchips" />
        </div>
        <div style="width:100%;padding:5px">
            <button type="button" id="buy" >Buy</button>
        </div>
        <h1>Sell chips</h1>
        <img src="https://blog.velingeorgiev.com/media/bigimages/money.jpg" style="width:100%;max-width:500px;" />
        <div  style="width:100%;padding:5px">
          <label for="name2" >Name</label>
          <input type="text" id="name2" style="width:50%"/>
        </div>
        <div  style="width:100%;padding:5px">
          <label for="redchips2" >Red Chips</label>
          <input type="number" id="redchips2" />
        </div>
        <div  style="width:100%;padding:5px">
          <label for="bluechips2" >Blue Chips</label>
          <input type="number" id="bluechips2" />
        </div>
        <div style="width:100%;padding:5px">
          <label for="greenchips2" >Green Chips</label>
          <input type="number" id="greenchips2" />
        </div>
        <div style="width:100%;padding:5px">
            <button type="button" id="sell" >Sell</button>
        </div>
        <a href="https://lkmug.sharepoint.com/sites/casino/Lists/CasinoChipOrders" >Chip orders table</a>
        <a href="https://lkmug.sharepoint.com/sites/casino/Lists/CasinoCheckOut" >Users checkout table</a>
      </div>`;

    window.document.getElementById("buy")
      .addEventListener('click', (event: any) => {
        event.preventDefault();
        var name = (window.document.getElementById('name') as any).value;
        var redChips = (window.document.getElementById('redchips') as any).value;
        var greenChips = (window.document.getElementById('greenchips') as any).value;
        var blueChips = (window.document.getElementById('bluechips') as any).value;
        var totalCost = CalculateChipsCost(redChips, greenChips, blueChips);

        if (window.confirm(`Total cost is ${totalCost}`)) {
          UpdateItem('CasinoChipOrders',  [
            {
              "FieldName": "Title",
              "FieldValue": `${name}`
            },
            {
              "FieldName": "RedChips",
              "FieldValue": `${redChips}`
            },
            {
              "FieldName": "BlueChips",
              "FieldValue": `${blueChips}`
            },
            {
              "FieldName": "GreenChips",
              "FieldValue": `${greenChips}`
            },
            {
              "FieldName": "Amount",
              "FieldValue": `${totalCost}`
            }
          ]);
        }
      });

    window.document.getElementById("sell")
      .addEventListener('click', (event: any) => {
        event.preventDefault();
        var name = (window.document.getElementById('name2') as any).value;
        var redChips = (window.document.getElementById('redchips2') as any).value;
        var greenChips = (window.document.getElementById('greenchips2') as any).value;
        var blueChips = (window.document.getElementById('bluechips2') as any).value;
        var totalCost = CalculateChipsCost(redChips, greenChips, blueChips);

        if (window.confirm(`Total cost you earned ${totalCost}`)) {
          UpdateItem('CasinoCheckOut', [
            {
              "FieldName": "Title",
              "FieldValue": `${name}`
            },
            {
              "FieldName": "RedChips",
              "FieldValue": `${redChips}`
            },
            {
              "FieldName": "BlueChips",
              "FieldValue": `${blueChips}`
            },
            {
              "FieldName": "GreenChips",
              "FieldValue": `${greenChips}`
            },
            {
              "FieldName": "Amount",
              "FieldValue": `${totalCost}`
            }
          ]);
        }
      });

    function UpdateItem(listTitle, values) {
      fetch(`https://lkmug.sharepoint.com/sites/casino/_api/contextinfo`, {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "Content-type": "application/json;odata=verbose"
        },
        method: "POST"
      })
        .then((response) => {

          if (!response.ok) {
            console.log(response);
          }
          return response.json();
        })
        .then((response) => {

          console.log(response);

          fetch(`https://lkmug.sharepoint.com/sites/casino/_api/web/lists/getbytitle('${listTitle}')/AddValidateUpdateItemUsingPath`, {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "Content-type": "application/json;odata=verbose",
              "X-RequestDigest": response.FormDigestValue
            },
            method: "POST",
            body: JSON.stringify({
              "formValues": values,
              "bNewDocumentUpdate": false
            })
          }).then((response) => {
            if (!response.ok) {
              console.log(response);
            }
            return response.json();
          })
            .then((response) => {
              console.log(response);
              alert('DONE');
            })
            .catch(err => { alert(err); })

        }).catch(err => { alert(err); })
    }

    function CalculateChipsCost(red, green, blue) {
      var cost = 0;

      cost += (red * 5);
      cost += (green * 25);
      cost += (blue * 50);

      return cost;
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
