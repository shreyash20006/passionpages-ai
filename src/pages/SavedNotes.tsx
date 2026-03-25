import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../lib/auth';

type SavedNote = {
  id: string;
  title: string;
  created_at: string;
  data: any;
};

export default function SavedNotes() {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    const fetchNotes = async () => {
      if (!user) {
        // Fallback to localStorage
        const saved = localStorage.getItem('passionpages_saved_notes');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setNotes(parsed.map((n: any) => ({
              ...n,
              created_at: n.date // Map old date field to created_at
            })));
          } catch (e) {
            console.error('Failed to parse saved notes', e);
          }
        }
        setLoading(false);
        return;
      }

      try {
        const token = await getAuthToken();
        const response = await fetch('/api/notes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        }
      } catch (error) {
        console.error('Failed to fetch notes from Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user, authLoading]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      const updated = notes.filter(n => n.id !== id);
      setNotes(updated);
      localStorage.setItem('passionpages_saved_notes', JSON.stringify(updated));
      return;
    }

    try {
      const token = await getAuthToken();
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotes(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleOpen = (note: SavedNote) => {
    navigate('/results', { state: { data: note.data } });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-pink-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Saved Notes</h1>
        <p className="text-slate-400 mt-2">Access your previously generated study guides.</p>
      </div>

      {notes.length === 0 ? (
        <div className="bg-[#111827]/80 backdrop-blur-md rounded-[2rem] border border-white/5 p-12 text-center shadow-2xl shadow-black/20">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <BookOpen size={32} />
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2">No saved notes yet</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Generate your first study guide and save it to access it later from this page.
          </p>
          <Link 
            to="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/25 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            Generate Notes
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleOpen(note)}
              className="bg-[#111827]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-lg shadow-black/20 hover:shadow-pink-500/10 hover:border-pink-500/30 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 bg-[#0a0f1e]/80 border border-white/10 text-pink-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={24} />
                </div>
                <button 
                  onClick={(e) => handleDelete(note.id, e)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-display font-bold text-white mb-2 line-clamp-2 relative z-10 group-hover:text-pink-100 transition-colors">
                {note.title}
              </h3>
              
              <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-slate-500 relative z-10">
                <Calendar size={14} className="text-purple-400" />
                {new Date(note.created_at).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
