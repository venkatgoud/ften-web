import React from "react";
import {defaultTheme } from '../utils/constants';

export const defaultSettings = {
  theme: defaultTheme.value
};

export const SettingsContext = React.createContext(defaultSettings);