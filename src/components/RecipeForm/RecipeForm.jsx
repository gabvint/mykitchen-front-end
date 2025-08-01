import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as recipeService from '/src/services/recipeService'; 
import { AuthedUserContext } from '../../App';
import Greeting from '../Greeting/Greeting';

const RecipeForm = (props) => {
    const { recipeId } = useParams();
    const user = useContext(AuthedUserContext);

    const [formData, setFormData] = useState({
        name: '',
        preptime: '',
        cooktime: '',
        ingredients: [{ name: '', measurement: '' }],
        instructions: [{ description: '' }],
        isPublic: true,
        imageUrl: '',
    });

    const [error, setError] = useState(null); 

    const handleChange = (evt) => {
        const { name, value, type, checked } = evt.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleIngredientChange = (ingredientIdx, evt) => {
        const newIngredient = formData.ingredients.map((ingredient, idx) => {
            if (ingredientIdx === idx) {
                return { ...ingredient, [evt.target.name]: evt.target.value };
            }
            return ingredient;
        });
        setFormData({ ...formData, ingredients: newIngredient });
    };

    const handleAddIngredient = () => {
        setFormData({ ...formData, ingredients: [...formData.ingredients, { name: '', measurement: '' }] });
    };

    const handleRemoveIngredient = (idx) => {
        setFormData({ ...formData, ingredients: formData.ingredients.filter((_, sidx) => idx !== sidx) });
    };

    const handleInstructionChange = (instructionIdx, evt) => {
        const newInstruction = formData.instructions.map((instruction, idx) => {
            if (instructionIdx === idx) {
                return { ...instruction, [evt.target.name]: evt.target.value };
            }
            return instruction;
        });
        setFormData({ ...formData, instructions: newInstruction });
    };

    const handleAddInstruction = () => {
        setFormData({ ...formData, instructions: [...formData.instructions, { description: '' }] });
    };

    const handleRemoveInstruction = (idx) => {
        setFormData({ ...formData, instructions: formData.instructions.filter((_, sidx) => idx !== sidx) });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();  

        setError(null); 

        // Frontend validation for required fields
        if (!formData.name || formData.name.length < 2 || formData.name.length > 50) {
            setError('Recipe name must be between 2-50 characters');
            return; 
        }

        if (!formData.preptime || formData.preptime.length > 10) {
            setError('Prep time must be a maximum of 10 characters');
            return; 
        }

        if (!formData.cooktime || formData.cooktime.length > 10) {
            setError('Cook time must be a maximum of 10 characters');
            return; 
        }

        if (!formData.ingredients || formData.ingredients.length < 1) {
            setError('Ingredients are required');
            return; 
        }

        if (!formData.instructions || formData.instructions.length < 1) {
            setError('Instructions are required');
            return; 
        }

        try {
            if (recipeId) {
                await props.handleUpdateRecipe(recipeId, formData);  
            } else {
                await props.handleAddRecipe(formData);  
            }
        } catch (err) {
            setError(err.message); 
        }
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            const recipeData = await recipeService.show(recipeId);
            setFormData(recipeData);
        };
        if (recipeId) fetchRecipe();
    }, [recipeId]);

    return (
        <>
            <Greeting user={user} />
            <div className='flex justify-center items-center px-4'>
                <div className='font-albert w-full max-w-xl p-6 md:p-8 rounded-lg'>
                    <p className='font-literata font-bold text-redorange text-2xl text-center mb-6'>
                        {recipeId ? 'Edit Recipe' : 'Add Recipe'}
                    </p>

                    {/* Display error message */}
                    {error && (
                        <div className="text-red-600 text-center mb-4">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                        <div className='flex flex-col'>
                            <label htmlFor="name">Recipe Name:</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className='p-2 rounded border-2 border-cream'
                                required
                            />
                        </div>

                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="preptime">Preptime:</label>
                                <input
                                    type="text"
                                    name="preptime"
                                    id="preptime"
                                    value={formData.preptime}
                                    onChange={handleChange}
                                    className='p-2 rounded border-2 border-cream'
                                    required
                                />
                            </div>
                            <div className='flex flex-col flex-1'>
                                <label htmlFor="cooktime">Cooktime:</label>
                                <input
                                    type="text"
                                    name="cooktime"
                                    id="cooktime"
                                    value={formData.cooktime}
                                    onChange={handleChange}
                                    className='p-2 rounded border-2 border-cream'
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="ingredients">Ingredients:</label>
                            {formData.ingredients.map((ingredient, idx) => (
                                <div key={idx} className='flex gap-2 flex-wrap'>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Ingredient"
                                        value={ingredient.name}
                                        onChange={evt => handleIngredientChange(idx, evt)}
                                        className='p-2 rounded border-2 border-cream flex-1 mt-1'
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="measurement"
                                        placeholder="Measurement"
                                        value={ingredient.measurement}
                                        onChange={evt => handleIngredientChange(idx, evt)}
                                        className='p-2 rounded border-2 border-cream flex-1 mt-1'
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(idx)}
                                        className='bg-redorange text-white rounded w-16 h-11 mt-1
                                        hover:bg-white hover:text-redorange hover:border-2 hover:border-redorange'>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddIngredient}
                                className='bg-sage text-white rounded px-2 mt-2
                                 hover:bg-white hover:text-darksage hover:border-2 hover:border-darksage'>
                                Add Ingredient
                            </button>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="instructions">Instructions</label>
                            {formData.instructions.map((instruction, idx) => (
                                <div key={idx} className='flex gap-2 flex-wrap'>
                                    <textarea
                                        cols="40"
                                        rows="1"
                                        name="description"
                                        placeholder="Instruction"
                                        value={instruction.description}
                                        onChange={evt => handleInstructionChange(idx, evt)}
                                        className='p-2 rounded border-2 border-cream flex-1 mt-1'
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInstruction(idx)}
                                        className='bg-redorange text-white rounded w-16 h-11 mt-1
                                        hover:bg-white hover:text-redorange hover:border-2 hover:border-redorange'>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddInstruction}
                                className='bg-sage text-white rounded px-2 mt-2
                                hover:bg-white hover:text-darksage hover:border-2 hover:border-darksage'>
                                Add Step
                            </button>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="imageUrl">Upload Image URL: </label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className='p-2 rounded border-2 border-cream'/>
                        </div>

                        <div className='flex items-center gap-2'>
                            <label htmlFor="isPublic">Share with Community?</label>
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                className='h-4 w-4'/>
                        </div>

                        <button
                            className='relative font-bold rounded-xl px-10 py-2  overflow-hidden group bg-sage text-white hover:bg-gradient-to-r hover:from-sage
                               hover:to-darksage hover:ring-2 hover:ring-offset-2 hover:ring-darksage transition-all ease-out duration-300 mt-2 mx-auto'
                            type="submit">
                            <span className='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white 
                                opacity-10 rotate-12 group-hover:-translate-x-40 ease'></span>
                            <span>SUBMIT</span>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RecipeForm;
