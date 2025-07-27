import * as recipeService from '/src/services/recipeService'; 
import { AuthedUserContext } from '../../App';
import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CiClock2 } from "react-icons/ci";
import { PiCookingPotLight } from "react-icons/pi";
import { BsBookmarkHeartFill } from "react-icons/bs";
import Greeting from '../Greeting/Greeting';

const SavedRecipes = (props) => {
  const { userId } = useParams();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const user = useContext(AuthedUserContext);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      const recipeData = await recipeService.savedRecipes(userId);
      setSavedRecipes(recipeData);
    };
    fetchSavedRecipes();
  }, [userId]);

  return (
    <div>
      <Greeting user={user} />

      {savedRecipes.length === 0 ? (
        <div className="text-center text-gray-500 font-medium mt-24 text-lg">
          No saved recipes yet.
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 justify-items-center font-albert font-semibold gap-8">
          {savedRecipes.map((recipe, idx) => (
            <div key={idx}>
              <div className={`w-72 h-[300px] rounded overflow-hidden shadow-lg ${idx === 0 ? 'mt-20' : 'mt-4'} mb-6 md:mt-4 hover:shadow-redorange`}>
                <div className='relative flex z-10'>
                  <img className='w-64 h-44 rounded-lg object-cover ml-4 mt-2' src={recipe.imageUrl} alt={`${recipe.name}Img`} />
                  <div
                    className='absolute top-3 right-5 p-1 bg-white rounded-md shadow-lg'
                    onClick={() => props.handleSaveRecipe(user._id, recipe._id) && window.location.reload()}
                  >
                    <BsBookmarkHeartFill
                      size={20}
                      className={`cursor-pointer hover:fill-black ${
                        recipe.savedBy.includes(user._id) ? 'fill-red-400' : 'fill-black'
                      }`}
                    />
                  </div>
                </div>

                <Link to={`/recipes/${recipe._id}`}>
                  <h2 className='font-literata text-lg text-center mb-0 mt-3'>{recipe.name}</h2>
                  <div className="px-8 pt-4 pb-2 flex">
                    <span className="bg-cream rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-2 flex">
                      <CiClock2 className='mr-2' size={20} /> {recipe.preptime}
                    </span>
                    <span className="bg-cream rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-2 flex">
                      <PiCookingPotLight className='mr-2' size={20} /> {recipe.cooktime}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
