import React, { useCallback, useState } from 'react'
import { Button, Card, Form, InlineError, Link, TextContainer, TextField, TextStyle } from '@shopify/polaris'
import { useAuthenticatedFetch } from '../hooks'
import { useTranslation } from 'react-i18next/dist/es'

/**
 * Core component for the handling of the input processing of it.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const ValidationTextField = () => {
  const fetch = useAuthenticatedFetch()

  const [success, setSuccess] = useState(false)
  const [inputError, setInputError] = useState(false)
  const [inputScript, setInputScript] = useState('')
  const { t } = useTranslation()

  const handleChange = (newValue) => setInputScript(newValue)

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    const regexConst = new RegExp(
      '<script\\s+src="(https?://[^/]+/public/(ccm19|app)\\.js\\?[^"]+)"\\s+referrerpolicy="origin">\\s*</script>'
    )
    // checks if script is correct
    if (!regexConst.test(inputScript)) {
      setInputError(true)
      setSuccess(false)
      return
    }

    try {
      await initDB()
      // console.log(db);
      await saveScript(encodeURIComponent(inputScript))
      // console.log(response);
    } catch (error) {
      console.error(error)
      setSuccess(false)
      setInputError(true)
    }
    try {
      await modifyTemplate()
      setSuccess(true)
      setInputError(false)
      // console.log(insertScript);
    } catch (error) {
      setSuccess(false)
      setInputError(true)
      console.error(error)
    }
  }, [inputScript])

  /**
     * Initialises the Db if not already done
     *
     * @returns {Promise<Response<any, Record<string, any>, number>>}
     */
  const initDB = async () => {
    return await fetch('/api/get/db/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
     * saves the script
     *
     * @param inputScript
     * @returns {Promise<Response<any, Record<string, any>, number>>}
     */
  const saveScript = async (inputScript) => {
    return await fetch('/api/script/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputScript })
    })
  }

  /**
     * starts the process of template modification
     *
     * @returns {Promise<Response<any, Record<string, any>, number>>}
     */
  const modifyTemplate = async () => {
    return await fetch('/api/template/modify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

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
             autoComplete={'off'}/>
            {inputError && (
                <InlineError message={t('form.field.errorMessage')} fieldID={inputScript}/>
            )}
            {success && (
                <div style={{ color: 'green' }}>
                    {t('form.field.successMessage')}
                </div>
            )}

            <Button submit>{t('form.field.button')}</Button>
        </Form>
  )
}
/**
 *  Displays the components
 * @returns {JSX.Element}
 * @constructor
 */
export default function Homepage () {
  const { t } = useTranslation()
  const linkText = t('form.field.homepage')
  const linkUrl = t('form.field.link')

  const headerAction = {
    content: 'CCM19 Support',
    url: 'https://www.ccm19.de/en/support-request/'
  }

  return (
    <div className="HomePage">
        <Card.Header actions={[headerAction]} title="CCM19 Integration"></Card.Header>
        <Card.Section>
          <TextContainer>
              <TextStyle variation={'subdued'}>
                  {linkText}
                  <Link url={linkUrl}>{linkUrl}</Link>
              </TextStyle>
          </TextContainer>
        </Card.Section>
        <Card.Section>
          <>
            <ValidationTextField/>
          </>
        </Card.Section>
      </div>
  )
}
