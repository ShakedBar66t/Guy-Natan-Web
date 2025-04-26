'use client';

import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'react-hot-toast';
import Loader from '@/components/Loader';
import TinyMCEEditor from '@/components/TinyMCEEditor';
import HebrewEditor from '@/components/HebrewEditor';

interface FinancialTerm {
  _id: string;
  term: string;
  definition: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
  difficulty?: 'מתחילים' | 'בינוני' | 'מתקדם';
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
    category: '',
    difficulty: 'מתחילים',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [useRichEditor, setUseRichEditor] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'term' | 'date' | 'order'>('term');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Filtered and sorted terms
  const filteredTerms = terms.filter(term => {
    // Apply search filter
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'published' ? term.isPublished :
      !term.isPublished;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Apply sorting
    if (sortBy === 'term') {
      return sortDirection === 'asc' 
        ? a.term.localeCompare(b.term)
        : b.term.localeCompare(a.term);
    } else if (sortBy === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else { // order
      const aOrder = a.order || 0;
      const bOrder = b.order || 0;
      return sortDirection === 'asc' ? aOrder - bOrder : bOrder - aOrder;
    }
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Toggle sort direction
  const handleSortToggle = (sortField: 'term' | 'date' | 'order') => {
    if (sortBy === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(sortField);
      setSortDirection('asc');
    }
  };

  // Handle edit button click
  const handleEdit = (term: FinancialTerm) => {
    setSelectedTerm(term);
    setFormData({
      term: term.term,
      definition: term.definition,
      isPublished: term.isPublished,
      order: term.order || 0,
      category: term.category,
      difficulty: term.difficulty,
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
      category: '',
      difficulty: 'מתחילים',
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

  // Handle editor content change - simplified for React-Quill
  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      definition: content
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
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8 text-[#002F42]">ניהול מילון מונחים פיננסי</h1>
      
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Terms List - Left Side */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
              >
                הוסף מונח חדש
              </button>
              
              <div className="flex flex-1 max-w-2xl gap-2">
                {/* Search input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="חיפוש מונחים..."
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute right-2 top-2.5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">כל הסטטוסים</option>
                  <option value="published">מפורסמים</option>
                  <option value="draft">טיוטות</option>
                </select>
              </div>
            </div>
            
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
            ) : filteredTerms.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-lg text-gray-600">
                  לא נמצאו מונחים התואמים את החיפוש.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortToggle('term')}
                      >
                        <div className="flex items-center justify-end">
                          מונח
                          {sortBy === 'term' && (
                            <span className="mr-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סטטוס
                      </th>
                      <th 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortToggle('date')}
                      >
                        <div className="flex items-center justify-end">
                          תאריך יצירה
                          {sortBy === 'date' && (
                            <span className="mr-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortToggle('order')}
                      >
                        <div className="flex items-center justify-end">
                          סדר
                          {sortBy === 'order' && (
                            <span className="mr-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTerms.map((term) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {term.order || '-'}
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
        </div>
        
        {/* Editor - Right Side */}
        <div className="md:col-span-8 lg:col-span-9">
          {isEditing ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">
                {selectedTerm ? `עריכת המונח: ${selectedTerm.term}` : 'הוספת מונח חדש'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="term" className="block text-gray-700 font-medium mb-2">שם המונח</label>
                  <input
                    type="text"
                    id="term"
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    dir="rtl"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="isPublished" className="block text-gray-700 font-medium mb-2">סטטוס</label>
                    <select
                      id="isPublished"
                      name="isPublished"
                      value={formData.isPublished ? "true" : "false"}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                      dir="rtl"
                    >
                      <option value="true">מפורסם</option>
                      <option value="false">טיוטה</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-gray-700 font-medium mb-2">קטגוריה</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                      dir="rtl"
                      placeholder="למשל: השקעות, בנקאות"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-2">רמת קושי</label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty || 'מתחילים'}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                      dir="rtl"
                    >
                      <option value="מתחילים">מתחילים</option>
                      <option value="בינוני">בינוני</option>
                      <option value="מתקדם">מתקדם</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="order" className="block text-gray-700 font-medium mb-2">סדר תצוגה</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    dir="ltr"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">הגדרה</label>
                  <TinyMCEEditor
                    initialContent={formData.definition}
                    onChange={handleEditorChange}
                    height="300px"
                  />
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
                    disabled={isSaving || !formData.term || !formData.definition}
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                      !isSaving && formData.term && formData.definition
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <div className="flex justify-center items-center">
                        <Loader text={null} size="small" className="my-0" />
                      </div>
                    ) : (
                      selectedTerm ? 'עדכן מונח' : 'הוסף מונח'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Terms list */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                  <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
                  >
                    הוסף מונח חדש
                  </button>
                  
                  <div className="flex flex-1 max-w-2xl gap-2">
                    {/* Search input */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="חיפוש מונחים..."
                        className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                      />
                      <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute right-2 top-2.5 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {/* Status filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                      className="p-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">כל הסטטוסים</option>
                      <option value="published">מפורסמים</option>
                      <option value="draft">טיוטות</option>
                    </select>
                  </div>
                </div>
                
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
                ) : filteredTerms.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-lg text-gray-600">
                      לא נמצאו מונחים התואמים את החיפוש.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th 
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSortToggle('term')}
                          >
                            <div className="flex items-center justify-end">
                              מונח
                              {sortBy === 'term' && (
                                <span className="mr-1">
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            סטטוס
                          </th>
                          <th 
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSortToggle('date')}
                          >
                            <div className="flex items-center justify-end">
                              תאריך יצירה
                              {sortBy === 'date' && (
                                <span className="mr-1">
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSortToggle('order')}
                          >
                            <div className="flex items-center justify-end">
                              סדר
                              {sortBy === 'order' && (
                                <span className="mr-1">
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            פעולות
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTerms.map((term) => (
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {term.order || '-'}
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
          )}
        </div>
      </div>
    </div>
  );
} 