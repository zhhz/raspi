import React from 'react';

export const AppContext = React.createContext({
  camPhotoServer: '',
  camVideoServer: '',
  updateContext: () => {},
});
