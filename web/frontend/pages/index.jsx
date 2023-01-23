import React, {useCallback, useState} from "react";

import {Card, TextContainer, TextField,} from "@shopify/polaris";

import {makeStyles} from "@material-ui/core/styles";
import XRegExp from "xregexp";



function prepareLb(lb) {
    // Allow mode modifier before lookbehind
    var parts = /^((?:\(\?[\w$]+\))?)\(\?<([=!])([\s\S]*)\)$/.exec(lb);
    return {
        // $(?!\s) allows use of (?m) in lookbehind
        lb: XRegExp(parts ? parts[1] + "(?:" + parts[3] + ")$(?!\\s)" : lb),
        // Positive or negative lookbehind. Use positive if no lookbehind group
        type: parts ? parts[2] === "=" : !parts
    };
}

XRegExp.execLb = function (str, lb, regex) {
    var pos = 0, match, leftContext;
    lb = prepareLb(lb);
    while (match = XRegExp.exec(str, regex, pos)) {
        leftContext = str.slice(0, match.index);
        if (lb.type === lb.lb.test(leftContext)) {
            return match;
        }
        pos = match.index + 1;
    }
    return null;
};

XRegExp.matchAllLb = function (str, lb, regex) {
    var matches = [], pos = 0, match, leftContext;
    lb = prepareLb(lb);
    while (match = XRegExp.exec(str, regex, pos)) {
        leftContext = str.slice(0, match.index);
        if (lb.type === lb.lb.test(leftContext)) {
            matches.push(match[0]);
            pos = match.index + (match[0].length || 1);
        } else {
            pos = match.index + 1;
        }
    }
    return matches;
};


const useStyles = value =>
    makeStyles(theme => ({
        root: {
            "& .Mui-error": {
                color: acquireValidationColor(value)
            },
            "& .MuiFormHelperText-root": {
                color: acquireValidationColor(value)
            }
        }
    }));

const acquireValidationColor = message => {
    switch (message) {
        case "Wrong or false script pleas reenter or contact support":
            return "red";
        case "Please input":
            return "orange";
        default:
            return "black";
    }
};

const ValidationTextField = ({ helperText }) => {

    const classes = useStyles(helperText)();

    const [value, setValue] = useState('');
    const handleChange = useCallback((newValue)=>setValue(newValue),[]);

   // const error = handleError(value) ?  "invalid Snippet pleas check your input or contact support" : "";
    const error = "arr";
    return (
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

    );

};
/*
export function handleError(script){
    console.log(script);
    return !!decipher(script);
}

//todo fix or outsource to php regex pattern
 export function decipher(script) {

    const regexConst = new RegExp('/\bsrc=([\'"])((?=[^"\'?#]|(?!\1)["\'])*\/(ccm19|app)\.js\?(?=[^"\']|(?!\1).)*)\1');
    if (script.trim() !== "") {
        let matches = script.match(regexConst);
          if (matches[1] && matches[2]) {
              return decodeURI(script);

          }
        return null;

    }
}
*/
export default function Homepage() {
    return (
        <div className="HomePage">
            <Card primaryFooterAction={{
                content: 'Save', onAction() {
                }
            }}>
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
            </Card>
        </div>
    );
}

