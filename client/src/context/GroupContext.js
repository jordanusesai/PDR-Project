import React, { createContext, useContext, useReducer } from 'react';
import api from '../services/api';

const GroupContext = createContext();

const groupReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GROUPS':
      return { ...state, groups: action.payload, loading: false };
    case 'SET_CURRENT_GROUP':
      return { ...state, currentGroup: action.payload, loading: false };
    case 'ADD_GROUP':
      return { ...state, groups: [action.payload, ...state.groups] };
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group._id === action.payload._id ? action.payload : group
        ),
        currentGroup: state.currentGroup?._id === action.payload._id 
          ? action.payload 
          : state.currentGroup
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null
};

export const GroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(groupReducer, initialState);

  const fetchGroups = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/groups');
      dispatch({ type: 'SET_GROUPS', payload: response.data.groups });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch groups';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const fetchGroup = async (groupId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get(`/groups/${groupId}`);
      dispatch({ type: 'SET_CURRENT_GROUP', payload: response.data.group });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch group';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const createGroup = async (groupData) => {
    try {
      const response = await api.post('/groups', groupData);
      dispatch({ type: 'ADD_GROUP', payload: response.data.group });
      return { success: true, group: response.data.group };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create group';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const addMember = async (groupId, email) => {
    try {
      const response = await api.post(`/groups/${groupId}/members`, { email });
      dispatch({ type: 'UPDATE_GROUP', payload: response.data.group });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      return { success: false, error: message };
    }
  };

  const removeMember = async (groupId, userId) => {
    try {
      const response = await api.delete(`/groups/${groupId}/members/${userId}`);
      dispatch({ type: 'UPDATE_GROUP', payload: response.data.group });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove member';
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    fetchGroups,
    fetchGroup,
    createGroup,
    addMember,
    removeMember
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};
