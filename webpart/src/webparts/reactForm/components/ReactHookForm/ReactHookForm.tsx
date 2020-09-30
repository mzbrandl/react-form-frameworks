import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Label,
  Dropdown,
  TextField,
  DefaultButton,
  PrimaryButton
} from '@fluentui/react';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from "yup";

import { IListService } from '../../../../services/IListService';

import * as styles from './ReactHookForm.module.scss';

export interface IReactHookFormProps {
  listService: IListService;
}

export function ReactHookForm(props: IReactHookFormProps) {

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  useEffect(() => {
    props.listService.getDepartments()
      .then(departments => setDepartmentOptions(
        departments.map((department, index) => (
          { key: `department_${index}`, text: department }
        )))
      );
    props.listService.getLocations()
      .then(locations => setLocationOptions(
        locations.map((location, index) => (
          { key: `location_${index}`, text: location }
        ))
      ));
  }, []);

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

  const { control, watch, handleSubmit, errors, reset } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  const onSubmit = async data => await props.listService.addIdea(data);

  const watchTitle = watch("title");

  return (
    <div className={styles.reactHookForm}>
      <h1>React-hook-form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className={styles.section1}>

          <Label><b>State</b></Label>
          <Label>NEW</Label>

          <Label><b>Filename</b></Label>
          <Label>Idea_1_{watchTitle?.replace(/ /gi, '_')}</Label>

          <Label required ><b>Department</b></Label>
          <Controller
            name="department"
            control={control}
            render={({ onChange, onBlur }) => (
              <Dropdown
                options={departmentOptions}
                placeholder="Select a department"
                onBlur={onBlur}
                onChange={(_e, v) => onChange(v.text)}
                errorMessage={errors.department?.message}
              />
            )}
          />

          <Label required ><b>Location</b></Label>
          <Controller
            name="location"
            control={control}
            render={({ onChange, onBlur }) => (
              <Dropdown
                options={locationOptions}
                placeholder="Select a location"
                onBlur={onBlur}
                onChange={(_e, v) => onChange(v.text)}
                errorMessage={errors.location?.message}
              />
            )}
          />

          <Label><b>Supervisor mail</b></Label>
          <Controller
            name="supervisor"
            control={control}
            render={({ onChange, value }) =>
              <TextField
                value={value}
                onChange={onChange}
                errorMessage={errors.supervisor?.message}
              />}
          />

          <Label><b>Submitter name</b></Label>
          <Controller
            name="submitter"
            control={control}
            render={({ onChange, value }) =>
              <TextField
                value={value}
                onChange={onChange}
                errorMessage={errors.submitter?.message}
              />}
          />
        </div>

        <div className={styles.section2}>
          <Label required className={styles.header}><b>Idea title</b></Label>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ onChange, value }) => <TextField
              maxLength={50}
              value={value}
              onChange={onChange}
              errorMessage={errors.title?.message}
            />}
          />

          <Label required className={styles.header}><b>Idea description</b></Label>
          <Controller
            name='ideaText'
            control={control}
            render={({ onChange, value }) => <TextField
              multiline
              rows={4}
              resizable={false}
              autoAdjustHeight
              value={value}
              onChange={onChange}
              errorMessage={errors.ideaText?.message}
            />}
          />

          <Label className={styles.header}><b>Current situation</b></Label>
          <Controller
            name='currentSituation'
            control={control}
            render={({ onChange, value }) => <TextField
              value={value}
              onChange={onChange}
              multiline
              rows={4}
              resizable={false}
              autoAdjustHeight
              errorMessage={errors.currentSituation?.message}
            />}
          />
        </div>

        <div className={styles.buttonWrapper}>
          <DefaultButton onClick={reset}  >Cancel</DefaultButton>
          <PrimaryButton type='submit'>Submit</PrimaryButton>
        </div>

      </form>
    </div >
  );
}
