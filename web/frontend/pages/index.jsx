import React, {useCallback, useState} from "react";
import {Button, Card, Form, Link, TextContainer, TextField, TextStyle} from "@shopify/polaris";
import {useAuthenticatedFetch} from "../hooks";
import {useTranslation} from "react-i18next";


const ValidationTextField = ()=>{

  const [helperText,setHelperText] = useState('');
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  const handleChange = useCallback((newValue)=>setValue(newValue),[]);

  const fetch = useAuthenticatedFetch();

  //Handles the button
  const handleSubmit = useCallback(async (event) => {
      event.preventDefault();

      const regexConst = /<script\s+src="(https?:\/\/[^\/]+\/public\/(ccm19|app)\.js\?[^"]+)"\s+referrerpolicy="origin">\s*<\/script>/;
      if (!regexConst.test(value)) {
          setHelperText('The script provided is not valid. Please insert a valid script or contact Support.');
          setError(true);
          return;
      }

      try{
          const db =await initDB();
          console.log(db);
      }catch (error){
          console.error(error);
      }

      try {
          const response = await saveScript(value);
          console.log(response);
      }catch (e) {
          console.error("script couldn't be saved");
      }
      const insertScript = await modifyTemplate();


  }, [value]);

    const initDB = async () =>{
        return await fetch('/api/get/db/status',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }

    const saveScript = async (value) => {
        return await fetch('/api/script/save', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value}),
        });
    }
    const getScript = async () =>{

        const response = await fetch('/api/script-load',{
              method: 'GET',
              headers:{
                  'Content-Type': 'application/json'
              }
          });
            console.log(response);
            const script = await response.json();
          return script.script;

    }

    const getMainTemplate=async ()=>{
    try {
        const response = await fetch('/api/shop-data',{
            method:"GET",
            headers: {"Content-Type": "application/json"},
        });
        return await response.json();
    }catch (error) {
        console.log ("Main template defekt")
         console.error(error);
    }
    }

    const modifyTemplate = async () => {
    try {
        const mainTemplate = getMainTemplate();
        const script = await getScript();

        const headIndex = mainTemplate.indexOf("<Head>");
        const headCloseIndex = mainTemplate.indexOf("</Head>");

        const saveTemplate = await saveTemplate(mainTemplate.substring(0, headIndex + 6) + script +
            mainTemplate.substring(headIndex + 6, headCloseIndex) +
            mainTemplate.substring(headCloseIndex));


        return ("success");
    }catch (e) {
        return ("error");
    }
    }


    return (
      <Form onSubmit={handleSubmit}>
        <TextField
            label={t('form.field.label')}
            placeholder="<script src=http://site/public/app.js?apiKey=1337753522109847&amp;domain=1337  referrerpolicy=origin></script>"
            margin="normal"
            variant="outlined"
            value={value}
            onChange={handleChange}
            required
            error={error}
            helperText={helperText}
            autoComplete="off"
        />
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
        <Card.Section title="">
          <>
            <ValidationTextField/>
          </>
        </Card.Section>
      </div>
  );
}

