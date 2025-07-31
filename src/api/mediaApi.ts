import { type Media, type MediaResponse } from '../types/media.js';

// Remove /media from the base URL since it's already in your backend route
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const fetchMedia = async (page: number, limit: number = 10): Promise<MediaResponse> => {
  try {
    // Remove /media from the URL since API_URL already points to /api
    const response = await fetch(`${API_URL}/media?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export const createMedia = async (data: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>): Promise<Media> => {
  try {
    const response = await fetch(`${API_URL}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error details:', {
        status: response.status,
        data: errorData
      });
      throw new Error(errorData.error || 'Failed to create media');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Full API error:', error);
    throw error;
  }
};
  
export const updateMedia = async (
  id: string, 
  media: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Media> => {
  const response = await fetch(`${API_URL}/media/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...media,
      duration: Number(media.duration),
      year: Number(media.year)
    }),
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    throw new Error(errorData.message || 'Failed to update media');
  }

  return await response.json();
};

export const deleteMedia = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/media/${id}`, {  // Add /media here
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete media');
};