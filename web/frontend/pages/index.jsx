import React, {useCallback, useState} from "react";

import {Button, Card, Form, TextContainer, TextField,FormLayout} from "@shopify/polaris";


import { useAuthenticatedFetch } from "../hooks";



/*
Component for the Textfield

 */
const ValidationTextField = ()=>{

  const [helperText,setHelperText] = useState('');
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');

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

      try {
          const response = await saveScript(value);
          console.log(response);
      }catch (e) {
          console.log("script couldn't be saved");
      }

        try{
          const insertScript = await modifyTemplate();
          console.log(insertScript);
        }catch (e) {
            console.log("Template couldn't be modified")
        }

  }, [value]);


    const saveScript = async (value) => {
        const response = await fetch('/api/script/save', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value}),
        });

    }
    const getScript = async () =>{
      try {
          const response = await fetch('/api/script/load',{
              method: 'GET',
              headers:{
                  'Content-Type': 'application/json'
              }
          });

          const script = await response.json();
          console.log(script);
          return script;
      }catch (error){
          console.log("couldn't retrieve script from DB")
      }
    }

    const getTemplate = async () => {
        const templateResponse = await fetch('/admin/themes/current.json', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": "<SHOPIFY_API_KEY>"
            },
        });
    }

    const saveTemplate = async (templateData) => {
        const saveTemplateResponse = await fetch('/admin/themes/current.json', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": "<SHOPIFY_API_KEY>"
            },
            body: JSON.stringify(templateData),
        });

    }


    const modifyTemplate = async () => {

        const templateData= await getTemplate();
        const script = await getScript();

        const headIndex = templateData.indexOf("<Head>");
        const headCloseIndex = templateData.indexOf("</Head>");

        const saveTemplate = saveTemplate( templateData.substring(0,headIndex + 6)+script +
        templateData.substring(headIndex +6,headCloseIndex) +
        templateData.substring(headCloseIndex));


        return ("success");
    }


  // const error = handleError(value) ?  "invalid Snippet pleas check your input or contact support" : "";
  return (
      <Form onSubmit={handleSubmit}>
        <TextField
            label="Pleas insert your, from the devine Backend given, CCM19 Skript."
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
        <Button submit>Save</Button>
      </Form>
  );

};



export default function Homepage() {

  return (
      <div className="HomePage">
        <Card.Header actions={[{content: 'CCM19'}]} title="CCM19 Integration"></Card.Header>
        <Card.Section>
          <TextContainer>
            This ist the official CCM19 Integration App. For USage you will need the CCM19 Script from
            your CCM19 Backend.
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

