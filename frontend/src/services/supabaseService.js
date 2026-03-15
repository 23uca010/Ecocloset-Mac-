import { supabase } from '../lib/supabaseClient';

// Users
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select();
  
  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

// Items
export const getItems = async () => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getItemById = async (id) => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createItem = async (itemData) => {
  const { data, error } = await supabase
    .from('items')
    .insert([itemData])
    .select();
  
  if (error) throw error;
  return data;
};

export const updateItem = async (id, itemData) => {
  const { data, error } = await supabase
    .from('items')
    .update(itemData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteItem = async (id) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// NGOs
export const getNGOs = async () => {
  const { data, error } = await supabase
    .from('ngos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getNGOById = async (id) => {
  const { data, error } = await supabase
    .from('ngos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createNGO = async (ngoData) => {
  const { data, error } = await supabase
    .from('ngos')
    .insert([ngoData])
    .select();
  
  if (error) throw error;
  return data;
};

// Donations
export const getDonations = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createDonation = async (donationData) => {
  const { data, error } = await supabase
    .from('donations')
    .insert([donationData])
    .select();
  
  if (error) throw error;
  return data;
};

export const getUserDonations = async (userId) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Swaps
export const getSwaps = async () => {
  const { data, error } = await supabase
    .from('swaps')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createSwap = async (swapData) => {
  const { data, error } = await supabase
    .from('swaps')
    .insert([swapData])
    .select();
  
  if (error) throw error;
  return data;
};

export const getUserSwaps = async (userId) => {
  const { data, error } = await supabase
    .from('swaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Auth
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  return true;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};
