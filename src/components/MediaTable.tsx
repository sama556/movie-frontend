import { useState, useEffect } from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll.js';
import { fetchMedia, deleteMedia } from '../api/mediaApi.js'; // Removed typo "Madia"
import MediaForm from './MediaForm.jsx'; // Fixed import - removed .tsx extension and curly braces
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { Media } from '../types/media.js'; // Added missing Media type import

export default function MediaTable() {
  const [media, setMedia] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadMedia = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetchMedia(page, 10);
      setMedia(prev => [...prev, ...response.data]);
      setPage(prev => prev + 1);
      setHasMore(response.meta.page < response.meta.pages);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMore = async () => await loadMedia();
  const { isFetching } = useInfiniteScroll(fetchMore, hasMore, isLoading);

  // Removed duplicate useEffect and fixed the logic
useEffect(() => {
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchMedia(1, 10);
      setMedia(response.data);
      setHasMore(response.meta.page < response.meta.pages);
    } catch (error) {
      console.error('Failed to load media:', error);
      // Optionally show error to user
    } finally {
      setIsLoading(false);
    }
  };
  loadInitialData();
}, []);
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMedia(id);
        setMedia(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  const handleEdit = (mediaItem: Media) => {
    setEditingMedia(mediaItem);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingMedia(null);
    setIsFormOpen(true);
  };

  const handleSuccess = (updatedMedia: Media) => {
    if (editingMedia) {
      setMedia(prev => prev.map(item => 
        item.id === updatedMedia.id ? updatedMedia : item
      ));
    } else {
      setMedia(prev => [updatedMedia, ...prev]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary-light p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-dark">My Favorite Media</h1>
          <button 
            onClick={handleCreate}
            className="bg-primary-light hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add New
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-secondary-DEFAULT">
          <table className="min-w-full divide-y divide-secondary-DEFAULT">
            <thead className="bg-secondary-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Director</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Year/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-DEFAULT">
              {media.map(item => (
                <tr key={item.id} className="hover:bg-secondary-light">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.director}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-primary-dark hover:text-primary-light"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-400"
                      >
                        <Trash2Icon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(isLoading || isFetching) && (
            <div className="p-4 text-center text-primary-dark">Loading more items...</div>
          )}
        </div>

        <MediaForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          media={editingMedia}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
