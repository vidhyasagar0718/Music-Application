import React, { useState, useMemo, useCallback } from 'react';
import initialSongs from '../data/initialSongs';

const MusicLibrary = ({ user }) => {
  const [songs, setSongs] = useState(initialSongs);
  const [filterTerm, setFilterTerm] = useState('');
  const [filterBy, setFilterBy] = useState('title');
  const [sortBy, setSortBy] = useState('title');
  const [groupBy, setGroupBy] = useState(null);
  const [newSong, setNewSong] = useState({ title: '', artist: '', album: '', genre: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleNewSongChange = (e) => {
    const { name, value } = e.target;
    setNewSong(prev => ({ ...prev, [name]: value }));
  };

  const addSong = (e) => {
    e.preventDefault();
    if (!newSong.title || !newSong.artist || !newSong.album || !newSong.genre) {
      console.error('Please fill in all fields');
      return;
    }
    const id = 's' + (songs.length + 1);
    setSongs(prev => [...prev, { id, ...newSong }]);
    setNewSong({ title: '', artist: '', album: '', genre: '' });
    setShowAddForm(false);
  };

  const deleteSong = useCallback((id) => {
    setSongs(prev => prev.filter(song => song.id !== id));
  }, []);

  const processedSongs = useMemo(() => {
    let filtered = [...songs];
    if (filterTerm) {
      filtered = filtered.filter(song =>
        song[filterBy].toLowerCase().includes(filterTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

    if (groupBy) {
      const grouped = filtered.reduce((acc, song) => {
        const key = song[groupBy];
        if (!acc[key]) acc[key] = [];
        acc[key].push(song);
        return acc;
      }, {});
      return Object.entries(grouped).map(([groupName, items]) => ({ groupName, items }));
    }

    return filtered;
  }, [songs, filterTerm, filterBy, sortBy, groupBy]);

  const renderSongs = () => {
    if (groupBy) {
      return processedSongs.map(group => (
        <div key={group.groupName}>
          <h3>Group: {group.groupName}</h3>
          <ul>{group.items.map(renderSongItem)}</ul>
        </div>
      ));
    }
    return <ul>{processedSongs.map(renderSongItem)}</ul>;
  };

  const renderSongItem = (song) => (
    <li key={song.id}>
      <strong>{song.title}</strong> - {song.artist} ({song.album})
      {isAdmin && <button onClick={() => deleteSong(song.id)}>Delete</button>}
    </li>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Music Library</h2>

      <div className="filters mb-4">
        <input placeholder="Search..." value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} />
        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </select>
        <select value={groupBy || 'none'} onChange={(e) => setGroupBy(e.target.value === 'none' ? null : e.target.value)}>
          <option value="none">No Grouping</option>
          <option value="artist">Group by Artist</option>
          <option value="album">Group by Album</option>
        </select>
      </div>

      {isAdmin && (
        <div className="admin-section mb-4">
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Hide Form' : 'Add New Song'}
          </button>
          {showAddForm && (
            <form onSubmit={addSong}>
              <input name="title" placeholder="Title" value={newSong.title} onChange={handleNewSongChange} required />
              <input name="artist" placeholder="Artist" value={newSong.artist} onChange={handleNewSongChange} required />
              <input name="album" placeholder="Album" value={newSong.album} onChange={handleNewSongChange} required />
              <input name="genre" placeholder="Genre" value={newSong.genre} onChange={handleNewSongChange} required />
              <button type="submit">Add</button>
            </form>
          )}
        </div>
      )}

      {processedSongs.length === 0 ? <p>No songs found.</p> : renderSongs()}
    </div>
  );
};

export default MusicLibrary;
