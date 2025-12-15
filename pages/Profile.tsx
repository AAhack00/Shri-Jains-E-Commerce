
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/store';
import { Package, User as UserIcon, MapPin, Edit2, Save, X, Gift, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, orders, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      phone: '',
      street: '',
      city: ''
  });

  if (!user) return <Navigate to="/login" />;

  const startEditing = () => {
      setFormData({
          name: user.name,
          phone: user.phone || '',
          street: user.street || '',
          city: user.city || ''
      });
      setIsEditing(true);
  };

  const handleSave = () => {
      updateProfile(formData);
      setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-serif text-neutral-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar - User Info */}
          <div className="col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-neutral-100 sticky top-24">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-neutral-900 flex items-center justify-center text-amber-500 font-bold text-2xl border-2 border-amber-500 flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-lg font-bold text-neutral-900 truncate">{user.name}</h2>
                  <p className="text-neutral-500 text-sm truncate">{user.email}</p>
                </div>
              </div>
              
              {/* Loyalty Points Card */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-black mb-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-20 rounded-full"></div>
                  <div className="relative z-10 flex justify-between items-center">
                      <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-900 opacity-70">Loyalty Points</p>
                          <p className="text-3xl font-black">{user.loyaltyPoints || 0}</p>
                      </div>
                      <Award size={32} className="text-amber-900 opacity-60" />
                  </div>
                  <p className="text-[10px] mt-2 font-medium opacity-80">Earn 1 point for every ₹100 spent</p>
              </div>

              {!isEditing ? (
                  <div className="space-y-4 mb-6 text-sm text-neutral-600">
                      <div className="flex items-start">
                          <UserIcon size={16} className="mt-1 mr-2 text-amber-500" />
                          <div>
                              <p className="font-bold text-neutral-800">Full Name</p>
                              <p>{user.name}</p>
                          </div>
                      </div>
                       <div className="flex items-start">
                          <MapPin size={16} className="mt-1 mr-2 text-amber-500" />
                          <div>
                              <p className="font-bold text-neutral-800">Address</p>
                              <p>{user.street || 'Not set'}, {user.city || 'Not set'}</p>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <div className="w-4 mr-2" />
                          <div>
                              <p className="font-bold text-neutral-800">Phone</p>
                              <p>{user.phone || 'Not set'}</p>
                          </div>
                      </div>
                      <button onClick={startEditing} className="w-full flex items-center justify-center py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 font-bold text-neutral-700 mt-4">
                          <Edit2 size={16} className="mr-2" /> Edit Profile
                      </button>
                  </div>
              ) : (
                  <div className="space-y-4 mb-6">
                      <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-1">Name</label>
                          <input type="text" className="w-full border border-neutral-300 rounded p-2 text-sm bg-white text-black" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-1">Phone</label>
                          <input type="text" className="w-full border border-neutral-300 rounded p-2 text-sm bg-white text-black" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-1">Street</label>
                          <input type="text" className="w-full border border-neutral-300 rounded p-2 text-sm bg-white text-black" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-1">City</label>
                          <input type="text" className="w-full border border-neutral-300 rounded p-2 text-sm bg-white text-black" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                      </div>
                      <div className="flex space-x-2">
                          <button onClick={handleSave} className="flex-1 bg-amber-500 text-black py-2 rounded font-bold flex items-center justify-center hover:bg-amber-400">
                              <Save size={16} className="mr-1" /> Save
                          </button>
                          <button onClick={() => setIsEditing(false)} className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded font-bold flex items-center justify-center hover:bg-neutral-300">
                              <X size={16} className="mr-1" /> Cancel
                          </button>
                      </div>
                  </div>
              )}

              <div className="border-t border-neutral-200 pt-4">
                 <button className="w-full text-left px-4 py-3 bg-amber-50 text-amber-800 rounded-md font-bold flex items-center border border-amber-100"><Package className="mr-3" size={18}/> Orders</button>
              </div>
            </div>
          </div>

          {/* Main Content - Orders */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6 border border-neutral-100">
              <h2 className="text-xl font-bold mb-6 font-serif text-neutral-900">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <Package size={48} className="mx-auto mb-4 text-neutral-300" />
                  <p>No orders found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex justify-between items-center flex-wrap gap-4">
                        <div>
                           <p className="text-xs text-neutral-500 uppercase font-bold">Order ID</p>
                           <p className="font-bold text-neutral-900">{order.id}</p>
                        </div>
                         <div>
                           <p className="text-xs text-neutral-500 uppercase font-bold">Placed On</p>
                           <p className="font-medium text-neutral-900">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                           <p className="text-xs text-neutral-500 uppercase font-bold">Delivery By</p>
                           <p className="font-medium text-amber-700">{order.deliveryDate || 'Pending'}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-neutral-500 uppercase font-bold">Total</p>
                           <p className="font-bold text-xl text-neutral-900">₹{order.total}</p>
                        </div>
                      </div>
                      <div className="px-6 py-4">
                        <ul className="divide-y divide-neutral-100">
                          {order.items.map(item => (
                            <li key={item.id} className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-12 w-12 bg-gray-100 rounded-md mr-4 overflow-hidden">
                                  <img src={item.image} className="w-full h-full object-cover"/>
                                </div>
                                <span className="text-neutral-800 font-medium">{item.name} <span className="text-neutral-500 text-sm">x {item.quantity}</span></span>
                              </div>
                              <span className="font-bold text-neutral-900">₹{item.price * item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                         <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-col gap-1 text-sm text-neutral-500">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>₹{order.deliveryCharge}</span>
                            </div>
                            {order.discount && order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                            )}
                         </div>
                         <div className="mt-4 flex justify-between items-center">
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                Status: {order.status}
                             </span>
                             {order.pointsEarned && order.pointsEarned > 0 && (
                                 <span className="text-xs font-bold text-amber-600 flex items-center">
                                     <Gift size={12} className="mr-1"/> +{order.pointsEarned} Points
                                 </span>
                             )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
