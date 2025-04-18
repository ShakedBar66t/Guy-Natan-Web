'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import Loader from '@/components/Loader';

interface FinancialTerm {
  _id: string;
  term: string;
  definition: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function GlossaryManagementPage() {
  const [terms, setTerms] = useState<FinancialTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<FinancialTerm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    isPublished: true,
    order: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get the API key - fallback to a hardcoded value if env var is not available
  // This ensures we always have a valid key
  const API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'l9jp7dztnnrgwndr7c2jgmuo1qxht4324yt0p53g0qlfby1w';

  // Fetch terms on component mount
  useEffect(() => {
    async function fetchTerms() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/glossary');
        if (!response.ok) {
          throw new Error('Failed to fetch financial terms');
        }
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        console.error('Error fetching financial terms:', err);
        setError('אירעה שגיאה בטעינת המונחים. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    }

    fetchTerms();
  }, []);

  // Handle edit button click
  const handleEdit = (term: FinancialTerm) => {
    setSelectedTerm(term);
    setFormData({
      term: term.term,
      definition: term.definition,
      isPublished: term.isPublished,
      order: term.order || 0,
    });
    setIsEditing(true);
  };

  // Handle create new term
  const handleCreateNew = () => {
    setSelectedTerm(null);
    setFormData({
      term: '',
      definition: '',
      isPublished: true,
      order: 0,
    });
    setIsEditing(true);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle editor content change
  const handleEditorChange = (content: string, editor?: any) => {
    // If content is already a string, use it directly
    // If it's an object and we have the editor instance, get content from the editor
    let contentString = '';
    
    if (typeof content === 'string') {
      contentString = content;
    } else if (editor && typeof editor.getContent === 'function') {
      contentString = editor.getContent();
    } else if (content && typeof content === 'object') {
      // Fallback if editor is not provided but content is an object
      // Try to access common TinyMCE content properties
      contentString = 
        (content as any).content || 
        (content as any).html || 
        (content as any).value || 
        JSON.stringify(content);
    } else {
      // Last resort fallback
      contentString = String(content || '');
    }
    
    setFormData(prev => ({
      ...prev,
      definition: contentString
    }));
  };

  // Handle term delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק מונח זה?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/glossary/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete term');
      }

      // Remove the deleted term from the state
      setTerms(terms.filter(term => term._id !== id));
      toast.success('המונח נמחק בהצלחה');
      
      // Reset form if the deleted term was selected
      if (selectedTerm && selectedTerm._id === id) {
        setSelectedTerm(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error deleting term:', err);
      toast.error('אירעה שגיאה במחיקת המונח');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.term.trim()) {
      toast.error('יש להזין שם מונח');
      return;
    }

    // Check if definition exists and is not empty
    if (!formData.definition || 
        (typeof formData.definition === 'string' && !formData.definition.trim()) ||
        (typeof formData.definition === 'object' && !formData.definition)) {
      toast.error('יש להזין הגדרה למונח');
      return;
    }

    try {
      setIsSaving(true);
      setSuccessMessage(null);
      
      const method = selectedTerm ? 'PUT' : 'POST';
      const url = selectedTerm 
        ? `/api/admin/glossary/${selectedTerm._id}` 
        : '/api/admin/glossary';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save term');
      }

      const savedTerm = await response.json();
      
      if (selectedTerm) {
        // Update existing term in the state
        setTerms(terms.map(term => 
          term._id === selectedTerm._id ? savedTerm : term
        ));
        setSuccessMessage('המונח עודכן בהצלחה!');
      } else {
        // Add new term to the state
        setTerms([...terms, savedTerm]);
        setSuccessMessage('המונח נוצר בהצלחה!');
      }
      
      // Reset form
      setSelectedTerm(null);
      setIsEditing(false);
      
    } catch (err) {
      console.error('Error saving term:', err);
      toast.error('אירעה שגיאה בשמירת המונח');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">ניהול מילון מושגים</h1>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!isEditing ? (
        <>
          {/* Terms list */}
          <div className="mb-6">
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-700 transition"
            >
              הוסף מונח חדש
            </button>
            
            {loading ? (
              <Loader size="small" />
            ) : terms.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-lg text-gray-600 mb-4">
                  עדיין אין מונחים במילון.
                </p>
                <button
                  onClick={handleCreateNew}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  הוסף את המונח הראשון
                </button>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        מונח
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סטטוס
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        תאריך יצירה
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {terms.map((term) => (
                      <tr key={term._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {term.term}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${term.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {term.isPublished ? 'מפורסם' : 'טיוטה'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(term.createdAt).toLocaleDateString('he-IL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                          <button
                            onClick={() => handleEdit(term)}
                            className="text-indigo-600 hover:text-indigo-900 ml-3"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => handleDelete(term._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Term form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">
              {selectedTerm ? `עריכת המונח: ${selectedTerm.term}` : 'הוספת מונח חדש'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="term">
                  שם המונח
                </label>
                <input
                  type="text"
                  id="term"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="הזן שם מונח"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  הגדרה
                </label>
                <Editor
                  initialValue={formData.definition}
                  onEditorChange={handleEditorChange}
                  apiKey={API_KEY}
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | link | help | ltr rtl',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    directionality: 'rtl', // Default to RTL for Hebrew content
                    promotion: false, // Disable TinyMCE promotions
                  }}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  סטטוס פרסום
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="mr-2 text-gray-700">פרסם מונח זה באתר</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
                  סדר תצוגה (אופציונלי)
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="סדר תצוגה (מספר)"
                />
                <p className="text-gray-600 text-xs mt-1">
                  מספר נמוך יותר יציג את המונח קודם. אם ריק, המונחים יוצגו לפי סדר א-ב.
                </p>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedTerm(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  בטל
                </button>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg transition`}
                >
                  {isSaving ? 'שומר...' : (selectedTerm ? 'עדכן מונח' : 'הוסף מונח')}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
} 