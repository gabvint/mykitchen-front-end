import { AuthedUserContext } from '../../App';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsBookmarkHeartFill } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { PiCookingPotLight } from "react-icons/pi";
import * as recipeService from '/src/services/recipeService'; 

import Greeting from '../Greeting/Greeting';

const RecipeList = (props) => {
  const user = useContext(AuthedUserContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // <-- new

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecipes(props.recipes.filter(recipe => recipe.isPublic === true));
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer); // clean up
  }, [props.recipes]);

  return (
    <>
      <Greeting user={user} />

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px] font-albert text-lg text-gray-600">
          Loading recipes...
        </div>
      ) : (
        <div className='grid lg:grid-cols-4 md:grid-cols-3 justify-items-center font-albert font-semibold gap-8'>
          {recipes.map((recipe, idx) => (
            <div key={idx}>
              <div className={`w-72 h-[300px] rounded overflow-hidden shadow-lg ${idx === 0 ? 'mt-20' : 'mt-4'} mb-6 md:mt-4 hover:shadow-redorange`}>
                <div className='relative flex z-10'>
                  <img className='w-64 h-44 rounded-lg object-cover ml-4 mt-2' src={recipe.imageUrl} alt={`${recipe.name}Img`} />
                  <div
                    className='absolute top-3 right-5 p-1 bg-white rounded-md shadow-lg'
                    onClick={() => props.handleSaveRecipe(user._id, recipe._id)}
                  >
                    <BsBookmarkHeartFill
                      size={20}
                      className={`${recipe.savedBy.includes(user._id) ? 'fill-red-400' : 'fill-black'} cursor-pointer hover:fill-red-400`}
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
    </>
  );
};

export default RecipeList;
