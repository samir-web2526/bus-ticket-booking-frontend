
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Clock,
  Star,
  Wifi,
  AirVent,
  Coffee,
  Music,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getBusById } from '@/src/services/buses.service';

interface Bus {
  id: string;
  name: string;
  type: string;
  operator: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  rating?: number;
  reviews?: number;
  amenities?: string[];
  isActive: boolean;
  description?: string;
}

interface UserRole {
  role: 'PASSENGER' | 'OPERATOR' | 'ADMIN' | null;
}

const BusDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const busId = params.id as string;

  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole['role']>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/v1/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.data?.role || null);
        }
      } catch (err) {
        console.error('[fetchUserRole]', err);
      }
    };

    fetchUserRole();
  }, []);

  // ✅ Fetch bus details using service function
  useEffect(() => {
    const loadBusDetails = async () => {
      try {
        setLoading(true);
        const result = await getBusById(busId);

        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setBus(result.data);
        } else {
          setError('No bus data found');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        console.error('[loadBusDetails]', message);
      } finally {
        setLoading(false);
      }
    };

    if (busId) {
      loadBusDetails();
    }
  }, [busId]);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId,
          seats: selectedSeats,
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      alert('Booking successful!');
      router.push('/bookings');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Booking failed';
      alert(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleSeat = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const occupancyPercentage = bus
    ? ((bus.totalSeats - bus.availableSeats) / bus.totalSeats) * 100
    : 0;

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="w-5 h-5" />,
    ac: <AirVent className="w-5 h-5" />,
    snacks: <Coffee className="w-5 h-5" />,
    entertainment: <Music className="w-5 h-5" />,
  };

  const isPassenger = userRole === 'PASSENGER';
  const isBookingDisabled = !bus?.isActive || bus.availableSeats === 0 || !isPassenger;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold">Bus Details</h1>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
          >
            <p className="text-red-700 font-semibold">{error}</p>
            <Button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
            >
              Go Back
            </Button>
          </motion.div>
        </div>
      )}

      {/* Bus Details */}
      {!loading && !error && bus && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bus Header Card */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{bus.name}</h2>
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {bus.type}
                        </span>
                        <span className="text-gray-700">by {bus.operator.name}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      {bus.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold text-gray-900">{bus.rating}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600">({bus.reviews} reviews)</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Route and Timing */}
                  <div className="mb-8">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Departure</p>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{bus.from}</p>
                        <p className="text-lg font-semibold text-blue-600">{bus.departureTime}</p>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                          {bus.duration}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Arrival</p>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{bus.to}</p>
                        <p className="text-lg font-semibold text-cyan-600">{bus.arrivalTime}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Amenities */}
                  {bus.amenities && bus.amenities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bus.amenities.map((amenity, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                          >
                            <div className="text-blue-600 mb-2">
                              {amenityIcons[amenity.toLowerCase()] || <CheckCircle className="w-6 h-6" />}
                            </div>
                            <p className="text-sm font-semibold text-gray-700 text-center">{amenity}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {bus.description && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{bus.description}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Operator Info Card */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-4">
                  <CardTitle className="text-gray-900">Operator Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {bus.operator.profileImage ? (
                      <img
                        src={bus.operator.profileImage}
                        alt={bus.operator.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
                        {bus.operator.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{bus.operator.name}</h3>
                      <p className="text-gray-600 mb-1">
                        📧 {bus.operator.email}
                      </p>
                      <p className="text-gray-600">
                        📱 {bus.operator.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-4"
              >
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      ৳{bus.price}
                    </h3>
                    <p className="text-blue-100">Per seat</p>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Availability Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold">Available Seats</span>
                        <span className="text-2xl font-bold text-blue-600">{bus.availableSeats}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${occupancyPercentage}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        />
                      </div>
                      <p className="text-xs text-gray-600">
                        {occupancyPercentage.toFixed(0)}% Full
                      </p>
                    </div>

                    <Separator />

                    {/* Selected Seats Summary */}
                    {selectedSeats.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Selected Seats ({selectedSeats.length})
                        </p>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                          ৳{bus.price * selectedSeats.length}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map((seat) => (
                            <Badge key={seat} className="bg-blue-600">
                              Seat {seat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* User Role Alert */}
                    {!isPassenger && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-900">
                            Only passengers can book
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            {userRole ? `You're logged in as ${userRole}` : 'Please log in as a passenger to book'}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Booking Button */}
                    <Button
                      onClick={handleBooking}
                      disabled={isBookingDisabled || bookingLoading}
                      className={`w-full h-12 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                        isBookingDisabled
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-blue-500/30'
                      }`}
                    >
                      {bookingLoading && <Loader className="w-4 h-4 animate-spin" />}
                      {bookingLoading ? 'Processing...' : 'Book Now'}
                    </Button>

                    {!bus.isActive && (
                      <p className="text-sm text-center text-red-600 font-semibold">
                        This bus is currently inactive
                      </p>
                    )}

                    {bus.availableSeats === 0 && (
                      <p className="text-sm text-center text-orange-600 font-semibold">
                        No seats available
                      </p>
                    )}

                    {selectedSeats.length === 0 && isPassenger && bus.isActive && (
                      <p className="text-xs text-center text-gray-600">
                        Select seats below to proceed
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Seat Selection - Only for passengers */}
          {isPassenger && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-gray-900">Select Your Seats</CardTitle>
                  <CardDescription>Click on empty seats to select them</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Seat Layout Instructions */}
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-semibold">💡 Tip: Seats arranged as 2 left + aisle + 2 right</p>
                  </div>

                  <div className="flex justify-center overflow-x-auto">
                    <div className="space-y-3">
                      {/* Group seats by row */}
                      {Array.from({ length: Math.ceil(bus.totalSeats / 4) }).map((_, rowIdx) => {
                        const rowSeats = Array.from({ length: 4 }, (_, i) => rowIdx * 4 + i + 1).filter(
                          (num) => num <= bus.totalSeats
                        );

                        return (
                          <div key={rowIdx} className="flex items-center justify-center gap-4">
                            {/* Left seats (2) */}
                            <div className="flex gap-2">
                              {rowSeats.slice(0, 2).map((seatNum) => {
                                const isBooked = seatNum > bus.availableSeats;
                                const isSelected = selectedSeats.includes(seatNum);

                                return (
                                  <motion.button
                                    key={seatNum}
                                    whileHover={!isBooked ? { scale: 1.1 } : {}}
                                    whileTap={!isBooked ? { scale: 0.95 } : {}}
                                    onClick={() => !isBooked && toggleSeat(seatNum)}
                                    className={`w-12 h-12 rounded-lg font-bold text-sm transition-all duration-300 ${
                                      isBooked
                                        ? 'bg-red-500 text-white cursor-not-allowed border-2 border-red-600 shadow-md shadow-red-300'
                                        : isSelected
                                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                          : 'bg-green-100 text-green-700 border-2 border-green-300 hover:border-green-400'
                                    }`}
                                  >
                                    {seatNum}
                                  </motion.button>
                                );
                              })}
                            </div>

                            {/* Aisle */}
                            <div className="w-8 text-center text-xs text-gray-500 font-semibold">
                              AISLE
                            </div>

                            {/* Right seats (2) */}
                            <div className="flex gap-2">
                              {rowSeats.slice(2, 4).map((seatNum) => {
                                const isBooked = seatNum > bus.availableSeats;
                                const isSelected = selectedSeats.includes(seatNum);

                                return (
                                  <motion.button
                                    key={seatNum}
                                    whileHover={!isBooked ? { scale: 1.1 } : {}}
                                    whileTap={!isBooked ? { scale: 0.95 } : {}}
                                    onClick={() => !isBooked && toggleSeat(seatNum)}
                                    className={`w-12 h-12 rounded-lg font-bold text-sm transition-all duration-300 ${
                                      isBooked
                                        ? 'bg-red-500 text-white cursor-not-allowed border-2 border-red-600 shadow-md shadow-red-300'
                                        : isSelected
                                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                          : 'bg-green-100 text-green-700 border-2 border-green-300 hover:border-green-400'
                                    }`}
                                  >
                                    {seatNum}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-center gap-8 mt-8 pt-8 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded" />
                      <span className="text-sm text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded" />
                      <span className="text-sm text-gray-700">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-500 border-2 border-red-600 rounded" />
                      <span className="text-sm text-gray-700">Booked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusDetailsPage;