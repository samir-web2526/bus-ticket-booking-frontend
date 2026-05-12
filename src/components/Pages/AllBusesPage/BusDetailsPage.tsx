'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Info,
  Settings,
  Sparkles,
  Armchair,
  DollarSign,
  Bus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getBusById } from '@/src/services/buses.service';

// Bus image helper
const getBusImage = (type: string) => {
  const images: Record<string, string> = {
    'AC': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    'NON_AC': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    'SLEEPER': 'https://images.unsplash.com/photo-1566251265329-97d350e66b37?w=800',
    'VOLVO': 'https://images.unsplash.com/photo-1583904571364-6363d754921b?w=800',
  };
  return images[type] || images['AC'];
};

interface Bus {
  id: string;
  name: string;
  type: string;
  number?: string;
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
              {/* Image Gallery */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                  <img 
                    src={getBusImage(bus.type)} 
                    alt={bus.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-4xl font-bold text-white mb-2">{bus.name}</h2>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                        {bus.type}
                      </Badge>
                      <span className="text-white/80">by {bus.operator.name}</span>
                    </div>
                  </div>
                </div>
                {/* Thumbnail Gallery */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-200 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all">
                        <img 
                          src={getBusImage(bus.type)} 
                          alt={`View ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Description / Overview */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Description & Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Experience a comfortable journey with our {bus.type} service from {bus.from} to {bus.to}. 
                    This bus offers premium amenities and reliable service for all passengers.
                  </p>
                  {bus.description && (
                    <p className="text-gray-600 leading-relaxed">{bus.description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Key Information / Specifications */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Key Information & Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Total Seats</p>
                      <p className="text-xl font-bold text-gray-900">{bus.totalSeats}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <Armchair className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Available</p>
                      <p className="text-xl font-bold text-green-600">{bus.availableSeats}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Price/Seat</p>
                      <p className="text-xl font-bold text-gray-900">৳{bus.price}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <Bus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Bus Number</p>
                      <p className="text-xl font-bold text-gray-900">{bus.number}</p>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  {/* Route and Timing */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Route & Schedule</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Departure</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{bus.from}</p>
                        <p className="text-lg font-semibold text-blue-600">{bus.departureTime}</p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-full">
                          {bus.duration}
                        </p>
                      </div>

                      <div className="text-center p-4 bg-cyan-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Arrival</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{bus.to}</p>
                        <p className="text-lg font-semibold text-cyan-600">{bus.arrivalTime}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {bus.amenities && bus.amenities.length > 0 && (
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      Amenities & Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
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
                  </CardContent>
                </Card>
              )}

              {/* Related Buses */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Bus className="w-5 h-5 text-blue-600" />
                    Related Buses on This Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <Link key={i} href={`/buses/${bus.id}`}>
                        <div className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{bus.name} Express {i}</span>
                            <Badge variant="outline" className="text-blue-600">{bus.type}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {bus.duration || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /> ৳{bus.price || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
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
                      ৳{bus?.price}
                    </h3>
                    <p className="text-blue-100">Per seat</p>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Availability Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold">Available Seats</span>
                        <span className="text-2xl font-bold text-blue-600">{bus?.availableSeats}</span>
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
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BusDetailsPage;