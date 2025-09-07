import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid } from "@mui/material";

function ShortenerForm() {
  const [inputs, setInputs] = useState([{ url: "", validity: 30, shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleInput = (i, field, value) => {
    const arr = [...inputs];
    arr[i][field] = value;
    setInputs(arr);
  };

  const addInput = () => {
    if (inputs.length < 5) setInputs([...inputs, { url: "", validity: 30, shortcode: "" }]);
  };

  const submit = async () => {
    const valid = inputs.filter(x => /^https?:\/\/.+/.test(x.url) && Number.isInteger(+x.validity));
    if (!valid.length) return;
    const promises = valid.map(input =>
      axios.post("http://localhost:5000/shorturls", {
        url: input.url,
        validity: Number(input.validity),
        shortcode: input.shortcode || undefined,
      })
    );
    const res = await Promise.all(promises);
    setResults(res.map(r => r.data));
  };

  return (
    <div>
      {inputs.map((input, i) => (
        <Grid container spacing={2} key={i}>
          <Grid item xs={5}><TextField label="Long URL" value={input.url} onChange={e => handleInput(i, "url", e.target.value)} fullWidth /></Grid>
          <Grid item xs={3}><TextField label="Validity (min)" value={input.validity} onChange={e => handleInput(i, "validity", e.target.value)} type="number" /></Grid>
          <Grid item xs={4}><TextField label="Shortcode (opt)" value={input.shortcode} onChange={e => handleInput(i, "shortcode", e.target.value)} /></Grid>
        </Grid>
      ))}
      <Button variant="contained" onClick={addInput} disabled={inputs.length >= 5}>+ Add URL</Button>
      <Button variant="contained" onClick={submit}>Submit</Button>
      {results.map((r, idx) => (
        <div key={idx}>
          Short Link: <a href={r.shortLink}>{r.shortLink}</a>, Expiry: {r.expiry}
        </div>
      ))}
    </div>
  );
}
export default ShortenerForm;
