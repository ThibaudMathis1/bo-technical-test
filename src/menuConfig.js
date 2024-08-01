import React from 'react';
import WidgetsIcon from '@material-ui/icons/Widgets';
import HomeIcon from '@material-ui/icons/Home';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

import NotAvailable from './Pages/NotAvailable';
import Test from './Pages/Test';
import Home from './Pages/Home';
import { colors } from './muiColors';
import { VideoLibrary } from '@material-ui/icons';
import Videos from './Pages/Videos';
import VideoEdit from './Pages/VideoEdit';

// import { ROLES } from './models/User/User.constants'; used to restrict menu access

const nodeEnv = process.env.REACT_APP_ENVIRONMENT;

// This file is used to construct the side menu and the router
// REQUIRED object keys :
// - name (string) : the name of the menu entry - it ill be used as a translation key for the sidemenu.text.js file
// - path (string) : the path of the component route for react-router-dom
// - icon (react component) : an icon that will be displayed on on the left side of the name
// - component (function returning a react component) : the component to be displayed on the given path
// OPTIONNAL object keys :
// - skipDisplay : does not display the menu entry for this element
// - subitems : an array of a objects with above keys that will create subroutes
// - homePage : - displayButton (boolean): menu that appears on the home page
//              - buttonColor : cardMenu background color
//              - icon : MUI icon component (use fontSize="inherit" on it)

const MENU_ENTRIES = [
  {
    name: 'home',
    path: '/home',
    icon: <HomeIcon />,
    component: () => <Home />,
  },
  {
    name: 'videos',
    path: '/videos',
    icon: <VideoLibrary />,
    component: () => <Videos />,
    subItems: [
      {
        name: 'edit',
        path: '/:videoId',
        component: () => <VideoEdit />,
      },
    ],
    homePage: {
      displayButton: true,
      buttonColor: colors.red,
      icon: <VideoLibrary fontSize="inherit" />,
    },
  },
  {
    name: 'sampleMenu',
    path: '/sample-menu',
    icon: <BeachAccessIcon />,
    component: () => <NotAvailable />,
    homePage: {
      displayButton: true,
      buttonColor: colors.blue,
      icon: <BeachAccessIcon fontSize="inherit" />,
    },

    subItems: [
      {
        name: 'Create',
        path: '/new',
        component: () => <NotAvailable />,
      },
      {
        name: 'Edit',
        path: '/:newsTypeId/edit',
        component: () => <NotAvailable />,
      },
    ],
  },
  {
    name: 'test',
    path: '/test',
    icon: <WidgetsIcon />,
    component: () => <Test />,
    skipDisplay: !['local', 'develop'].some((env) => env === nodeEnv),
  },
];

export default MENU_ENTRIES;
