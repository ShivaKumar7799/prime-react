import React, { useEffect, useRef, useState } from 'react';

function AutoComplete() {
  const [isFocussed, setIsFocussed] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    { id: 1, text: 'apple', tags: ['fruit', 'red'] },
    { id: 2, text: 'banana', tags: ['fruit', 'yellow'] },
    { id: 3, text: 'grapes', tags: ['fruit', 'green'] },
  ]);
  const directories = [
    { id: 4, text: 'docs', tags: ['document', 'pdf'] },
    { id: 5, text: 'images', tags: ['photo', 'gallery'] },
    { id: 6, text: 'videos', tags: ['video', 'mp4'] },
  ];
  const autoCompleteRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState<any>({
    'Recent Searches': -1,
    Directories: -1,
  }); // Track active item index for each group

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        autoCompleteRef.current &&
        !autoCompleteRef.current.contains(event.target)
      ) {
        setIsFocussed(false);
        setActiveIndex({ 'Recent Searches': -1, Directories: -1 });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsFocussed(true);
    // Initialize active index when the input is focused
    setActiveIndex({ ...activeIndex, 'Recent Searches': -1, Directories: -1 });
  };

  const combinedItems = [
    { title: 'Recent Searches', items: recentSearches },
    { title: 'Directories', items: directories },
  ];

  const handleDeleteRecentSearch = (id) => {
    const updatedSearches = recentSearches.filter((item) => item.id !== id);
    setRecentSearches(updatedSearches);
    // Prevent the event from bubbling up and closing the dropdown
    event.stopPropagation();
  };

  const handleSelectItem = (item) => {
    setSearchText(item.text);
    setIsFocussed(false);
    // You can perform additional actions when an item is selected, such as submitting a form, etc.
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const filteredItems = combinedItems
    .map((group) => ({
      title: group.title,
      items: group.items.filter((item) =>
        item.text.toLowerCase().includes(searchText.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className='relative'>
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={handleFocus}
        placeholder='Search for directories or subfolders or tasks'
        className={`w-[400px] pl-4 border-[1px] border-black h-10 rounded-lg ${
          isFocussed ? '!w-full' : ''
        }`}
        type='text'
      />
      {isFocussed && (
        <div
          ref={autoCompleteRef}
          className='mt-1 max-h-[90vh] overflow-auto rounded-lg w-full bg-[#fa7a7a] absolute left-0 top-10'
        >
          {filteredItems.map((group) => (
            <div key={group.title}>
              <div className='flex items-center justify-between bg-gray-300 px-4 py-2'>
                <div className='text-gray-700 font-bold'>{group.title}</div>
                {group.title === 'Recent Searches' &&
                  group.items.length > 0 && (
                    <button
                      onClick={handleClearRecentSearches}
                      className='text-red-600 hover:text-red-800'
                    >
                      Clear All Recent Searches
                    </button>
                  )}
              </div>
              {group.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-1 px-4 cursor-pointer hover:bg-[red] ${
                    activeIndex['Recent Searches'] === index
                      ? 'bg-[#cae4ee]'
                      : 'bg-[#f9f9f9]'
                  }`}
                >
                  <div>
                    {item.tags.map((tag, tagIndex) => (
                      <button
                        key={tagIndex}
                        className='bg-gray-400 text-sm text-gray-700 px-2 rounded-md mr-1'
                      >
                        {tag}
                      </button>
                    ))}
                    <span className='mr-2'>{item.text}</span>
                  </div>
                  {group.title === 'Recent Searches' && (
                    <button
                      onClick={() => handleDeleteRecentSearch(item.id)}
                      className='text-red-600 hover:text-red-800'
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutoComplete;
