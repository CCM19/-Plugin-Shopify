import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, Form, InlineError, Link, TextContainer, TextField, TextStyle} from '@shopify/polaris';

import {useAuthenticatedFetch} from '../hooks';
import {useTranslation} from "react-i18next";

/**
 * Core component for the handling of the input processing of it.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const ValidationTextField = () => {
  const fetch = useAuthenticatedFetch();

  const [success, setSuccess] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [inputEmpty, setInputEmpty] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const [inputScript, setInputScript] = useState('');
  const [deleteClicked,setDeleteClicked] = useState(false);

  const {t} = useTranslation();

  const handleChange = (newValue) => setInputScript(newValue);

  const updateState = (isEmpty, isSuccess, isError, isInternalError, isDeleteClicked) => {
    setInputEmpty(isEmpty);
    setSuccess(isSuccess);
    setInputError(isError);
    setInternalError(isInternalError);
    setDeleteClicked(isDeleteClicked);
  };

  /**
   * saves the script for backend use
   * @param inputScript
   * @returns {Promise<Response<any, Record<string, any>, number>>}
   */
  const setScript = async (inputScript) => {
    const response = await fetch('/api/script/set', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({inputScript}),
    });
    return response;
  };

  /**
   * starts the process of adding the script to the template
   *
   * @returns {Promise<Response<any, Record<string, any>, number>>}
   */
  const modifyTemplate = async () => {
   try {
     return await fetch('/api/template/modify', {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
       },
     });
   }catch(error){
     updateState(false,false,false,true,false)
     console.error(error)
     return error;
   }

  };
  /**
   * starts the process of deleteation of the scripüt
   * @returns {Promise<Response|*>}
   */
  const handleDelete = async () => {
    try{
      updateState(false,false,false,false,true)
      return await fetch('/api/template/delete', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }catch (error) {
      updateState(false,false,false,true,false)
      console.error(error);
      return error;
    }
  }

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const pattern = '<script\\s+src="(https?://[^/]+/public/(ccm19|app)\\.js\\?[^"]+)"\\s+referrerpolicy="origin">\\s*</script>';
    const regexConst = new RegExp(pattern);

    if (inputScript.trim() === "") {
     await updateState(true, false, false, false,false);
      return;
    }
    // checks if script is correct
    if (!regexConst.test(inputScript)) {
      updateState(false, false, true, false,false);
      return;
    }

    try {

      await setScript(encodeURIComponent(inputScript));

    } catch (error) {

      updateState(false, false, false, true,false);
      console.error(error);

    }
    try {

      await modifyTemplate();
      updateState(false, true, false, false,false);

    } catch (error) {

      updateState(false, false, false, true,false);
      console.error(error);

    }
  }, [inputScript]);

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label={t('form.field.label')}
        placeholder="<script src=http://site/public/app.js?apiKey=1337753522109847&amp;domain=1337  referrerpolicy=origin></script>"
        margin="normal"
        variant="outlined"
        value={inputScript}
        onChange={handleChange}
        required
        error={inputError}
        autoComplete="off"
      />
      {inputError && (
      <InlineError message={t('form.field.errorMessage')} fieldID={inputScript} />
            )}
      {internalError && (
      <InlineError message={t('form.field.internalErrorMessage')} fieldID={inputScript} />
      )}
      {inputEmpty && (
      <div style={{color: 'orange'}}>
        {t('form.field.emptyInputMessage')}
      </div>
      )}
      {success && (
      <div style={{color: 'green'}}>
        {t('form.field.successMessage')}
      </div>
            )}
      {deleteClicked && (
          <div style={{color: 'green'}}>
            {t('form.field.deleteMessage')}
          </div>
      )}

      <Button  primary={true} submit>{t('form.field.button')} </Button>

      <Button destructive={true} onClick={handleDelete}>{t('form.field.delete')}</Button>

    </Form>
  );
};

/**
 *  Displays the components
 * @returns {JSX.Element}
 * @constructor
 */
export default function Homepage() {
  const {t} = useTranslation();
  const linkText = t('form.field.homepage');
  const linkUrl = t('form.field.link');

  const headerAction = {
    content: 'CCM19 Support',
    url: 'https://www.ccm19.de/en/support-request/',
  };

  return (
    <div className="HomePage">
      <Card.Header actions={[headerAction]} title="CCM19 Integration" />
      <Card.Section>
        <TextContainer>
          <TextStyle variation="subdued">
            {linkText}
            <Link url={linkUrl}>{linkUrl}</Link>
          </TextStyle>
        </TextContainer>
      </Card.Section>
      <Card.Section>
        <>
          <ValidationTextField />
        </>
      </Card.Section>
    </div>
  );
}
