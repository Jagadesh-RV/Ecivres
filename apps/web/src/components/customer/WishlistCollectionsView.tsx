'use client';

import React, { useState } from 'react';
import { Heart, FolderPlus, Share2, Star, Sparkles, MapPin, Trash2 } from 'lucide-react';

export interface SavedItem {
  id: string;
  type: 'PROVIDER' | 'SERVICE';
  targetId: string;
  name: string;
  rating: number;
  category: string;
  imageUrl?: string;
  price?: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareCode?: string;
  items: SavedItem[];
}

interface WishlistCollectionsViewProps {
  collections: Collection[];
  onAddCollection?: (name: string, description: string, isPublic: boolean) => void;
  onShareCollection?: (collectionId: string) => void;
  onRemoveItem?: (collectionId: string, itemId: string) => void;
}

export const WishlistCollectionsView: React.FC<WishlistCollectionsViewProps> = ({
  collections,
  onAddCollection,
  onShareCollection,
  onRemoveItem,
}) => {
  const [activeTab, setActiveTab] = useState<string>(collections[0]?.id || 'all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColPublic, setNewColPublic] = useState(false);

  const activeCollection = collections.find((c) => c.id === activeTab) || collections[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onAddCollection?.(newColName, newColDesc, newColPublic);
    setNewColName('');
    setNewColDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <span>Saved Collections & Wishlists</span>
          </h2>
          <p className="text-xs text-slate-400">Manage saved providers, services, and share custom lists.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {collections.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === col.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {col.name} ({col.items.length})
          </button>
        ))}
      </div>

      {/* Active Collection Content */}
      {activeCollection ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{activeCollection.name}</span>
                {activeCollection.isPublic && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px]">
                    Public Shareable
                  </span>
                )}
              </h3>
              {activeCollection.description && (
                <p className="text-xs text-slate-400 mt-1">{activeCollection.description}</p>
              )}
            </div>
            {activeCollection.shareCode && (
              <button
                onClick={() => onShareCollection?.(activeCollection.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Code: {activeCollection.shareCode}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCollection.items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                      {item.type}
                    </span>
                    <button
                      onClick={() => onRemoveItem?.(activeCollection.id, item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {item.rating}
                    </span>
                    <span>{item.category}</span>
                  </div>
                </div>

                {item.price && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Starting at</span>
                    <span className="text-sm font-bold text-emerald-400">${item.price}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          No collections created yet.
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold">Create Collection</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Collection Name</label>
              <input
                type="text"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="e.g. Dream Home Renovators"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Description</label>
              <textarea
                value={newColDesc}
                onChange={(e) => setNewColDesc(e.target.value)}
                placeholder="Saved providers for upcoming kitchen remodel"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 h-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newColPublic}
                onChange={(e) => setNewColPublic(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="isPublic" className="text-xs text-slate-300">
                Allow sharing with friends/family
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
              >
                Save Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
