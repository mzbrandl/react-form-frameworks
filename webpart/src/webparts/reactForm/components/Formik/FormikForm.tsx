import * as React from 'react';
import {
  IDropdownOption,
  Label,
  DefaultButton,
  PrimaryButton,
  IPersonaProps, nullRender
} from 'office-ui-fabric-react';
import { Formik, Form, Field, } from 'formik';
import { FormikDropdown, FormikTextField } from 'formik-office-ui-fabric-react';
import * as Yup from 'yup';

import { IListService } from '../../../../services/IListService';

import * as styles from './FormikForm.module.scss';

export interface IFormikFormProps {
  listService: IListService;
}

export interface IFormikFormState {
  locationOptions: IDropdownOption[];
  departmentOptions: IDropdownOption[];
  fileName: string;
  id: number;
}

export class FormikForm extends React.Component<IFormikFormProps, IFormikFormState> {

  constructor(props: IFormikFormProps) {
    super(props);

    this.state = {
      locationOptions: [],
      departmentOptions: [],
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
    const { departmentOptions, locationOptions } = this.state;

    const validationSchema = Yup.object().shape({
      title: Yup.string()
        .required('Required')
        .min(3, 'Too Short!'),
      department: Yup.mixed()
        .required('Required'),
      location: Yup.mixed()
        .required('Required'),
      supervisor: Yup.string()
        .email('Not valid email')
        .required('Required'),
      submitter: Yup.string()
        .required('Required'),
      ideaText: Yup.string()
        .required('Required'),
      currentSituation: Yup.string()
    });

    const initialValues = {
      department: null,
      location: null,
      supervisor: '',
      submitter: '',
      title: '',
      ideaText: '',
      currentSituation: ''
    }

    return (
      <div className={styles.formik}>
        <h1>Formik</h1>

        <Formik
          initialValues={initialValues}
          onSubmit={this.onSubmit}
          validationSchema={validationSchema}>
          {props => (
            <Form>
              <div className={styles.section1}>
                <Label><b>State</b></Label>
                <Label>NEW</Label>

                <Label><b>Filename</b></Label>
                <Label>Idea_1_{props.values.title.replace(/ /gi, '_')}</Label>

                <Label required><b>Department</b></Label>
                <Field name="department"
                  component={FormikDropdown}
                  options={departmentOptions}
                  placeholder='Select department...'
                />

                <Label required><b>Location</b></Label>
                <Field name="location"
                  component={FormikDropdown}
                  options={locationOptions}
                  placeholder='Select location...'
                />

                <Label required><b>Supervisor mail</b></Label>
                <Field name="supervisor" component={FormikTextField} />

                <Label required><b>Submitter name</b></Label>
                <Field name="submitter" component={FormikTextField} />
              </div>
              <div className={styles.section2}>

                <Label className={styles.header} required><b>Idea title</b></Label>
                <Field name="title" component={FormikTextField} maxLength={30} />

                <Label className={styles.header} required><b>Idea description</b></Label>
                <Field name="ideaText"
                  component={FormikTextField}
                  multiline
                  rows={4}
                  resizable={false}
                  autoAdjustHeight
                />

                <Label className={styles.header}><b>Current situation</b></Label>
                <Field name="currentSituation"
                  component={FormikTextField}
                  multiline
                  rows={4}
                  resizable={false}
                  autoAdjustHeight
                />
              </div>
              <div className={styles.buttonWrapper}>
                <DefaultButton onClick={() => props.resetForm()}>Cancel</DefaultButton>
                <PrimaryButton type="submit">Submit</PrimaryButton>
              </div>
            </Form>
          )}
        </Formik>
      </div >
    );
  }

  private onSubmit = async (values, { setSubmitting }) => {
    const { listService } = this.props;
    listService.addIdea(values);
  }
}
