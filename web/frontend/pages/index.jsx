import React, {useCallback, useEffect, useState} from 'react';
import {Button, ButtonGroup, Form, InlineError, Link, Text, TextField, VerticalStack, Card, AlphaCard} from '@shopify/polaris';

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

  const {t} = useTranslation();

  const handleChange = (newValue) => setInputScript(newValue);

  const updateState = (isEmpty, isSuccess, isError, isInternalError) => {
    setInputEmpty(isEmpty);
    setSuccess(isSuccess);
    setInputError(isError);
    setInternalError(isInternalError);
  };
  
  /**
   * saves the script for backend use
   * @param inputScript
   * @returns {Promise<Response<any, Record<string, any>, number>>}
   */
  const setScript = async (inputScript) => {
    return await fetch('/api/script/set', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({inputScript}),
    });
  };

  /**
   * adds script to template
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
     updateState(false,false,false,true)
     console.error(error)
     return error;
   }

  };

  /**
   * starts the process of deleting the script
   * @returns {Promise<Response|*>}
   */
  const handleDelete = async () => {
    try{
      return await fetch('/api/template/delete', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }catch (error) {
      updateState(false,false,false,true)
      console.error(error);
      return error;
    }
  }
  useEffect(() => {
    const fetchScriptValue = async () => {
      try {
        const response = await fetch('/api/script/get', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        });

        const scriptData = await response.json();
        if (scriptData.script !== undefined) {
          setInputScript(scriptData.script); // Set the fetched script value
        }
      } catch (error) {
        console.error("An error occurred while fetching script:", error);
      }
    };

    fetchScriptValue(); // Fetch the script value when the component mounts
  }, []);


  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();


    const pattern = '<script\\s+src="(https?://(?:[^/]+/public/(?:ccm19|app)\\.js\\?[^"]+|cloud\\.ccm19\\.de/app\\.js\\?[^"]+))"\\s+referrerpolicy="origin">\\s*</script>';
    const regexConst = new RegExp(pattern);


    //delete Script if possible and field empty
    if (inputScript.trim() === "") {
      updateState(true, false, false, false);
      try {
        await handleDelete()

      }catch (e) {
        updateState(false,false,false,true)
        console.error(e);
      }
      return;
    }

    //abort if input is false
    if (!regexConst.test(inputScript)) {
      updateState(false, false, true, false);
      return;
    }

    try {
      await setScript(encodeURIComponent(inputScript));
    } catch (error) {
      updateState(false, false, false, true);
      console.error(error);
    }

    try {
      await modifyTemplate();
      updateState(false, true, false, false);
    } catch (error) {
      updateState(false, false, false, true);
      console.error(error);
    }
  }, [inputScript]);

  return (
    <Form onSubmit={handleSubmit}>
      <VerticalStack gap="2">
      <TextField
        label={t('form.field.label')}
        placeholder='<script src="http://site/public/app.js?apiKey=1337753522109847&amp;domain=1337"  referrerpolicy=origin></script>'
        margin="normal"
        variant="outlined"
        value={inputScript}
        onChange={handleChange}
        required
        error={inputError}
        autoComplete="off"
      />
      <div className="button-container">
        <ButtonGroup>

          <Button  primary={true} submit >{t('form.field.button')} </Button>

        </ButtonGroup>
      </div>
      </VerticalStack>

      {inputError || internalError || inputEmpty || success  ? (
          <div className="message-container" style={{ color: success  ? 'green' : 'orange' }}>
            {inputError && <InlineError message={t('form.field.errorMessage')} fieldID={inputScript} />}
            {internalError && <InlineError message={t('form.field.internalErrorMessage')} fieldID={inputScript} />}
            {inputEmpty && t('form.field.emptyInputMessage')}
            {success && t('form.field.successMessage')}
          </div>
      ) : null}

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

  const headerAction = {
    content: 'CCM19 Support',
    url: 'https://www.ccm19.de/en/support-request/',
  };

  return (
    <div className="HomePage">
      <Card.Header actions={[headerAction]} title="CCM19 Integration" />
      <AlphaCard>
        <VerticalStack gap="5">
          <ValidationTextField />
        </VerticalStack>
      </AlphaCard>
    </div>
  );
}
