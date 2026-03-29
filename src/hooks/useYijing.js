// src/hooks/useYijing.js
import { useContext } from 'react';
import { YijingContext } from '../components/YijingContext';

export const useYijing = () => useContext(YijingContext);
