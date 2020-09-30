import * as React from 'react';
import {
  IDropdownOption,
  Label,
  Dropdown,
  TextField,
  DefaultButton,
  PrimaryButton,
  IPersonaProps
} from 'office-ui-fabric-react';
import { Form, Field, FieldRenderProps, FormRenderProps } from 'react-final-form';

import { IListService } from './../../../../services/IListService';

import * as styles from './ReactFinalForm.module.scss';

export interface IReactFinalFormProps {
  listService: IListService;
}

export interface IReactFinalFormState {
  locationOptions: IDropdownOption[];
  departmentOptions: IDropdownOption[];
  peopleList: IPersonaProps[];
  fileName: string;
  id: number;
}

export class ReactFinalForm extends React.Component<IReactFinalFormProps, IReactFinalFormState> {

  constructor(props: IReactFinalFormProps) {
    super(props);

    this.state = {
      locationOptions: [],
      departmentOptions: [],
      peopleList: [],
      fileName: 'Idea_',
      id: 1,
    };
  }

  public async componentDidMount() {
    const { listService } = this.props;

    const departments = await listService.getDepartments();
    const locations = await listService.getLocations();

    const departmentOptions = departments.map((department, index) => ({ key: index, text: department }))
    const locationOptions = locations.map((location, index) => ({ key: index, text: location }))

    this.setState(prevState => ({ ...prevState, departmentOptions, locationOptions }));
  }


  public render() {
    const { departmentOptions, locationOptions, id, fileName } = this.state;

    return (
      <div className={styles.reactFinalForm}>
        <h1>React-final-form</h1>

        <Form
          initialValues={{ id, fileName }}
          onSubmit={this.onSubmit}>
          {(formProps: FormRenderProps) => <form
            onSubmit={event => (formProps.handleSubmit(event))}>

            <div className={styles.section1}>

              <Label ><b>State</b></Label>
              <Label >NEW</Label>

              <Label ><b>Filename</b></Label>
              <Label >{fileName}{id}_{formProps.values['title'] &&
                (formProps.values['title'] as string).replace(/ /gi, '_')}</Label>

              <Label required ><b>Department</b></Label>
              <Field name='department' validate={this.required}>
                {fieldProps => <div onBlur={fieldProps.input.onBlur}>
                  <Dropdown
                    {...fieldProps.input}
                    placeholder='Select department...'
                    selectedKey={formProps.values['department'] && formProps.values['department'].key}
                    onChanged={(option) => {
                      fieldProps.input.onChange(option);
                    }}
                    errorMessage={fieldProps.meta.touched && fieldProps.meta.error}
                    options={departmentOptions}
                  />
                </div>}
              </Field>

              <Label required ><b>Location</b></Label>
              <Field name='location' validate={this.required}>
                {fieldProps => <div onBlur={fieldProps.input.onBlur}>
                  <Dropdown
                    {...fieldProps.input}
                    placeholder='Select location...'
                    selectedKey={formProps.values['location'] && formProps.values['location'].key}
                    onChanged={(option) => {
                      fieldProps.input.onChange(option);
                    }}
                    errorMessage={fieldProps.meta.touched && fieldProps.meta.error}
                    options={locationOptions}
                  />
                </div>}
              </Field>

              <Label required><b>Supervisor mail</b></Label>
              <Field name='supervisor' validate={this.composeValidators(this.required, this.email)}>
                {fieldProps => <TextField
                  {...fieldProps.input}
                  errorMessage={fieldProps.meta.touched && fieldProps.meta.error}
                />}
              </Field>

              <Label required><b>Submitter name</b></Label>
              <Field name='submitter' validate={this.required}>
                {fieldProps => <TextField
                  {...fieldProps.input}
                  errorMessage={fieldProps.meta.touched && fieldProps.meta.error}
                />}
              </Field>

            </div>

            <div className={styles.section2}>

              <Label className={styles.header} required ><b>Idea title</b></Label>
              <Field name='title' validate={this.required}>
                {fieldProps => <TextField
                  {...fieldProps.input}
                  maxLength={50}
                  errorMessage={fieldProps.meta.touched && fieldProps.meta.error}
                />}
              </Field>

              <Label className={styles.header} required><b>Idea description</b></Label>

              <Field name='ideaText' validate={this.required}>
                {fieldProps => <TextField
                  {...fieldProps.input}
                  multiline
                  rows={4}
                  resizable={false}
                  autoAdjustHeight
                  errorMessage={fieldProps.meta.touched && fieldProps.meta.error}
                  onChanged={fieldProps.input.onChange}
                />}
              </Field>

              <Label className={styles.header} ><b>Current situation</b></Label>
              <Field name='currentSituation' >
                {fieldProps => <TextField
                  {...fieldProps.input}
                  multiline
                  rows={4}
                  resizable={false}
                  autoAdjustHeight
                  errorMessage={fieldProps.meta.touched && fieldProps.meta.error}
                  onChanged={fieldProps.input.onChange}
                />}
              </Field>
            </div>

            <div className={styles.buttonWrapper}>
              <DefaultButton onClick={() => formProps.form.reset()} >Cancel</DefaultButton>
              <PrimaryButton type='submit'>Submit</PrimaryButton>
            </div>
          </form>}
        </Form>
      </div >
    );

  }

  private onSubmit = async (values): Promise<void> => {
    const { listService } = this.props;
    await listService.addIdea(values);
  }

  /**
   * Validators
   */

  private composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined)

  private required = (value: any) => {
    if (!value) {
      return 'Required';
    }
    if (value && value.key === -1) { // for dropdowns
      return 'Required';
    }
    return undefined;
  }

  private email = value => {
    if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(value)) {
      return undefined;
    }
    return 'Not a valid email';
  }
}
