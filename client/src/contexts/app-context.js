import React from 'react';

export const AppContext = React.createContext({
  camPhotoServer: '',
  camPhotoWidth: '',
  camPhotoHeight: '',

  camVideoServer: '',

  updateContext: () => {},
});
