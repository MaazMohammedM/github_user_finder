import React, { useEffect, useState } from "react";


const UserFinder = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [suggestedUserName,setSuggestedUserName] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(()=>{
    const fetchSuggestions = async ()=>{
        try{
            if(userName.trim() === ''){
                setSuggestedUserName([]);
                setLoadingSuggestions(false);
                return;
            }
            setLoadingSuggestions(true);

            const res = await fetch(`https://api.github.com/search/users?q=${userName}&per_page=5`);
            if(res.ok){
                const data = await res.json();
                const suggestions = data.items.map((item)=> item.login)
                setSuggestedUserName(suggestions)
            } else{
                setSuggestedUserName([])
            }
        } catch(error){
            setSuggestedUserName([]);
        }
        finally {
            setLoadingSuggestions(false);
          }
    }
    const timeOutId = setTimeout(fetchSuggestions,300);
    return ()=>
        clearTimeout(timeOutId)
    }, [userName])

  const handleSearch = async () => {
    try {
        if(userName.trim()===''){
            setError(`Please Enter a User Name`);
            return;
        } 
        setLoadingSuggestions(true)
      const res = await fetch(`https://api.github.com/users/${userName}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.message || `Error Fetching Data`);
        setUserData(null);
      }
    } catch (error) {
      setError("Error Fetching Data");
      setUserData(null);
    } finally{
        setLoadingSuggestions(false)
    }
  };

  const handleReset=()=>{
    setUserName('');
    setUserData(null);
    setError(null)
  }

  const hanldeOpenInGithub = ()=>{
    if(userData){
        window.open(userData.html_url,'_blank')
        handleReset();
    }
  }

  return (
    <section className="w-full  bg-gradient-to-r from-black  to-neutral-800 text-white">
      <div className="container max-w-[90rem] h-[100svh] mx-auto flex flex-col gap-4 items-center justify-center">
        <h3 className="text-4xl font-extrabold mb-4">GitHub User Finder</h3>
        <div className="flex w-1/4 flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-2 py-1 max-w-full rounded bg-white text-neutral-800"
          />
          <div className=" items-center flex justify-between gap-2">

          <button
            onClick={handleSearch}
            disabled={userName.trim() === '' || loadingSuggestions}
            className="bg-blue-600 transition-all cursor-pointer w-1/2 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
            {loadingSuggestions ? 'Searching...' : 'Search'}
          </button>
          <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 transition-all cursor-pointer w-1/2 text-white px-2 py-1 rounded"
          >
          Reset
        </button>
        </div>
        </div>
        {loadingSuggestions && <div className="text-gray-400 mb-2">Loading suggestions...</div>}
        {
            suggestedUserName.length > 0 && !loadingSuggestions && (<div className="mb-4">
            <div className="text-gray-400">Suggestions:</div>
            <ul className="list-none ml-6">
              {suggestedUserName.map((suggestion) => (
                <li key={suggestion}
                className="cursor-pointer list-disc text-blue-600 hover:underline"
                onClick={() => setUserName(suggestion)}
                >{suggestion}</li>
              ))}
            </ul>
          </div>)
        }
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {userData && (
          <div className="flex flex-col items-center">
            <img
              src={userData.avatar_url}
              alt={`${userData.login}'s avatar`}
              className="w-20 h-20 rounded-full mb-2"
            />
            <div className="text-lg font-semibold">{userData.login}</div>
            <div>{userData.bio}</div>
            <div className="mt-4">
              <a
                href={userData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={hanldeOpenInGithub}
                className="text-blue-600 underline"
              >
                View on GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


export default UserFinder;