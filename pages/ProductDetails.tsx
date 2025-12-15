
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../services/store';
import { ShoppingCart, Star, ArrowLeft, User, Clock } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, user, addProductReview } = useAuth();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === Number(id));

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <button onClick={() => navigate('/shop')} className="text-amber-600 underline">Back to Shop</button>
        </div>
    );
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        navigate('/login');
        return;
    }
    setIsSubmitting(true);
    const newReview = {
        id: `r-${Date.now()}`,
        userName: user.name,
        rating,
        comment,
        date: new Date().toLocaleDateString()
    };
    
    // Simulate delay
    setTimeout(() => {
        addProductReview(product.id, newReview);
        setComment('');
        setRating(5);
        setIsSubmitting(false);
    }, 500);
  };

  const allReviews = product.userReviews || [];

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/shop')} className="flex items-center text-neutral-600 hover:text-amber-600 mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Catalog
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100 mb-12">
           <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-96 md:h-auto bg-gray-100 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-amber-400 uppercase tracking-wide">
                    {product.category}
                  </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h1 className="text-3xl md:text-4xl font-bold font-serif text-neutral-900 mb-4">{product.name}</h1>
                  <div className="flex items-center text-amber-500 mb-6">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                             <Star key={i} size={20} className={i < Math.round(product.rating) ? "fill-current" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-neutral-500 text-lg font-medium">({allReviews.length + product.reviews} Reviews)</span>
                  </div>
                  <p className="text-neutral-600 text-lg leading-relaxed mb-8">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                     <div>
                        <span className="text-sm text-neutral-500 block">Wholesale Price</span>
                        <span className="text-4xl font-bold text-neutral-900">₹{product.price}</span>
                     </div>
                     <button 
                        onClick={() => addToCart(product)}
                        className="flex items-center px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-amber-500 hover:text-black transition-all shadow-lg font-bold"
                     >
                        <ShoppingCart className="mr-3" /> Add to Cart
                     </button>
                  </div>
              </div>
           </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-8">
               <h2 className="text-2xl font-bold font-serif text-neutral-900 border-b border-neutral-200 pb-4">Customer Reviews</h2>
               {allReviews.length === 0 ? (
                   <p className="text-neutral-500 italic">No user reviews yet. Be the first to review!</p>
               ) : (
                   allReviews.map(review => (
                       <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                          <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                  <div className="bg-neutral-100 p-2 rounded-full mr-3">
                                      <User size={20} className="text-neutral-600" />
                                  </div>
                                  <div>
                                      <p className="font-bold text-neutral-900">{review.userName}</p>
                                      <div className="flex text-amber-500 text-xs">
                                          {[...Array(5)].map((_, i) => (
                                              <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                                          ))}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center text-neutral-400 text-xs">
                                  <Clock size={12} className="mr-1" /> {review.date}
                              </div>
                          </div>
                          <p className="text-neutral-600">{review.comment}</p>
                       </div>
                   ))
               )}
           </div>

           <div className="lg:col-span-1">
               <div className="bg-white p-6 rounded-xl shadow-md border border-neutral-100 sticky top-24">
                   <h3 className="text-xl font-bold font-serif text-neutral-900 mb-6">Write a Review</h3>
                   {user ? (
                       <form onSubmit={handleAddReview}>
                           <div className="mb-4">
                               <label className="block text-sm font-bold text-neutral-700 mb-2">Rating</label>
                               <div className="flex gap-2">
                                   {[1, 2, 3, 4, 5].map(star => (
                                       <button 
                                         key={star} 
                                         type="button" 
                                         onClick={() => setRating(star)}
                                         className="focus:outline-none"
                                       >
                                           <Star size={24} className={`${star <= rating ? 'text-amber-500 fill-current' : 'text-gray-300'} transition-colors`} />
                                       </button>
                                   ))}
                               </div>
                           </div>
                           <div className="mb-4">
                               <label className="block text-sm font-bold text-neutral-700 mb-2">Comment</label>
                               <textarea 
                                 required
                                 className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-amber-500 focus:border-amber-500 bg-neutral-50 text-black"
                                 rows={4}
                                 placeholder="Share your experience..."
                                 value={comment}
                                 onChange={e => setComment(e.target.value)}
                               />
                           </div>
                           <button 
                             type="submit" 
                             disabled={isSubmitting}
                             className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
                           >
                               {isSubmitting ? 'Submitting...' : 'Post Review'}
                           </button>
                       </form>
                   ) : (
                       <div className="text-center py-6">
                           <p className="text-neutral-500 mb-4">Please login to write a review.</p>
                           <button onClick={() => navigate('/login')} className="text-amber-600 font-bold underline">Login Now</button>
                       </div>
                   )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
