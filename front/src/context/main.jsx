import React, { createContext } from 'react';

const Context = createContext({login: false, setLogin: ()=>{}, setPopup: ()=>{}});

export default Context;