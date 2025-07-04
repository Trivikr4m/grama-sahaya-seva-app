
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Calendar, MapPin, Phone, User } from 'lucide-react';

interface Complaint {
  id: string;
  name: string;
  mobile: string;
  category: string;
  description: string;
  location: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  dateSubmitted: string;
  photoUrl?: string;
  remarks?: string;
}

const TrackComplaint = () => {
  const [searchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('id')) {
      handleSearch(searchParams.get('id')!);
    }
  }, [searchParams]);

  const handleSearch = (id?: string) => {
    const searchId = id || complaintId;
    if (!searchId.trim()) {
      setError('Please enter a complaint ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      const foundComplaint = complaints.find((c: Complaint) => c.id === searchId);

      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        setError('Complaint not found. Please check your complaint ID.');
        setComplaint(null);
      }
    } catch (err) {
      setError('Error retrieving complaint data.');
      setComplaint(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <Card className="shadow-lg mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">Track Your Complaint</CardTitle>
              <p className="text-gray-600">Enter your complaint ID to check the status</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="complaintId">Complaint ID</Label>
                  <Input
                    id="complaintId"
                    type="text"
                    placeholder="Enter your complaint ID (e.g., VV123456)"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="sm:self-end">
                  <Button
                    onClick={() => handleSearch()}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Complaint Details */}
          {complaint && (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Complaint #{complaint.id}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Category: {complaint.category}
                    </p>
                  </div>
                  <Badge className={`px-3 py-1 ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Complaint Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Submitted by</p>
                        <p className="font-medium text-gray-800">{complaint.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Mobile</p>
                        <p className="font-medium text-gray-800">{complaint.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date Submitted</p>
                        <p className="font-medium text-gray-800">
                          {new Date(complaint.dateSubmitted).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {complaint.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-gray-800">{complaint.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Description</p>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                        {complaint.description}
                      </p>
                    </div>

                    {complaint.remarks && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Admin Remarks</p>
                        <p className="text-gray-800 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                          {complaint.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo */}
                {complaint.photoUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Attached Photo</p>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <img
                        src={complaint.photoUrl}
                        alt="Complaint"
                        className="max-w-full h-auto rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Status Timeline */}
                <div>
                  <p className="text-sm text-gray-500 mb-4">Status Timeline</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-800">Complaint Submitted</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(complaint.dateSubmitted).toLocaleDateString()}
                      </span>
                    </div>
                    {complaint.status !== 'Pending' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-800">Under Review</span>
                      </div>
                    )}
                    {complaint.status === 'Resolved' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-800">Issue Resolved</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;
