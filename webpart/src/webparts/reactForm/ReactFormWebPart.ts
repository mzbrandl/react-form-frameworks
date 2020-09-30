import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ReactFormWebPartStrings';
import ReactForm from './components/ReactForm';
import { initializeIcons } from 'office-ui-fabric-react';

export interface IReactFormWebPartProps {
  description: string;
}

export default class ReactFormWebPart extends BaseClientSideWebPart<IReactFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<{}> = React.createElement(
      ReactForm,
      {
        description: this.properties.description
      }
    );
    initializeIcons();

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
