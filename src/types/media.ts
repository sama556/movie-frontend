export interface Media {
  id: string;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget: string;
  location: string;
  duration: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaResponse {
  data: Media[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 

