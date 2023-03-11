import React from 'react';

const dummyFunc = () => { }

export default React.createContext(
    {
        // override with value of useState
        isModalShown: [false, dummyFunc],
        modalTitle: ["", dummyFunc],
        modalMessage: ["", dummyFunc]
    }
);
