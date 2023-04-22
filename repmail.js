const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

const OPENAI_API_KEY = process.env.TOKEN; // à remplacer par votre clé API OpenAI
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate', (req, res) => {
    const article_text = req.body.article_text;
    const style = req.body.style;

    const options = {
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        json: {
            messages: [
              {"role": "system", "content": "Dans un mail, on commence avec bonjour, sans madame ni monsieur, on utilise des phrases courtes (sujet, verbe), on fini avec une formule de politesse simple tel que, cordialement, bien cordialement, bien à vous. à la fin tu mettra entre crochet Nom du Rédacteur, pour que je puisse modifier moi même. On utilise le présent et des connecteurs simples. N'oublie pas de passer des lignes avec <br> et de faire une mise en forme correct. Utilise ces informations pour répondre à ce mail :"},
              {"role": "user", "content": article_text + "de manière" + style} ,
          ],
            model : "gpt-3.5-turbo",
            max_tokens: 500,
            temperature: 0.5
        }
    };

    request(options, (err, response, body) => {
      if (err) {
          return res.send('Error generating response');
      }
  
      if (body.error) {
          return res.send(`OpenAI API error: ${body.error.message}`);
      }
  
      const response_text = '<center><h2 style="font-weight: 600; font-size: 3vw; color:white;">Résultat :</h2></center><br><p style="color:white; font-size: 20px;">'+ body.choices[0].message.content +'</p>';
      console.log(body.choices[0])
      res.send(response_text);
      console.log(response_text)
  });
  
  
});

app.listen(process.env.PORT || port, () => console.log('Listening on port 3000'));

