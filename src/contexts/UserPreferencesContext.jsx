// src/contexts/UserPreferencesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserPreferencesContext = createContext();

export const NIGERIAN_UNIVERSITIES = [
  { code: 'ALL', name: 'All Nigerian Universities' },
  { code: 'UNILAG', name: 'University of Lagos (UNILAG)' },
  { code: 'UNIBEN', name: 'University of Benin (UNIBEN)' },
  { code: 'OAU', name: 'Obafemi Awolowo University (OAU)' },
  { code: 'UI', name: 'University of Ibadan (UI)' },
  { code: 'ABU', name: 'Ahmadu Bello University (ABU)' },
  { code: 'UNN', name: 'University of Nigeria, Nsukka (UNN)' },
  { code: 'LASU', name: 'Lagos State University (LASU)' },
  { code: 'DELSU', name: 'Delta State University (DELSU)' },
  { code: 'UNILORIN', name: 'University of Ilorin (UNILORIN)' },
  { code: 'FUTA', name: 'Federal University of Tech, Akure (FUTA)' },
  { code: 'OOU', name: 'Olabisi Onabanjo University (OOU)' },
  { code: 'UNIPORT', name: 'University of Port Harcourt (UNIPORT)' },
  { code: 'AAUA', name: 'Adekunle Ajasin University (AAUA)' },
  { code: 'BUK', name: 'Bayero University Kano (BUK)' }
];

export const ACADEMIC_LEVELS = [
  'All Levels',
  '100 Level',
  '200 Level',
  '300 Level',
  '400 Level',
  '500 Level'
];

export function UserPreferencesProvider({ children }) {
  const [selectedUniversity, setSelectedUniversity] = useState(() => {
    return localStorage.getItem('hmd_pref_university') || 'ALL';
  });

  const [selectedLevel, setSelectedLevel] = useState(() => {
    return localStorage.getItem('hmd_pref_level') || 'All Levels';
  });

  const [selectedDepartment, setSelectedDepartment] = useState(() => {
    return localStorage.getItem('hmd_pref_dept') || 'All Departments';
  });

  useEffect(() => {
    localStorage.setItem('hmd_pref_university', selectedUniversity);
  }, [selectedUniversity]);

  useEffect(() => {
    localStorage.setItem('hmd_pref_level', selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    localStorage.setItem('hmd_pref_dept', selectedDepartment);
  }, [selectedDepartment]);

  const updatePreferences = ({ university, level, department }) => {
    if (university !== undefined) setSelectedUniversity(university);
    if (level !== undefined) setSelectedLevel(level);
    if (department !== undefined) setSelectedDepartment(department);
  };

  const getUniversityName = (code = selectedUniversity) => {
    const match = NIGERIAN_UNIVERSITIES.find(u => u.code === code);
    return match ? match.name : code;
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        selectedUniversity,
        setSelectedUniversity,
        selectedLevel,
        setSelectedLevel,
        selectedDepartment,
        setSelectedDepartment,
        updatePreferences,
        getUniversityName,
        universities: NIGERIAN_UNIVERSITIES,
        levels: ACADEMIC_LEVELS
      }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
