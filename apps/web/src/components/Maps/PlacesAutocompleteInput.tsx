import React, { useState } from 'react';

interface PlacesAutocompleteInputProps {
  onSelectPlace?: (place: { placeId: string; description: string }) => void;
  placeholder?: string;
}

export const PlacesAutocompleteInput: React.FC<PlacesAutocompleteInputProps> = ({
  onSelectPlace,
  placeholder = 'Search address or landmark...',
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ placeId: string; description: string }>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 2) {
      setSuggestions([
        { placeId: '1', description: `${val}, Downtown, San Francisco, CA` },
        { placeId: '2', description: `${val} Street, Silicon Valley, CA` },
      ]);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map(s => (
            <li
              key={s.placeId}
              onClick={() => {
                setQuery(s.description);
                setSuggestions([]);
                if (onSelectPlace) onSelectPlace(s);
              }}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
