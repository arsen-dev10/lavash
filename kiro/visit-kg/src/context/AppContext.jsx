import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_PLACES, DEFAULT_MOUNTAINS, DEFAULT_ROUTES, DEFAULT_REVIEWS } from '../data/places';

const AppContext = createContext(null);

function ls(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

export function AppProvider({ children }) {
  const [lang,    setLangState] = useState(() => localStorage.getItem('kg_lang') || 'ru');
  const [places,  setPlacesState]  = useState(() => ls('kg_places',  DEFAULT_PLACES));
  const [mountains] = useState(DEFAULT_MOUNTAINS);
  const [routes,  setRoutesState]  = useState(() => ls('kg_routes',  DEFAULT_ROUTES));
  const [reviews, setReviewsState] = useState(() => ls('kg_reviews', DEFAULT_REVIEWS));
  const [saved,   setSavedState]   = useState(() => ls('kg_saved',   []));
  const [settings, setSettingsState] = useState(() => ls('kg_settings', {
    siteName:'VisitKyrgyzstan', siteEmail:'info@visit-kyrgyzstan.kg',
    sitePhone:'+996 312 000 000', maintenanceMode:false, autoApprove:true,
  }));

  const setLang = useCallback(l => { setLangState(l); localStorage.setItem('kg_lang', l); }, []);
  const setPlaces  = useCallback(d => { setPlacesState(d);  lsSet('kg_places', d); }, []);
  const setRoutes  = useCallback(d => { setRoutesState(d);  lsSet('kg_routes', d); }, []);
  const setReviews = useCallback(d => { setReviewsState(d); lsSet('kg_reviews', d); }, []);
  const setSaved   = useCallback(d => { setSavedState(d);   lsSet('kg_saved', d); }, []);
  const setSettings= useCallback(d => { setSettingsState(d);lsSet('kg_settings', d); }, []);

  const toggleSave = useCallback(name => {
    setSaved(prev => prev.includes(name) ? prev.filter(s=>s!==name) : [...prev, name]);
  }, [setSaved]);

  const addReview = useCallback(review => {
    setReviews(prev => [{ ...review, id:'r_'+Date.now(), isDefault:false }, ...prev]);
  }, [setReviews]);

  const deleteReview = useCallback(id => {
    setReviews(prev => prev.filter(r => r.id !== id));
  }, [setReviews]);

  const addPlace = useCallback(place => {
    setPlaces(prev => [{ ...place, id:'p_'+Date.now() }, ...prev]);
  }, [setPlaces]);

  const updatePlace = useCallback(place => {
    setPlaces(prev => prev.map(p => p.id === place.id ? place : p));
  }, [setPlaces]);

  const deletePlace = useCallback(id => {
    setPlaces(prev => prev.filter(p => p.id !== id));
  }, [setPlaces]);

  const addRoute = useCallback(route => {
    setRoutes(prev => [{ ...route, id:'rt_'+Date.now() }, ...prev]);
  }, [setRoutes]);

  const updateRoute = useCallback(route => {
    setRoutes(prev => prev.map(r => r.id === route.id ? route : r));
  }, [setRoutes]);

  const deleteRoute = useCallback(id => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  }, [setRoutes]);

  const resetData = useCallback(() => {
    setPlaces(DEFAULT_PLACES); setRoutes(DEFAULT_ROUTES);
    setReviews(DEFAULT_REVIEWS); setSaved([]);
  }, [setPlaces, setRoutes, setReviews, setSaved]);

  return (
    <AppContext.Provider value={{
      lang, setLang,
      places, setPlaces, addPlace, updatePlace, deletePlace,
      mountains,
      routes, setRoutes, addRoute, updateRoute, deleteRoute,
      reviews, setReviews, addReview, deleteReview,
      saved, setSaved, toggleSave,
      settings, setSettings,
      resetData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
