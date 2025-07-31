import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Media } from '../types/media.js';
import { createMedia, updateMedia } from '../api/mediaApi.js';

// Frontend form schema - keeps strings for form inputs
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['Movie', 'TV Show']),
  director: z.string().min(1, 'Director is required'),
  budget: z.string().min(1, 'Budget is required'),
  location: z.string().min(1, 'Location is required'),
  duration: z.string().min(1, 'Duration is required'),
  year: z.string().min(1, 'Year/Time is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface MediaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media?: Media | null;
  onSuccess: (media: Media) => void;
}

export default function MediaForm({ open, onOpenChange, media, onSuccess }: MediaFormProps) {
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'Movie',
      director: '',
      budget: '',
      location: '',
      duration: '',
      year: '',
    }
  });

  useEffect(() => {
    reset({
      title: media?.title || '',
      type: media?.type || 'Movie',
      director: media?.director || '',
      budget: media?.budget || '',
      location: media?.location || '',
      duration: media?.duration?.toString() || '',
      year: media?.year?.toString() || '',
    });
  }, [media, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      
      // Convert string values to numbers for API
      const apiData = {
        ...values,
        duration: Number(values.duration),
        year: Number(values.year)
      };
      
      // Validate numbers
      if (isNaN(apiData.duration) || apiData.duration <= 0) {
        setError('Duration must be a positive number');
        return;
      }
      
      if (isNaN(apiData.year) || apiData.year < 1800) {
        setError('Year must be a valid year after 1800');
        return;
      }
      
      console.log('Submitting data:', apiData);
      
      const response = media 
        ? await updateMedia(media.id, apiData) 
        : await createMedia(apiData);
      
      onSuccess(response);
      onOpenChange(false);
      reset();
    } catch (err) {
      console.error('Submission error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to save media. Please check console for details.'
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-primary-dark mb-4">
          {media ? 'Edit Media' : 'Add New Media'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-dark">Title</label>
            <input
              {...register('title')}
              className="mt-1 block w-full rounded-md border-secondary-DEFAULT shadow-sm p-2 border"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark">Type</label>
            <select
              {...register('type')}
              className="mt-1 block w-full rounded-md border-secondary-DEFAULT shadow-sm p-2 border"
            >
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          {['director', 'budget', 'location', 'duration', 'year'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-primary-dark capitalize">
                {field}
              </label>
              <input
                {...register(field as keyof FormValues)}
                type={field === 'duration' || field === 'year' ? 'number' : 'text'}
                className="mt-1 block w-full rounded-md border-secondary-DEFAULT shadow-sm p-2 border"
              />
              {errors[field as keyof typeof errors] && (
                <p className="text-red-500 text-xs">
                  {errors[field as keyof typeof errors]?.message}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                setError(null);
                reset();
              }}
              className="px-4 py-2 text-primary-dark hover:text-primary-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-light hover:bg-primary-dark text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}