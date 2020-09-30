import * as React from 'react';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/components/ChoiceGroup/ChoiceGroup';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/components/ChoiceGroup/ChoiceGroup.types';

import { ReactFinalForm } from './ReactFinalForm/ReactFinalForm';
import { IListService } from '../../../services/IListService';

import * as styles from './ReactForm.module.scss';
import { MockListService } from '../../../services/MockListService';
import { FormikForm } from './Formik/FormikForm';
import { ReactHookForm } from './ReactHookForm/ReactHookForm';

export interface IReactFormState {
  selectedFrameworkKey: string;
}

export default class ReactForm extends React.Component<{}, IReactFormState> {
  listService: IListService;

  constructor(props) {
    super(props);
    this.state = {
      selectedFrameworkKey: 'react-hook-form',
    };
    this.listService = new MockListService();
  }

  private frameworkOptions: IChoiceGroupOption[] = [
    { key: 'react-hook-form', text: 'React-hook-form' },
    { key: 'formik', text: 'Formik' },
    { key: 'react-final-form', text: 'React-final-form' },
  ];

  public render(): React.ReactElement<{}> {
    const { selectedFrameworkKey } = this.state;

    return (
      <div className={styles.reactForm}>
        <div className={styles.dashboard}>
          <h3>Dashboard</h3>
          <ChoiceGroup
            label="Select form framework"
            selectedKey={selectedFrameworkKey}
            options={this.frameworkOptions}
            onChange={(_ev, option) =>
              this.setState(prevState => ({ ...prevState, selectedFrameworkKey: option.key }))
            }
          />
        </div>
        <div className={styles.form}>
          {this.renderForm()}
        </div>
      </div >
    );
  }

  private renderForm() {
    const { selectedFrameworkKey } = this.state;
    switch (selectedFrameworkKey) {
      case 'state':
        return;
      case 'formik':
        return <FormikForm listService={this.listService} />;
      case 'react-final-form':
        return <ReactFinalForm listService={this.listService} />;
      case 'react-hook-form':
        return <ReactHookForm listService={this.listService} />;
      default:
        return;
    }
  }
}
