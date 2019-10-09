import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import styles from './CasinoShopWebPart.module.scss';
import * as strings from 'CasinoShopWebPartStrings';

export interface ICasinoShopWebPartProps {
  description: string;
}

export default class CasinoShopWebPart extends BaseClientSideWebPart<ICasinoShopWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div>
        <img src="https://blog.velingeorgiev.com/media/bigimages/chips-shop.jpg" style="width:100%" />
        <img src="https://blog.velingeorgiev.com/media/bigimages/money.jpg" style="width:100%" />
      </div>`;

      this.domElement.getElementsByClassName(`${ styles.button }`)[0]
      .addEventListener('click', (event: any) => {
        event.preventDefault();
        alert('Welcome to the SharePoint Framework!');
      });
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
