import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ImpersonationBanner = () => {
  const { user, isImpersonating, returnToAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isImpersonating) return null;

  const handleReturn = () => {
    returnToAdmin();
    navigate('/admin/dashboard');
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-950">
      <Eye className="w-4 h-4 shrink-0" />
      <span className="truncate">
        Viewing as <strong>{user?.name || user?.businessName || user?.email}</strong> — this is a temporary support session.
      </span>
      <button
        type="button"
        onClick={handleReturn}
        className="flex items-center gap-1.5 rounded-full bg-yellow-950 px-3 py-1 text-xs font-bold text-yellow-100 hover:bg-yellow-900 transition-colors shrink-0"
      >
        <LogOut className="w-3.5 h-3.5" />
        Return to Admin
      </button>
    </div>
  );
};

