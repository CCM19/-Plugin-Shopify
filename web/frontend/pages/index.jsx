import React, {useCallback, useEffect, useState} from "react";
import {Button, Card, Form, Link, TextContainer, TextField, TextStyle} from "@shopify/polaris";
import {useAuthenticatedFetch} from "../hooks";
import {useTranslation} from "react-i18next";



const ValidationTextField = ()=>{

    const [helperText, setHelperText] = useState('');
    const [error, setError] = useState(false);
    const [inputScript, setInputScript] = useState('');
    const {t} = useTranslation();

    const handleChange = useCallback((newValue) => setInputScript(newValue), []);

  const fetch = useAuthenticatedFetch();

    //Handles the button
    const handleSubmit = useCallback( async (event) => {
        event.preventDefault();


        const regexConst = /<script\s+src="(https?:\/\/[^\/]+\/public\/(ccm19|app)\.js\?[^"]+)"\s+referrerpolicy="origin">\s*<\/script>/;

        //checks if script is correct
        if (!regexConst.test(inputScript)) {
            setHelperText('The script provided is not valid. Please insert a valid script or contact Support.');
            setError(true);
            return;
        }
      try {
          //initialises DB
          const db = await initDB();
          console.log(db);
          //saves script to DB Line 1
          const response = await saveScript(encodeURIComponent(inputScript));
          console.log(response);
      }catch (error){
          console.error(error);
      }

      const insertScript = await modifyTemplate();
        console.log(insertScript);


  }, [inputScript]);

    const initDB = async () =>{
        return await fetch('/api/get/db/status',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }

    const saveScript = async (inputScript) => {
        return await fetch('/api/script/save', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({inputScript}),
        });
    }

    const modifyTemplate = async () => {

        return await fetch('/api/template/modify', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

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
                error={error}
                helperText={helperText}
             autoComplete={"off"}/>
            <Button submit>{t('form.field.button')}</Button>
        </Form>
    );

};

export default function Homepage() {
    const { t } = useTranslation();
    const linkText=t('form.field.homepage');
    const linkUrl=t('form.field.link');


    return (
    <div className="HomePage">
        <Card.Header actions={[{content: 'CCM19'}]} title="CCM19 Integration"></Card.Header>
        <Card.Section>
          <TextContainer>
              <TextStyle variation={"subdued"}>
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
  );
}

