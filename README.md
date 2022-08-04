# Curiously
Curiously is a discovery engine and browser add-on dedicated to showcasing the best of the internet.

# Project Status
This project is in development and currently in alpha.

## Website
[Curiously](https://curiously.cc)

# Setup 

## Supabase 

Implementing this repo requires instantiating a Supabase DB based on a particular schema and creating a series of stored procedures. If you need the scripts containing the schema and stored procedures, please feel free to contact me [here](curiouslyapp@gmail.com)

## Environment

Once you setup Supabase, you'll need to create an env.js file in the extension folder of this repo and input your public key and project URL using the format below.

```js
 const env = {
    ENV_SUPABASE_CONNECT: "YOUR ANON/PUBLIC KEY",
    ENV_SUPABASE_URL: "YOUR PROJECT URL HERE"
    }
```

## Firefox
1. Go to: about:debugging#/runtime/this-firefox
2. Click: "Load Temporary Add-on", and open the manifest.json of Curiously
3. Curiously should appear in your browser toolbar

## Chrome
1. Go to: Chrome: chrome://extensions/
2. Click "Load unpacked" and open the extension folder
3. Go to the bookmark toolbar and pin Curiously onto the toolbar

## Credit
A big thanks to Vyacheslav Basharov for providing the boilerplate and Russell Barnard from [Rusty Zone](https://www.youtube.com/channel/UC-h4Q0_5zTX66AxJucRmxRQ) for lending a hand.
