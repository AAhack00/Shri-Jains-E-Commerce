
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../services/store';
import { useAuth } from '../services/store';
import { AddressInfo } from '../types';
import { CreditCard, CheckCircle, Loader2, AlertCircle, Wallet, Truck, Tag, Gift, Lock } from 'lucide-react';

// Define available coupons
const AVAILABLE_COUPONS = [
  { code: 'WELCOME50', description: 'Flat ₹50 OFF (Min Order: ₹500)' },
  { code: 'SJSM10', description: '10% OFF on all orders' }
];

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart, shippingCharge, deliveryDate, applyCoupon, discount, couponCode, removeCoupon } = useCart();
  const { user, addOrder, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      // Small delay to ensure auth state is loaded
      const timer = setTimeout(() => {
          if(!user) navigate('/login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Payment, 3: Success
  
  // Loyalty Points Logic
  const userPoints = user?.loyaltyPoints || 0;
  const [redeemPoints, setRedeemPoints] = useState(false);
  
  // Calculate amounts
  const subTotalWithShipping = cartTotal + shippingCharge;
  const totalAfterCoupon = Math.max(0, subTotalWithShipping - discount);
  
  // Max redeemable is either total amount or user points
  const pointsToRedeem = redeemPoints ? Math.min(userPoints, Math.floor(totalAfterCoupon)) : 0;
  const finalTotal = Math.max(0, totalAfterCoupon - pointsToRedeem);

  // Calculate NEW points to earn
  // Logic: 1 point per ₹100 spent, Max 50 points per order
  const potentialPoints = Math.min(50, Math.floor(finalTotal / 100));
  
  // State to persist earned points after cart clear
  const [earnedPoints, setEarnedPoints] = useState(0);

  const [address, setAddress] = useState<AddressInfo>({
    fullName: '',
    street: '',
    city: '',
    state: 'Rajasthan',
    zip: '',
    phone: ''
  });

  // Load user data into address form
  useEffect(() => {
    if (user) {
        setAddress({
            fullName: user.name || '',
            street: user.street || '',
            city: user.city || '', 
            state: 'Rajasthan',
            zip: '',
            phone: user.phone || ''
        });
    }
  }, [user]);
  
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  
  // Coupon State
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Card Details State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.zip) {
        setError('Please fill in all address details.');
        return;
    }
    // Validate Phone Number (10 digits)
    if (!/^\d{10}$/.test(address.phone)) {
        setError('Phone number must be exactly 10 digits.');
        return;
    }
    // Validate ZIP Code (6 digits)
    if (!/^\d{6}$/.test(address.zip)) {
        setError('ZIP Code must be exactly 6 digits.');
        return;
    }
    setError(null);
    setStep(2);
  };

  const handleApplyCoupon = () => {
    if(!selectedCoupon) return;
    
    const result = applyCoupon(selectedCoupon);
    if(result.success) {
        setCouponMessage({ type: 'success', text: result.message });
    } else {
        setCouponMessage({ type: 'error', text: result.message });
    }
  };

  const handleRemoveCoupon = () => {
      removeCoupon();
      setCouponMessage(null);
      setSelectedCoupon('');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Payment Details
    if (paymentMethod === 'CARD') {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
            setError('Please fill in all card details.');
            return;
        }
        if (cardDetails.number.length < 16) {
             setError('Invalid card number.');
             return;
        }
    } else if (paymentMethod === 'UPI') {
        if (!upiId || upiId.trim() === '') {
             setError('Please enter your UPI ID.');
             return;
        }
        if (!upiId.includes('@')) {
            setError('Invalid UPI ID format.');
            return;
        }
    }

    setIsProcessing(true);
    
    // Capture points to earn before clearing cart
    const pointsEarned = potentialPoints;

    // Simulate payment delay
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}`;
      addOrder({
        id: orderId,
        items: [...cart],
        subtotal: cartTotal,
        deliveryCharge: shippingCharge,
        discount: discount + pointsToRedeem, // Total discount including points
        total: finalTotal,
        date: new Date().toISOString(),
        deliveryDate: deliveryDate,
        status: 'Processing',
        address: `${address.street}, ${address.city}, ${address.state} - ${address.zip}`,
        pointsEarned: pointsEarned
      });
      
      // Update User Loyalty Points
      if (user) {
          // New Balance = (Current - Redeemed) + Earned
          const newBalance = (userPoints - pointsToRedeem) + pointsEarned;
          updateProfile({ loyaltyPoints: newBalance });
      }

      setEarnedPoints(pointsEarned);
      clearCart();
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  if (!user) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
            <Lock size={48} className="text-neutral-400 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Login Required</h2>
            <p className="text-neutral-600 mb-6">You must be logged in to place an order.</p>
            <button onClick={() => navigate('/login')} className="bg-amber-500 text-black px-6 py-2 rounded-md font-bold hover:bg-amber-400">
                Go to Login
            </button>
        </div>
    );
  }

  if (cart.length === 0 && step !== 3) {
    navigate('/shop');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Steps */}
        <div className="mb-8">
           <div className="flex items-center justify-center space-x-4">
             <div className={`flex items-center ${step >= 1 ? 'text-amber-600' : 'text-neutral-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-amber-600 bg-amber-50' : 'border-neutral-300'} font-bold`}>1</div>
                <span className="ml-2 font-medium">Address</span>
             </div>
             <div className="w-12 h-0.5 bg-neutral-300"></div>
             <div className={`flex items-center ${step >= 2 ? 'text-amber-600' : 'text-neutral-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-amber-600 bg-amber-50' : 'border-neutral-300'} font-bold`}>2</div>
                <span className="ml-2 font-medium">Payment</span>
             </div>
             <div className="w-12 h-0.5 bg-neutral-300"></div>
             <div className={`flex items-center ${step >= 3 ? 'text-amber-600' : 'text-neutral-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-amber-600 bg-amber-50' : 'border-neutral-300'} font-bold`}>3</div>
                <span className="ml-2 font-medium">Done</span>
             </div>
           </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-neutral-100">
          
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 font-serif text-neutral-900">Shipping Information</h2>
              {error && (
                  <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md flex items-center text-sm font-medium">
                      <AlertCircle size={16} className="mr-2"/> {error}
                  </div>
              )}
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700">Full Name</label>
                  <input required type="text" className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700">Phone Number (10 digits)</label>
                  <input 
                    required 
                    type="tel" 
                    maxLength={10}
                    placeholder="e.g. 9999999999"
                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white" 
                    value={address.phone} 
                    onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setAddress({...address, phone: val});
                    }} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700">Street Address</label>
                  <input required type="text" className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700">City</label>
                    <input required type="text" placeholder="Enter City" className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700">ZIP Code</label>
                    <input 
                      required 
                      type="text" 
                      maxLength={6}
                      className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white" 
                      value={address.zip} 
                      onChange={e => setAddress({...address, zip: e.target.value.replace(/\D/g, '')})} 
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-neutral-900 text-white py-3 rounded-md font-bold hover:bg-black transition-colors border border-transparent shadow-lg">Continue to Payment</button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 font-serif text-neutral-900">Payment Method</h2>
              {error && (
                  <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md flex items-center text-sm font-medium">
                      <AlertCircle size={16} className="mr-2"/> {error}
                  </div>
              )}

               <div className="bg-neutral-50 p-4 rounded-lg mb-6 border border-neutral-200">
                  <h4 className="font-bold text-neutral-800 mb-2 flex items-center"><Truck size={18} className="mr-2"/> Order Summary</h4>
                  <div className="space-y-1">
                      <div className="flex justify-between text-sm text-neutral-700">
                          <span>Subtotal:</span>
                          <span className="font-medium">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-neutral-700">
                          <span>Delivery Charge:</span>
                          <span className="font-medium">{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
                      </div>
                      
                      {/* Coupon Discount */}
                      {discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600 font-medium">
                              <span>Coupon Discount:</span>
                              <span>-₹{discount}</span>
                          </div>
                      )}

                      {/* Loyalty Discount */}
                      {pointsToRedeem > 0 && (
                          <div className="flex justify-between text-sm text-amber-600 font-medium">
                              <span>Loyalty Points Redeemed ({pointsToRedeem}):</span>
                              <span>-₹{pointsToRedeem}</span>
                          </div>
                      )}

                      <div className="flex justify-between text-sm text-neutral-700 pt-2 border-t border-neutral-200 mt-2">
                          <span className="font-bold">Total Payable:</span>
                          <span className="font-bold text-lg">₹{finalTotal}</span>
                      </div>
                      <div className="pt-2">
                         <p className="text-xs text-amber-600 flex items-center font-medium"><Gift size={12} className="mr-1"/> You will earn {potentialPoints} loyalty points with this order!</p>
                      </div>
                  </div>
              </div>

              {/* Loyalty Points Section */}
              <div className="mb-6 border border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-bold text-amber-900 flex items-center"><Gift size={16} className="mr-2"/> Loyalty Points</h3>
                      <span className="text-sm font-bold text-neutral-800">{userPoints} pts available</span>
                  </div>
                  <div className="flex items-center">
                       <input 
                         type="checkbox" 
                         id="usePoints"
                         checked={redeemPoints}
                         onChange={(e) => setRedeemPoints(e.target.checked)}
                         disabled={userPoints === 0}
                         className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                       />
                       <label htmlFor="usePoints" className={`ml-2 text-sm ${userPoints === 0 ? 'text-gray-400' : 'text-neutral-700 cursor-pointer'}`}>
                           Redeem points (1 Point = ₹1)
                       </label>
                  </div>
                  {userPoints === 0 && <p className="text-xs text-neutral-500 mt-1 pl-6">You don't have enough points yet.</p>}
              </div>

              {/* Coupon Section (Dropdown) */}
              <div className="mb-8 border border-neutral-200 rounded-lg p-4 bg-white">
                  <h3 className="text-sm font-bold text-neutral-700 mb-2 flex items-center"><Tag size={16} className="mr-2"/> Have a Coupon?</h3>
                  {couponCode ? (
                      <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3 rounded-md">
                          <div>
                              <span className="font-bold text-green-800">{couponCode}</span>
                              <span className="text-xs text-green-600 block">Coupon Applied</span>
                          </div>
                          <button onClick={handleRemoveCoupon} className="text-xs text-red-600 hover:text-red-800 font-bold underline">Remove</button>
                      </div>
                  ) : (
                      <div className="flex gap-2 items-center">
                          <div className="relative flex-1">
                              <select 
                                value={selectedCoupon}
                                onChange={(e) => setSelectedCoupon(e.target.value)}
                                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-black appearance-none"
                              >
                                  <option value="">Select a coupon...</option>
                                  {AVAILABLE_COUPONS.map(c => (
                                      <option key={c.code} value={c.code}>
                                          {c.code} - {c.description}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <button 
                            type="button" 
                            onClick={handleApplyCoupon}
                            disabled={!selectedCoupon}
                            className="bg-neutral-800 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-black transition-colors disabled:opacity-50"
                          >
                            Apply
                          </button>
                      </div>
                  )}
                  {couponMessage && !couponCode && (
                       <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{couponMessage.text}</p>
                  )}
              </div>
              
              <div className="space-y-4 mb-8">
                <div 
                  onClick={() => setPaymentMethod('UPI')}
                  className={`border rounded-lg p-4 cursor-pointer flex items-center justify-between transition-colors ${paymentMethod === 'UPI' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-neutral-200 hover:border-amber-300'}`}
                >
                  <div className="flex items-center">
                    <Wallet className={`mr-3 ${paymentMethod === 'UPI' ? 'text-amber-600' : 'text-neutral-500'}`} />
                    <span className="font-bold text-neutral-900">UPI ID</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-amber-600' : 'border-neutral-300'}`}>
                      {paymentMethod === 'UPI' && <div className="w-2.5 h-2.5 bg-amber-600 rounded-full"></div>}
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('CARD')}
                  className={`border rounded-lg p-4 cursor-pointer flex items-center justify-between transition-colors ${paymentMethod === 'CARD' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-neutral-200 hover:border-amber-300'}`}
                >
                  <div className="flex items-center">
                    <CreditCard className={`mr-3 ${paymentMethod === 'CARD' ? 'text-amber-600' : 'text-neutral-500'}`} />
                    <span className="font-bold text-neutral-900">Credit / Debit Card</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-amber-600' : 'border-neutral-300'}`}>
                      {paymentMethod === 'CARD' && <div className="w-2.5 h-2.5 bg-amber-600 rounded-full"></div>}
                  </div>
                </div>
              </div>

              {/* UPI Specific Flow */}
              {paymentMethod === 'UPI' && (
                <div className="bg-neutral-50 p-6 rounded-lg mb-6 border border-neutral-200">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Enter your UPI ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. mobile-number@upi" 
                    className="block w-full border border-neutral-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-neutral-500 mt-2">Payment request will be sent to your UPI app.</p>
                </div>
              )}

              {/* Card Specific Flow */}
              {paymentMethod === 'CARD' && (
                  <div className="bg-neutral-50 p-6 rounded-lg mb-6 border border-neutral-200 space-y-4">
                      <h3 className="font-bold text-neutral-900">Enter Card Details</h3>
                      <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white"
                            value={cardDetails.number}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                setCardDetails({...cardDetails, number: val.slice(0, 19)});
                            }}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase">Cardholder Name</label>
                          <input 
                            type="text" 
                            placeholder="Name on card"
                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-neutral-500 uppercase">Expiry Date</label>
                              <input 
                                type="text" 
                                placeholder="MM/YY"
                                maxLength={5}
                                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white"
                                value={cardDetails.expiry}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, '');
                                    if(val.length >= 3) val = val.slice(0,2) + '/' + val.slice(2);
                                    setCardDetails({...cardDetails, expiry: val.slice(0,5)});
                                }}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-neutral-500 uppercase">CVV</label>
                              <input 
                                type="password" 
                                placeholder="123"
                                maxLength={3}
                                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black bg-white"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                              />
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
                 <div>
                   <span className="block text-sm text-neutral-500">Total to pay</span>
                   <span className="text-2xl font-bold text-neutral-900">₹{finalTotal}</span>
                 </div>
                 <button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="bg-neutral-900 text-white px-8 py-3 rounded-md font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center shadow-lg"
                 >
                   {isProcessing ? <><Loader2 className="animate-spin mr-2"/> Processing...</> : 'Pay Now'}
                 </button>
              </div>
               <button onClick={() => setStep(1)} className="mt-4 text-sm text-neutral-500 underline hover:text-neutral-900">Back to Address</button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="p-8 text-center py-16">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 border-4 border-green-200">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2 font-serif">Payment Successful!</h2>
              <p className="text-neutral-500 mb-4">Your order has been placed successfully.</p>
              
              <div className="inline-block bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg mb-8">
                  <span className="text-amber-800 font-bold flex items-center"><Gift size={18} className="mr-2"/> You earned {earnedPoints} loyalty points!</span>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-6 max-w-sm mx-auto text-left mb-8 border border-neutral-200">
                 <p className="text-xs text-neutral-500 uppercase tracking-wide font-bold mb-1">Estimated Delivery</p>
                 <p className="font-bold text-neutral-900 mb-4 text-lg">{deliveryDate}</p>
                 <p className="text-xs text-neutral-500 uppercase tracking-wide font-bold mb-1">Delivering to</p>
                 <p className="font-bold text-neutral-900">{address.fullName}</p>
                 <p className="text-sm text-neutral-600">{address.street}, {address.city}</p>
              </div>

              <div className="space-x-4">
                <button onClick={() => navigate('/shop')} className="inline-block px-6 py-3 border border-neutral-300 rounded-md text-neutral-700 font-bold hover:bg-neutral-50 transition-colors">Continue Shopping</button>
                <button onClick={() => navigate('/profile')} className="inline-block px-6 py-3 bg-amber-500 rounded-md text-black font-bold hover:bg-amber-400 transition-colors shadow-md">View Orders</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;
